import express from 'express'
import createError from 'http-errors'
import w from '../util/w.js'
import {addCreator, deleteCreator, getCreatorById, getCreators, updateCreator} from '../admin/creators-emails.js'
import {ensureAdmin} from '../auth/middleware.js'
import {getUpdatedProjets} from '../admin/reports.js'

const creatorsEmailsRoutes = new express.Router()

creatorsEmailsRoutes.route('/:emailId')
  .all(w(ensureAdmin))
  .get(w(async (req, res) => {
    const email = await getCreatorById(req.params.emailId)

    if (!email) {
      throw createError(404, 'Email introuvable')
    }

    res.send(email)
  }))
  .delete(w(async (req, res) => {
    await deleteCreator(req.params.emailId)

    res.sendStatus(204)
  }))
  .put(w(async (req, res) => {
    const email = await updateCreator(req.params.emailId, req.body)

    res.send(email)
  }))

creatorsEmailsRoutes.route('/')
  .all(w(ensureAdmin))
  .get(w(async (req, res) => {
    const emails = await getCreators()

    res.send(emails)
  }))
  .post(w(async (req, res) => {
    const email = await addCreator(req.body)

    res.send(email)
  }))

creatorsEmailsRoutes.get('/report', w(ensureAdmin), w(async (req, res) => {
  const since = new Date(req.query.since)
  const validDate = Number.isNaN(since.valueOf()) ? new Date('2010-01-01') : since

  const report = await getUpdatedProjets(validDate)
  res.send(report)
}))

export default creatorsEmailsRoutes
