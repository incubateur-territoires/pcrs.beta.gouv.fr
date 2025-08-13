import createError from 'http-errors'
import {pick} from 'lodash-es'
import {nanoid} from 'nanoid'
import mongo from '../util/mongo.js'
import {validateEmail} from '../auth/pin-code/index.js'
import {sendMail} from '../util/sendmail.js'
import {formatEmail} from './email-template.js'

export async function getAdministrators() {
  return mongo.db.collection('administrators').find().project({token: 0}).toArray()
}

export async function getAdministratorByToken(token) {
  return mongo.db.collection('administrators').findOne({token})
}

export async function getAdministratorById(adminId) {
  adminId = mongo.parseObjectId(adminId)

  return mongo.db.collection('administrators').findOne({_id: adminId})
}

export async function isSelfDeleting(adminId, token) {
  const admin = await getAdministratorById(adminId)

  if (admin.token === token) {
    throw createError(403, 'Vous ne pouvez pas supprimer votre propre accès administrateur')
  }
}

export async function addAdministrator(administrator) {
  if (!validateEmail(administrator.email)) {
    throw createError(400, 'Cette adresse courriel est invalide')
  }

  mongo.decorateCreation(administrator)

  administrator.token = nanoid()

  const emailContent = formatEmail({token: administrator.token, userEmail: administrator.email})

  try {
    await mongo.db.collection('administrators').insertOne(administrator)
    await sendMail(emailContent, administrator.email)
  } catch (error) {
    if (error.message.includes('E11000')) {
      throw createError(409, 'Cette adresse courriel est déjà dans la liste.')
    }

    throw error
  }

  return administrator
}

export async function updateAdministrator(adminId, update) {
  const changes = pick(update, ['email', 'nom'])
  adminId = mongo.parseObjectId(adminId)

  if (changes.email !== undefined && !validateEmail(changes.email)) {
    throw createError(400, 'Cette adresse courriel est invalide')
  }

  mongo.decorateUpdate(changes)

  try {
    const value = await mongo.db.collection('administrators').findOneAndUpdate(
      {_id: adminId},
      {$set: {...changes}},
      {returnDocument: 'after'}
    )

    if (!value) {
      throw createError(404, 'Cet identifiant est introuvable')
    }

    return value
  } catch (error) {
    if (error.message.includes('E11000')) {
      throw createError(409, 'Cette adresse courriel est déjà dans la liste.')
    }

    throw error
  }
}

export async function deleteAdministrator(adminId) {
  adminId = mongo.parseObjectId(adminId)

  const deleted = await mongo.db.collection('administrators').deleteOne({_id: adminId})

  return Boolean(deleted)
}

