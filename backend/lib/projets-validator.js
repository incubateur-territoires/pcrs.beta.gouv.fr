/* eslint-disable camelcase */

import Joi from 'joi'
import {validatePayload} from '../util/payload.js'
import {ensureTerritoireExists} from './territoires.js'

function validatePerimetre(perimetre) {
  const fields = perimetre.split(':')

  if (!['epci', 'departement', 'commune'].includes(fields[0])) {
    throw new Error('Le type de territoire est invalide')
  }

  // Check if territory exist
  ensureTerritoireExists(perimetre)

  return perimetre
}

export function validateJoiDate(date, helpers) {
  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return helpers.message('Date invalide')
  }

  const parsedDate = new Date(date)

  if (parsedDate.toString() === 'Invalid Date') {
    return helpers.message('Date invalide')
  }

  return date
}

export function validateEtapesDates(etapes, helpers) {
  let hasError

  etapes.forEach((etape, x) => {
    if (x > 0 && new Date(etapes[x - 1].date_debut) > new Date(etape.date_debut)) {
      hasError = true
    }
  })

  if (hasError) {
    return helpers.message('L’ordre des étapes est incorrect')
  }

  return etapes
}

const acteursSchemaCreation = Joi.object().keys({
  siren: Joi.number().required().messages({
    'number.base': 'Le siren doit être un nombre',
    'any.required': 'Le siren est obligatoire'
  }),
  nom: Joi.string().allow(null).messages({
    'string.base': 'Le nom doit être une chaine de caractères',
    'string.empty': 'Le nom ne peut pas être vide'
  }),
  interlocuteur: Joi.string().allow(null).messages({
    'string.base': 'L’interlocuteur doit être une chaine de caractères',
    'string.empty': 'Le champ interlocuteur ne peut pas être vide'
  }),
  mail: Joi.string().email().allow(null).messages({
    'string.base': 'L’adresse courriel doit être une chaine de caractères',
    'string.email': 'L’adresse courriel n’est pas valide'
  }),
  telephone: Joi.string().pattern(/^((\+)33|0|0033)[1-9](\d{2}){4}$/).allow(null).messages({
    'string.base': 'Le numéro de téléphone doit être une chaine de caractères',
    'string.pattern.base': 'Le numéro de téléphone est invalide'
  }),
  role: Joi.valid(
    'aplc',
    'porteur',
    'financeur',
    'diffuseur',
    'presta_vol',
    'presta_lidar',
    'controleur'
  ).required().messages({
    'any.only': 'Ce rôle n’existe pas',
    'any.required': 'Le rôle est obligatoire'
  }),
  finance_part_perc: Joi.number().allow(null).messages({
    'number.base': 'Le financement doit être un nombre'
  }),
  finance_part_euro: Joi.number().allow(null).messages({
    'number.base': 'Le financement doit être un nombre'
  })
}).messages({
  'object.unknown': 'Une clé de l’objet est invalide'
})

const etapesSchemaCreation = Joi.object().keys({
  statut: Joi.valid(
    'investigation',
    'convention_signee',
    'marche_public_en_cours',
    'prod_en_cours',
    'controle_en_cours',
    'realise',
    'disponible',
    'obsolete'
  ).required().messages({
    'any.only': 'Cette étape n’existe pas',
    'any.required': 'Une étape est obligatoire'
  }),
  date_debut: Joi.custom(validateJoiDate).allow(null).required().messages({
    'any.required': 'Une date est obligatoire'
  })
}).messages({
  'object.unknown': 'Une clé de l’objet est invalide'
})

