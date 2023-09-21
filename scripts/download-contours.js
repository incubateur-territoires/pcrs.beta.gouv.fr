#!/usr/bin/env node
/* eslint-disable import/no-unassigned-import */
import 'dotenv/config.js'

import process from 'node:process'
import {promisify} from 'node:util'
import {mkdir, writeFile} from 'node:fs/promises'
import zlib from 'node:zlib'
import Keyv from 'keyv'
import got from 'got'
import area from '@turf/area'

const gunzip = promisify(zlib.gunzip)

const MILLESIME = '2022'
const RESOLUTION = '100m'

await mkdir('./.db', {recursive: true})

if (process.env.GEODATA_CACHE_URL) {
  console.log(' * Téléchargement des contours à partir de l’adresse indiquée')

  await writeFile(
    './.db/contours.sqlite',
    await got(`${process.env.GEODATA_CACHE_URL}/contours.sqlite`).buffer()
  )

  await writeFile(
    './.db/superficies.json',
    await got(`${process.env.GEODATA_CACHE_URL}/superficies.json`).buffer()
  )

  console.log(' * Terminé !')
  process.exit(0)
}

const keyv = new Keyv('sqlite://.db/contours.sqlite')

await keyv.clear()

const superficies = []

async function storeLayer(layerName, getKey) {
  // Downloading dataset
  const url = `http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/${MILLESIME}/geojson/${layerName}-${RESOLUTION}.geojson.gz`
  const buffer = await got(url).buffer()

  // Extracting features
  const {features} = JSON.parse(await gunzip(buffer))

  // Storing features in key/value database
  await Promise.all(features.map(async feature => {
    const superficie = {
      territory: `${layerName}:${feature.properties.code}`,
      area: area(feature.geometry) / 1_000_000
    }

    superficies.push(superficie)

    const key = getKey(feature)
    await keyv.set(key, feature)
  }))
}

console.log('  * Téléchargement des contours des communes')
await storeLayer('communes', f => `commune:${f.properties.code}`)

console.log('  * Téléchargement des contours des EPCI')
await storeLayer('epci', f => `epci:${f.properties.code}`)

console.log('  * Téléchargement des contours des départements')
await storeLayer('departements', f => `departement:${f.properties.code}`)

console.log('  * Téléchargement des contours des régions')
await storeLayer('regions', f => `region:${f.properties.code}`)

console.log('  * Écriture des superficies')
await writeFile('./.db/superficies.json', JSON.stringify(superficies))
