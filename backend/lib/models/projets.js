/* eslint-disable camelcase */
import createError from 'http-errors'
import {omit} from 'lodash-es'
import {nanoid} from 'nanoid'
import mongo from '../../util/mongo.js'
import {findClosestEtape} from '../../../shared/find-closest-etape.js'
import {buildGeometryFromTerritoires, getTerritoiresProperties} from '../territoires.js'
import {validateCreation, validateChanges} from '../projets-validator.js'
import {attachStorage} from '../api-scanner.js'
import {deleteImage} from './image-upload.js'

export function expandProjet(projet) {
  const territoires = projet?.perimetres?.map(p => getTerritoiresProperties(p)) || null

  return {
    ...projet,
    territoires
  }
}

async function addStockageId(livrables) {
  const updatedLivrables = await Promise.all(livrables.map(async livrable => {
    const type = livrable.stockage
    const params = livrable.stockage_params

    if (!type) {
      return livrable
    }

    try {
      const storageId = await attachStorage({type, params})

      return {
        ...livrable,
        stockage_id: storageId,
        stockage_erreur: null
      }
    } catch (error) {
      console.log(error)

      return {
        ...livrable,
        stockage_id: null,
        stockage_erreur: error.message
      }
    }
  }))

  return updatedLivrables
}

function computeEditorKey() {
  return nanoid()
}

export async function renewEditorKey(projet) {
  const {value} = await mongo.db.collection('projets').findOneAndUpdate(
    {_id: projet._id},
    {$set: {editorKey: computeEditorKey()}},
    {returnDocument: 'after'}
  )

  console.log('Le ' + new Date() + ' | Remplacement du jeton d’édition du projet ' + projet.nom + ', _id: ' + projet._id + ' | Ancien jeton : ' + projet.editorKey + ' | Nouveau jeton : ' + projet.editorKey)

  return value
}

export function filterSensitiveFields(projet) {
  const filteredLivrables = projet.livrables.map(livrable => {
    if (livrable.stockage_public) {
      return livrable
    }

    return omit(livrable, ['stockage_params'])
  })

  return {
    ...projet,
    editorKey: undefined,
    livrables: filteredLivrables
  }
}

export async function getProjets() {
  return mongo.db.collection('projets').find({_deleted: {$exists: false}}).toArray()
}

export async function getProjetByEditorKey(editorKey) {
  return mongo.db.collection('projets').findOne({editorKey, _deleted: {$exists: false}})
}

export async function getProjet(projetId) {
  projetId = mongo.parseObjectId(projetId)

  const projet = await mongo.db.collection('projets').findOne({_id: projetId, _deleted: {$exists: false}})

  return projet
}

async function copyProjetVersion(projet) {
  await mongo.db.collection('versions').insertOne({
    _projet: projet._id,
    _created: new Date(),
    content: projet
  })
}

export async function createProjet(payload, options = {}) {
  const projet = validateCreation(payload)
  const {creator} = options

  projet.creator = creator || 'admin'
  projet.editorKey = computeEditorKey()

  projet.livrables = await addStockageId(projet.livrables)

  mongo.decorateCreation(projet)

  try {
    await mongo.db.collection('projets').insertOne(projet)
  } catch (error) {
    if (error.message.includes('E11000')) {
      throw createError(409, 'Un projet avec un nom identique est déjà présent.')
    }

    throw error
  }

  await copyProjetVersion(projet)

  return projet
}

export async function deleteProjet(projetId) {
  const projetToDelete = await mongo.db.collection('projets').findOne({
    _id: mongo.parseObjectId(projetId),
    _deleted: {$exists: false}
  })

  if (projetToDelete?.reutilisations?.some(reutilisation => reutilisation.imageKey)) {
    const deletePromises = projetToDelete.reutilisations
      .filter(reutilisation => reutilisation.imageKey)
      .map(reutilisation => deleteImage(reutilisation.imageKey))

    await Promise.all(deletePromises)
  }

  await mongo.db.collection('projets').findOneAndUpdate(
    {_id: mongo.parseObjectId(projetId), _deleted: {$exists: false}},
    {$set: {
      _deleted: new Date(),
      _updated: new Date()
    }}
  )
}

export async function updateProjet(id, payload) {
  const projet = validateChanges(payload)

  projet.livrables &&= await addStockageId(projet.livrables)

  mongo.decorateUpdate(projet)

  if (Object.keys(projet).length === 0) {
    throw createError(400, 'Le contenu de la requête est invalide (aucun champ valide trouvé)')
  }

  try {
    const value = await mongo.db.collection('projets').findOneAndUpdate(
      {_id: id, _deleted: {$exists: false}},
      {$set: projet},
      {returnDocument: 'after'}
    )

    if (!value) {
      throw createError(404, 'Le projet est introuvable')
    }

    await copyProjetVersion(value)

    return value
  } catch (error) {
    if (error.codeName === 'DuplicateKey') {
      throw createError(409, 'Un projet avec le même nom est déjà existant, merci de modifier le champ "nom"')
    }

    throw error
  }
}

export async function getProjetsGeojson() {
  const projets = await mongo.db.collection('projets').find({_deleted: {$exists: false}}).toArray()

  const projetsFeatures = await Promise.all(projets.map(async projet => {
    const closestPostStep = findClosestEtape(projet.etapes)

    return {
      type: 'Feature',
      geometry: await buildGeometryFromTerritoires(projet.perimetres),
      properties: {
        _id: projet._id,
        nom: projet.nom,
        statut: closestPostStep?.statut,
        dateStatut: closestPostStep?.date_debut,
        aplc: projet.acteurs.find(acteur => acteur.role === 'aplc' || acteur.role === 'porteur')?.nom || null,
        acteurs: projet.acteurs.map(acteur => acteur.nom?.toLowerCase() || null),
        nature: projet.nature,
        regime: projet.regime
      }
    }
  }))

  return projetsFeatures
}