const livrablesSchemaCreation = Joi.object().keys({
  nom: Joi.string().required().messages({
    'string.base': 'Le nom doit être une chaine de caractères',
    'any.required': 'Le nom est obligatoire',
    'string.empty': 'Le nom ne peut pas être vide'
  }),
  nature: Joi.valid(
    'geotiff',
    'jpeg2000',
    'gml',
    'dxf',
    'dwg',
    'gpkg'
  ).required().messages({
    'any.only': 'Cette nature n’est pas valide',
    'any.required': 'La nature est obligatoire'
  }),
  licence: Joi.valid(
    'ouvert_lo',
    'ouvert_odbl',
    'ferme'
  ).required().messages({
    'any.only': 'Ce type de licence n’est pas valide',
    'any.required': 'Le type de licence est obligatoire'
  }),
  diffusion: Joi.valid(
    'wms',
    'wmts',
    'wfs',
    'tms',
    'none'
  ).allow(null).messages({
    'any.only': 'Ce type de diffusion n’est pas valide'
  }),
  diffusion_url: Joi.string().uri().allow(null).messages({
    'string.base': 'L’URL de diffusion doit être une chaine de caractères',
    'string.uri': 'L’URL de diffusion n’est pas valide'
  }),
  diffusion_layer: Joi.string().allow(null).messages({
    'string.base': 'La nom de la couche doit être une chaine de caractères'
  }),
  date_livraison: Joi.custom(validateJoiDate).allow(null),
  cout: Joi.number().integer().allow(null).messages({
    'number.base': 'Le coût doit être un nombre entier'
  }),
  avancement: Joi.number().allow(null).messages({
    'number.base': 'L’avancement doit être un nombre'
  }),
  recouvr_lat: Joi.number().allow(null).messages({
    'number.base': 'Le recouvrement doit être un nombre'
  }),
  recouvr_lon: Joi.number().allow(null).messages({
    'number.base': 'Le recouvrement doit être un nombre'
  }),
  focale: Joi.number().integer().allow(null).messages({
    'number.base': 'La focale doit être un nombre entier'
  }),
  stockage: Joi.valid(
    'http',
    'ftp',
    'sftp'
  ).allow(null).messages({
    'any.only': 'Ce type de stockage n’est pas valide'
  }),
  stockage_public: Joi.bool().allow(null),
  stockage_telechargement: Joi.bool().allow(null),
  stockage_params: Joi.object()
}).custom((value, helpers) => {
  const {diffusion_url, diffusion_layer} = value

  if ((diffusion_url && !diffusion_layer) || (!diffusion_url && diffusion_layer)) {
    return helpers.error('both.diffusionRequired', {field: 'diffusion_layer ou diffusion_url'})
  }

  return value
}, 'Validation de diffusion')
  .prefs({
    messages: {
      'both.diffusionRequired': 'Les champs diffusion_url et diffusion_layer doivent être renseignés ensemble ou laissés vides',
      'object.unknown': 'Une clé de l’objet est invalide'
    }
  })

const subventionsSchemaCreation = Joi.object().keys({
  nom: Joi.string().required().messages({
    'string.base': 'Le nom doit être une chaine de caractères',
    'any.required': 'Le nom est obligatoire',
    'string.empty': 'Le nom ne peut pas être vide'
  }),
  nature: Joi.valid(
    'feder',
    'cepr',
    'detr'
  ).required().messages({
    'any.only': 'Cette nature n’est pas valide',
    'any.required': 'La nature est obligatoire'
  }),
  montant: Joi.number().allow(null).messages({
    'number.base': 'Le montant doit être un nombre'
  }),
  echeance: Joi.custom(validateJoiDate).allow(null)
}).messages({
  'object.unknown': 'Une clé de l’objet est invalide'
})

const reutilisationsSchemaCreation = Joi.object({
  titre: Joi.string().required().messages({
    'string.base': 'Le titre doit être une chaine de caractères',
    'any.required': 'Le titre est obligatoire',
    'string.empty': 'Le titre ne peut pas être vide'
  }),
  lien: Joi.string().uri().required().messages({
    'string.base': 'Le lien doit être une chaine de caractères',
    'string.uri': 'Le lien n’est pas valide',
    'any.required': 'Le lien est obligatoire'
  }),
  description: Joi.string().allow('', null).messages({
    'string.base': 'La description doit être une chaine de caractères'
  }),
  imageKey: Joi.string().allow(null).messages({
    'string.base': 'La clé de l’image doit être une chaine de caractères'
  }),
  imageURL: Joi.string().uri().allow(null).messages({
    'string.base': 'L’URL de l’image doit être une chaine de caractères',
    'string.uri': 'L’URL de l’image n’est pas valide'
  })
})

