/* eslint-disable camelcase */
/* eslint-disable unicorn/numeric-separators-style */

import test from 'ava'
import Joi from 'joi'
import {validateCreation, validateChanges, validateJoiDate, validatePerimetre, validateEtapesDates} from '../lib/projets-validator.js'

const validProjet = {
  nom: 'Projet Valide',
  regime: 'production',
  nature: 'raster',
  livrables: [
    {
      nom: 'Images raster',
      nature: 'geotiff',
      diffusion: 'wms',
      diffusion_url: 'https://ign-fun.fr',
      diffusion_layer: 'couche',
      licence: 'ouvert_lo',
      avancement: 18,
      stockage: 'ftp',
      stockage_params: {
        host: 'mon-serveur.fr'
      },
      date_livraison: '2020-11-28'
    }
  ],
  acteurs: [
    {
      siren: 200047389,
      nom: 'FDEA08',
      telephone: '+33324594528',
      role: 'aplc'
    },
    {siren: 444608442, nom: 'Enedis', role: 'financeur'}
  ],
  perimetres: ['departement:08'],
  etapes: [
    {statut: 'investigation', date_debut: '1999-01-11'},
    {statut: 'prod_en_cours', date_debut: '1999-02-11'},
    {statut: 'disponible', date_debut: '2010-10-12'}
  ],
  subventions: [{nom: 'Participation feder', nature: 'feder'}],
  reutilisations: [{titre: 'Reutilisation', lien: 'https://reutilisation.fr', description: ''}]
}

const invalidProjet = {
  regime: 'productio',
  nature: 'rastèr',
  livrables: [
    {
      nom: 'Images raster',
      nature: 'geotouff',
      diffusion: 'flox',
      diffusion_layer: 'couche',
      diffusion_url: 'bonjour',
      licence: 'ouverte_lo',
      avancement: '12'
    }
  ],
  acteurs: [
    {
      siren: 2000473890,
      nom: 'FDEA08',
      telephone: '+33324594528333',
      role: 'apIc'
    },
    {siren: 444608442, nom: 'Eneonze', role: 'financeuse'}
  ],
  perimetres: ['departement:00'],
  etapes: [
    {statut: 'investigation', date_debut: null},
    {statut: 'prod_en_cours', date_debut: '1999-02-11'},
    {statut: 'disponible', date_debut: '2010-13-12'}
  ],
  subventions: [{nom: 'Participation feder', ntr: 'feder'}],
  reutilisations: [{titre: 'Reutilisation', lien: 'reutilisation.fr', description: ''}]
}

// Test validatePerimetre

test('Valid perimetre, departement', t => {
  t.is(validatePerimetre('departement:55'), 'departement:55')
})

test('Invalid perimetre, departement', t => {
  const error = t.throws(() => {
    validatePerimetre('departement:666')
  }, {instanceOf: Error})

  t.is(error.message, 'Territory not found: departement:666')
})

test('Valid perimetre, epci', t => {
  t.is(validatePerimetre('epci:200038990'), 'epci:200038990')
})

test('Invalid perimetre, epci', t => {
  const error = t.throws(() => {
    validatePerimetre('epci:666')
  }, {instanceOf: Error})

  t.is(error.message, 'Territory not found: epci:666')
})

test('Valid perimetre, commune', t => {
  t.is(validatePerimetre('commune:55500'), 'commune:55500')
})

test('Invalid perimetre, commune', t => {
  const error = t.throws(() => {
    validatePerimetre('commune:666')
  }, {instanceOf: Error})

  t.is(error.message, 'Territory not found: commune:666')
})

// Test validateCreation

test('Create valid projet', t => {
  t.notThrows(() => validateCreation(validProjet))
})

test('Create invalid projet', t => {
  const error = t.throws(() => {
    validateCreation(invalidProjet)
  }, {instanceOf: Error})

  t.is(error.details.length, 16)
  t.is(error.details[0].message, 'La clé "nom" est obligatoire')
  t.is(error.details[1].message, 'Ce type de régime n’est pas valide')
  t.is(error.details[2].message, 'Cette nature n’est pas valide')
  t.is(error.details[3].message, 'Cette nature n’est pas valide')
  t.is(error.details[4].message, 'Ce type de licence n’est pas valide')
  t.is(error.details[5].message, 'Ce type de diffusion n’est pas valide')
  t.is(error.details[6].message, 'L’URL de diffusion n’est pas valide')
  t.is(error.details[7].message, 'L’avancement doit être un nombre')
  t.is(error.details[8].message, 'Le numéro de téléphone est invalide')
  t.is(error.details[9].message, 'Ce rôle n’existe pas')
  t.is(error.details[10].message, 'Ce rôle n’existe pas')
  t.is(error.details[11].message, 'Le territoire n’est pas valide')
  t.is(error.details[12].message, 'Date invalide')
  t.is(error.details[13].message, 'La nature est obligatoire')
  t.is(error.details[14].message, 'Une clé de l’objet est invalide')
})

// Test validateChanges

test('Update valid projet', t => {
  t.notThrows(() => validateChanges(validProjet))
})

test('Update invalid projet', t => {
  const error = t.throws(() => {
    validateChanges(invalidProjet)
  }, {instanceOf: Error})

  t.is(error.details.length, 14)
  t.is(error.details[0].message, 'Ce régime n’est pas valide')
  t.is(error.details[1].message, 'Cette nature n’est pas valide')
  t.is(error.details[2].message, 'Cette nature n’est pas valide')
  t.is(error.details[3].message, 'Ce type de licence n’est pas valide')
  t.is(error.details[4].message, 'Ce type de diffusion n’est pas valide')
  t.is(error.details[5].message, 'L’URL de diffusion n’est pas valide')
  t.is(error.details[6].message, 'L’avancement doit être un nombre')
  t.is(error.details[7].message, 'Le numéro de téléphone est invalide')
  t.is(error.details[8].message, 'Le rôle n’est pas valide')
  t.is(error.details[9].message, 'Le rôle n’est pas valide')
  t.is(error.details[10].message, 'Le territoire n’est pas valide')
  t.is(error.details[11].message, 'Date invalide')
  t.is(error.details[12].message, 'Une clé de l’objet est invalide')
})

// Test validateJoiDate

test('Joi/validateJoiDate : valid', t => {
  const result = Joi.custom(validateJoiDate).validate('2020-01-01')
  t.falsy(result.error)
  t.is(result.value, '2020-01-01')
})

test('Joi/validateJoiDate : not valid', t => {
  const notValidDates = [
    1,
    true,
    '2020',
    'foo',
    '2020-40-40',
    '2020-01-01T10:00:00.000Z',
    '10-10-10'
  ]

  for (const notValidDate of notValidDates) {
    const result = Joi.custom(validateJoiDate).validate(notValidDate)
    t.is(result.error.message, 'Date invalide')
  }
})

// Test validateEtapesDates

test('Joi/validateEtapesDates : not valid', t => {
  const result = Joi.custom(validateEtapesDates).validate([
    {statut: 'investigation', date_debut: '2023-07-16'},
    {statut: 'production', date_debut: '2024-02-21'},
    {statut: 'produit', date_debut: '2023-07-28'}
  ])

  t.is(result.error.message, 'L’ordre des étapes est incorrect')
})

test('Joi/validateEtapesDates : valid', t => {
  const result = Joi.custom(validateEtapesDates).validate([
    {statut: 'investigation', date_debut: '2023-07-16'},
    {statut: 'production', date_debut: '2023-07-28'},
    {statut: 'produit', date_debut: '2023-08-28'}
  ])

  t.is(result.value.length, 3)
})