const schemaCreation = Joi.object({
  nom: Joi.string()
    .min(3)
    .required().messages({
      'string.min': 'Le nom doit faire plus de trois caractères',
      'any.required': 'La clé "nom" est obligatoire',
      'string.empty': 'Le nom ne peut pas être vide'
    }),
  regime: Joi.valid(
    'production',
    'maj',
    'anticipation'
  ).required().messages({
    'any.only': 'Ce type de régime n’est pas valide',
    'any.required': 'La clé "regime" est obligatoire'
  }),
  nature: Joi.valid(
    'vecteur',
    'raster',
    'mixte'
  ).required().messages({
    'any.only': 'Cette nature n’est pas valide',
    'any.required': 'La clé "nature" est obligatoire'
  }),
  budget: Joi.number().integer().allow(null).messages({
    'number.base': 'Le budget doit être un nombre'
  }),
  livrables: Joi.array().items(livrablesSchemaCreation).required().messages({
    'array.base': 'Les livrables doivent être dans un tableau',
    'any.required': 'La clé "livrables" est obligatoire'
  }),
  acteurs: Joi.array().items(acteursSchemaCreation).required().messages({
    'array.base': 'Les acteurs doivent être dans un tableau',
    'any.required': 'La clé "acteurs est obligatoire"'
  }),
  perimetres: Joi.array().items(Joi.string().custom(validatePerimetre)).min(1).required().messages({
    'array.base': 'Les périmètres doivent être dans un tableau',
    'any.required': 'La clé "perimetres" est obligatoire',
    'any.custom': 'Le territoire n’est pas valide'
  }),
  etapes: Joi.array().items(etapesSchemaCreation).required().messages({
    'array.base': 'Les étapes doivent être dans un tableau',
    'any.required': 'La clé "etapes" est obligatoire'
  }),
  subventions: Joi.array().items(subventionsSchemaCreation).required().allow(null).messages({
    'array.base': 'Les subventions doivent être dans un tableau',
    'any.required': 'La clé "subventions" est obligatoire'
  }),
  reutilisations: Joi.array().items(reutilisationsSchemaCreation).allow(null).messages({
    'array.base': 'Les réutilisations doivent être dans un tableau'
  }),
  metaPerimetreMillesime: Joi.string().allow(null).messages({
    'string.base': 'Le millésime doit être une chaine de caractères'
  })
}).messages({
  'object.unknown': 'Une clé de l’objet est invalide'
})

const acteursSchemaUpdate = Joi.object().keys({
  siren: Joi.number().messages({
    'number.base': 'Le siren doit être un nombre'
  }),
  nom: Joi.string().allow(null).messages({
    'string.base': 'Le nom doit être une chaine de caractères',
    'string.empty': 'Le nom ne peut pas être vide'
  }),
  interlocuteur: Joi.string().allow(null).messages({
    'string.base': 'L’interlocuteur doit être une chaine de caractères',
    'string.empty': 'Le champ interlocuteur ne peut pas être vide'
  }),
  mail: Joi.string().email().allow(null).messages({
    'string.base': 'L’adresse courriel doit être une chaine de caractères',
    'string.email': 'L’adresse courriel n’est pas valide'
  }),
  telephone: Joi.string().pattern(/^((\+)33|0|0033)[1-9](\d{2}){4}$/).allow(null).messages({
    'string.base': 'Le numéro de téléphone doit être une chaine de caractères',
    'string.pattern.base': 'Le numéro de téléphone est invalide'
  }),
  role: Joi.valid(
    'aplc',
    'porteur',
    'financeur',
    'diffuseur',
    'presta_vol',
    'presta_lidar',
    'controleur'
  ).messages({
    'any.only': 'Le rôle n’est pas valide'
  }),
  finance_part_perc: Joi.number().allow(null).messages({
    'number.base': 'Le financement doit être un nombre'
  }),
  finance_part_euro: Joi.number().allow(null).messages({
    'number.base': 'Le financement doit être un nombre'
  })
}).messages({
  'object.unknown': 'Une clé de l’objet est invalide'
})

const etapesSchemaUpdate = Joi.object().keys({
  statut: Joi.valid(
    'investigation',
    'convention_signee',
    'marche_public_en_cours',
    'prod_en_cours',
    'controle_en_cours',
    'realise',
    'disponible',
    'obsolete'
  ).messages({
    'any.only': 'Ce statut n’est pas valide'
  }),
  date_debut: Joi.custom(validateJoiDate).allow(null).required().messages({
    'any.required': 'Une date est obligatoire'
  })
}).messages({
  'object.unknown': 'Une clé de l’objet est invalide'
})

const livrablesSchemaUpdate = Joi.object().keys({
  nom: Joi.string().messages({
    'string.base': 'Le nom doit être une chaine de caractères',
    'string.empty': 'Le nom ne peut pas être vide'
  }),
  nature: Joi.valid(
    'geotiff',
    'jpeg2000',
    'gml',
    'dxf',
    'dwg',
    'gpkg'
  ).messages({
    'any.only': 'Cette nature n’est pas valide'
  }),
  licence: Joi.valid(
    'ouvert_lo',
    'ouvert_odbl',
    'ferme'
  ).messages({
    'any.only': 'Ce type de licence n’est pas valide'
  }),
  diffusion: Joi.valid(
    'wms',
    'wmts',
    'wfs',
    'tms',
    'none'
  ).allow(null).messages({
    'any.only': 'Ce type de diffusion n’est pas valide'
  }),
  diffusion_url: Joi.string().uri().allow(null).messages({
    'string.base': 'L’URL de diffusion doit être une chaine de caractères',
    'string.uri': 'L’URL de diffusion n’est pas valide'
  }),
  diffusion_layer: Joi.string().allow(null).messages({
    'string.base': 'La nom de la couche doit être une chaine de caractères'
  }),
  date_livraison: Joi.custom(validateJoiDate).allow(null),
  cout: Joi.number().integer().allow(null).messages({
    'number.base': 'Le coût doit être un nombre entier'
  }),
  avancement: Joi.number().allow(null).messages({
    'number.base': 'L’avancement doit être un nombre'
  }),
  recouvr_lat: Joi.number().allow(null).messages({
    'number.base': 'Le recouvrement doit être un nombre'
  }),
  recouvr_lon: Joi.number().allow(null).messages({
    'number.base': 'Le recouvrement doit être un nombre'
  }),
  focale: Joi.number().integer().allow(null).messages({
    'number.base': 'La focale doit être un nombre entier'
  }),
  stockage_id: Joi.string().allow(null),
  stockage: Joi.valid(
    'http',
    'ftp',
    'sftp'
  ).allow(null).messages({
    'any.only': 'Ce type de stockage n’est pas valide'
  }),
  stockage_public: Joi.bool().allow(null),
  stockage_telechargement: Joi.bool().allow(null),
  stockage_params: Joi.object().allow(null),
  stockage_erreur: Joi.string().allow(null)
}).custom((value, helpers) => {
  const {diffusion_url, diffusion_layer} = value

  if ((diffusion_url && !diffusion_layer) || (!diffusion_url && diffusion_layer)) {
    return helpers.error('both.diffusionRequired', {field: 'diffusion_layer ou diffusion_url'})
  }

  return value
}, 'Validation de diffusion')
  .prefs({
    messages: {
      'both.diffusionRequired': 'Les champs diffusion_url et diffusion_layer doivent être renseignés ensemble ou laissés vides',
      'object.unknown': 'Une clé de l’objet est invalide'
    }
  })

const subventionsSchemaUpdate = Joi.object().keys({
  nom: Joi.string().messages({
    'string.base': 'Le nom doit être une chaine de caractères',
    'string.empty': 'Le nom ne peut pas être vide'
  }),
  nature: Joi.valid(
    'feder',
    'cepr',
    'detr'
  ).messages({
    'any.only': 'Cette nature n’est pas valide'
  }),
  montant: Joi.number().allow(null).messages({
    'number.base': 'Le montant doit être un nombre'
  }),
  echeance: Joi.custom(validateJoiDate).allow(null)
}).messages({
  'object.unknown': 'Une clé de l’objet est invalide'
})

const reutilisationsSchemaUpdate = Joi.object().keys({
  titre: Joi.string().messages({
    'string.base': 'Le titre doit être une chaine de caractères',
    'string.empty': 'Le titre ne peut pas être vide'
  }),
  lien: Joi.string().uri().messages({
    'string.base': 'Le lien doit être une chaine de caractères',
    'string.uri': 'Le lien n’est pas valide'
  }),
  description: Joi.string().allow('', null).messages({
    'string.base': 'La description doit être une chaine de caractères'
  }),
  imageKey: Joi.string().allow(null).messages({
    'string.base': 'La clé de l’image doit être une chaine de caractères'
  }),
  imageURL: Joi.string().uri().allow(null).messages({
    'string.base': 'L’URL de l’image doit être une chaine de caractères',
    'string.uri': 'L’URL de l’image n’est pas valide'
  })
}).messages({
  'object.unknown': 'Une clé de l’objet est invalide'
})

const schemaUpdate = Joi.object({
  nom: Joi.string()
    .min(3).messages({
      'string.base': 'Le nom doit être une chaine de caractères',
      'string.min': 'Le nom doit comporter au moins trois caractères',
      'string.empty': 'Le nom ne peut être vide'
    }),
  regime: Joi.valid(
    'production',
    'maj',
    'anticipation'
  ).messages({
    'any.only': 'Ce régime n’est pas valide'
  }),
  nature: Joi.valid(
    'vecteur',
    'raster',
    'mixte'
  ).messages({
    'any.only': 'Cette nature n’est pas valide'
  }),
  budget: Joi.number().integer().allow(null).messages({
    'number.base': 'Le budget doit être un nombre'
  }),
  livrables: Joi.array().items(livrablesSchemaUpdate).messages({
    'array.base': 'Les livrables doivent être dans un tableau'
  }),
  acteurs: Joi.array().items(acteursSchemaUpdate).messages({
    'array.base': 'Les acteurs doivent être dans un tableau'
  }),
  perimetres: Joi.array().items(Joi.string().custom(validatePerimetre)).messages({
    'array.base': 'Les périmètres doivent être dans un tableau',
    'any.custom': 'Le territoire n’est pas valide'
  }),
  etapes: Joi.array().items(etapesSchemaUpdate).messages({
    'array.base': 'Les étapes doivent être dans un tableau'
  }),
  subventions: Joi.array().items(subventionsSchemaUpdate).allow(null).messages({
    'array.base': 'Les subventions doivent être dans un tableau'
  }),
  reutilisations: Joi.array().items(reutilisationsSchemaUpdate).messages({
    'array.base': 'Les réutilisations doivent être dans un tableau'
  }),
  metaPerimetreMillesime: Joi.string().allow(null).messages({
    'string.base': 'Le millésime doit être une chaine de caractères'
  })
}).messages({
  'object.unknown': 'Une clé de l’objet est invalide'
})

function validateCreation(projet) {
  return validatePayload(projet, schemaCreation)
}

function validateChanges(changes) {
  return validatePayload(changes, schemaUpdate)
}

export {validateCreation, validateChanges, validatePerimetre}
