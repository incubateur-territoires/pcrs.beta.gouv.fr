import {useState, useEffect, useRef, useCallback} from 'react'
import Image from 'next/legacy/image'

import {debounce} from 'lodash-es'
import Page from '@/layouts/main.js'
import colors from '@/styles/colors.js'

import Section from '@/components/section.js'
import SelectInput from '@/components/select-input.js'
import AutocompleteInput from '@/components/autocomplete-input.js'
import NumberInput from '@/components/number-input.js'
import Tab from '@/components/ui/tab.js'

import {getCommuneByCode, getPerimetersByName} from '@/lib/decoupage-administratif-api.js'

const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://pcrs.beta.gouv.fr'

function formatNumber(number, maximumFractionDigits = 0) {
  return number.toLocaleString('fr', {maximumFractionDigits})
}

function formatSize(size) {
  const formatedSize = formatNumber(size)

  if (formatedSize.length >= 4) {
    return formatNumber(size / 1000) + ' To'
  }

  return formatedSize + ' Go'
}

const Calculatrice = () => {
  const [fileSize, setFileSize] = useState()
  const [foundPerimetres, setFoundPerimetres] = useState([])
  const [searchValue, setSearchValue] = useState()
  const [territoryType, setTerritoryType] = useState()
  const [areas, setAreas] = useState([])
  const [areasTotalSize, setAreasTotalSize] = useState()
  const [sizeInGigas, setSizeInGigas] = useState()
  const [compression, setCompression] = useState('GeoTIFF/Non-compressé')
  const [margin, setMargin] = useState('10%')
  const [marginValue, setMarginValue] = useState(0.1)
  const [pixelDensity, setPixelDensity] = useState(5)
  const [errorMessage, setErrorMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('territoire')

  function getMarginValue(label) {
    const marginValues = [
      {label: '10%', value: 0.1},
      {label: '15%', value: 0.15},
      {label: '20%', value: 0.2}
    ]

    return marginValues.find(v => v.label === label).value
  }

  const fetchPerimetres = useRef(debounce(async (nom, type, signal) => {
    const inputToNumber = Number.parseInt(nom, 10)
    const isInputNumber = !Number.isNaN(inputToNumber)

    try {
      if (isInputNumber && type === 'commune') {
        const perimetre = await getCommuneByCode(nom, signal)
        setFoundPerimetres([perimetre])
      } else {
        const perimetres = await getPerimetersByName(nom, type, signal)
        // Get a collection
        setFoundPerimetres(perimetres)
      }
    } catch {
      if (!signal.aborted) {
        setFoundPerimetres([])
      }
    }
  }, 300))

  const handleCalculatorTypeChange = type => {
    setActiveTab(type)
    setSizeInGigas()
    setAreas([])
    setFileSize()
  }

  const handleSelect = debounce(async ({code}) => {
    const foundPerimetreName = foundPerimetres.find(result => result.code === code).nom

    try {
      const response = await fetch(`${API_BASE_URL}/calculator/territory-area/${territoryType}${territoryType === 'epci' ? '' : 's'}:${code}`)
      const area = await response.json()

      if (areas.some(area => area.code === code)) {
        setErrorMessage('Ce territoire est déjà dans la liste !')
      } else {
        setAreas([...areas, {surface: area.surface, nom: foundPerimetreName, code}])
      }
    } catch (error) {
      throw new Error(error)
    }

    setSearchValue('')
  }, 300)

  const handleRemoveTerritory = useCallback(territoryName => {
    const updatedArray = areas.filter(a => a.nom !== territoryName)

    setAreas(updatedArray)

    if (updatedArray.length === 0) {
      setSizeInGigas(null)
      setAreasTotalSize(null)
    }
  }, [areas])

  const handleAreaToSize = useCallback(async areasTotalSize => {
    const formatCompression = [
      {label: 'GeoTIFF/Non-compressé', value: 1},
      {label: 'GeoTIFF/LZW', value: 0.6},
      {label: 'GeoTIFF/Deflate', value: 0.55},
      {label: 'JPEG2000/Lossless', value: 0.55},
      {label: 'JPEG2000/Lossy', value: 0.25}
    ]

    try {
      const response = await fetch(`${API_BASE_URL}/calculator/area`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          area: areasTotalSize,
          compression: formatCompression.find(f => f.label === compression).value,
          margin: marginValue,
          resolution: Number.parseInt(pixelDensity, 10)
        })
      })

      const areaToGigas = await response.json()

      setSizeInGigas(areaToGigas)
    } catch (error) {
      throw new Error(error)
    }
  }, [compression, pixelDensity, marginValue])

  useEffect(() => {
    if (areasTotalSize) {
      handleAreaToSize(areasTotalSize)
    }
  }, [areasTotalSize, handleAreaToSize])

  useEffect(() => {
    if (!searchValue || searchValue.length < 2) {
      setFoundPerimetres([])
      return
    }

    const ac = new AbortController()
    fetchPerimetres.current(searchValue, territoryType, ac.signal)

    return () => {
      ac.abort()
    }
  }, [searchValue, territoryType, fetchPerimetres])

  useEffect(() => {
    if (areas.length > 0) {
      let result = 0

      for (const area of areas) {
        result += Number.parseFloat(area.surface)
      }

      setAreasTotalSize(result)
    }
  }, [areas])

  useEffect(() => {
    if (searchValue) {
      setErrorMessage(null)
    }
  }, [searchValue])

  return (
    <Page title='Calculateur de coûts' description='Calculez les coûts d’hébergement de votre livrable'>
      <div className='fr-my-5w' style={{textAlign: 'center'}}>
        <Image
          src='/images/illustrations/calculator.png'
          height={200}
          width={200}
          alt=''
          aria-hidden='true'
        />
        <h2 className='fr-my-5w'>Calculateur de frais d’hébergement des données</h2>
      </div>
      <Section>
        <Tab
          activeTab={activeTab}
          tabs={[
            {value: 'territoire', label: 'Estimation à partir d’un territoire'},
            {value: 'fichier', label: 'Estimation à partir de la taille d’un fichier'}
          ]}
          handleActiveTab={handleCalculatorTypeChange}
        >
          <>
            {activeTab === 'territoire' && (
              <>
                <div className='fr-pt-1v'>
                  <div className='fr-notice fr-notice--info fr-my-3w'>
                    <div className='fr-container'>
                      <div className='fr-notice__body'>
                        <p className='fr-notice__title'>Constituez une liste de territoires afin de déterminer les frais d’hébergement des données sur l’ensemble</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='fr-grid-row'>
                  <div className='fr-col-lg-6 fr-col-12 fr-p-3w'>
                    <SelectInput
                      label='Type'
                      value={territoryType}
                      description='Le type de territoire à ajouter'
                      options={[
                        {label: 'EPCI', value: 'epci'},
                        {label: 'Commune', value: 'commune'},
                        {label: 'Département', value: 'departement'}
                      ]}
                      onValueChange={e => setTerritoryType(e.target.value)}
                    />
                  </div>
                  <div className='fr-col-lg-6 fr-col-12 fr-p-3w'>
                    {territoryType && (
                      <AutocompleteInput
                        isRequired
                        label={`Nom ${territoryType === 'commune' ? 'ou code' : ''}`}
                        value={searchValue}
                        description={`Recherche par nom ${territoryType === 'commune' ? ' ou code INSEE' : ''} du territoire`}
                        ariaLabel={`Rechercher par nom ${territoryType === 'commune' ? 'ou code INSEE' : ''} du territoire`}
                        results={foundPerimetres}
                        renderItem={({nom, code}) => `${nom} - ${code}`}
                        onInputChange={e => setSearchValue(e.target.value)}
                        onSelectValue={item => {
                          handleSelect(item)
                        }}
                      />
                    )}
                  </div>
                  <div className='error-message'>{errorMessage}</div>
                </div>
              </>
            )}

            {activeTab === 'fichier' && (
              <div className='fr-col-12 fr-p-3w'>
                <NumberInput
                  label='Taille du fichier'
                  description='Taille de votre fichier en gigaoctets'
                  value={fileSize}
                  onValueChange={e => setFileSize(e.target.value)}
                />
                {fileSize && (
                  <p>
                    L’hébergement seul, sans service associé, de ce volume de fichier chez un hébergeur moyen (0,01€/Go/mois) revient à <b>{(fileSize * 0.01) > 1 ? `${fileSize * 0.01} € HT / mois` : 'moins d’un euro HT par mois'}</b>.
                  </p>
                )}
              </div>
            )}

            <div>
              {areas.length > 0 && (
                <div className='fr-grid-row'>
                  <div className='fat-hr' />
                  <div className='fr-col-lg-6 fr-col-12 fr-p-2v fr-p-md-6v'>
                    <div className='fr-pb-3v'>
                      <b>Liste des territoires</b>
                    </div>
                    {areas.map(area => (
                      <li
                        key={area.code}
                        className='list-item'
                      >
                        <div className='list-item-content'>
                          <span className='fr-px-2v'><b>{area.nom}</b> - {area.code}</span>
                        </div>
                        <div className='list-item-content'>
                          <span className='fr-px-2v'> → </span>
                          <span className='fr-px-2v'>Surface: <b>{formatNumber(area.surface)}</b> km2</span>
                          <button
                            type='button'
                            style={{
                              color: `${colors.error425}`,
                              boxShadow: `0 0 0 1px ${colors.error425}`
                            }}
                            className='fr-btn fr-btn--sm fr-btn--secondary fr-icon-delete-line'
                            onClick={() => handleRemoveTerritory(area.nom)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </li>
                    ))}
                  </div>
                  {sizeInGigas && (
                    <div className='fr-col-lg-6 fr-col-12 fr-p-2v fr-p-md-6v'>
                      <div className='fr-pb-3v'>
                        <b>Résumé</b>
                      </div>
                      <div className='resume'>
                        <div><b>• Superficie totale</b> → <i>{formatNumber(areasTotalSize)} km2</i></div>
                        <div><b>• Marge de construction du tuilage</b> →  <i>{margin}</i></div>
                        <div><b>• Nombre de pixels</b> → <i>{formatNumber(sizeInGigas.numberOfPixels / 1_000_000)} millions</i></div>
                        <div><b>• Nombre de pixels en incluant la marge</b> → <i>{formatNumber(sizeInGigas.numberOfPixelsWithMargin / 1_000_000)} millions</i></div>
                        <div><b>• Format sélectionné</b> → <i>{compression}</i></div>
                        <div><b>• Résultat</b> → <i>{formatNumber(sizeInGigas.sizeCompressed * 0.01) > 1 ? `${formatNumber(sizeInGigas.sizeCompressed * 0.01)} € HT / mois` : 'Moins d’un euro HT par mois'}</i></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {areasTotalSize && sizeInGigas && (
              <div>
                <div className='fr-notice fr-notice--info fr-my-3w'>
                  <div className='fr-container'>
                    <div className='fr-notice__body'>
                      <p className='fr-notice__title'>Les champs sur fond bleu sont éditables (marge, résolution et compression)</p>
                    </div>
                  </div>
                </div>
                <div className='fr-p-5v'>
                  <p>
                    <span>Les territoires renseignés ont une superficie totale de <b>{formatNumber(areasTotalSize)} km2</b>.</span>
                  </p>
                  <p>
                    <span>En intégrant une marge de </span>
                    <select
                      className='editable-text'
                      onChange={e => {
                        setMargin(e.target.value)
                        setMarginValue(getMarginValue(e.target.value))
                      }}
                    >
                      <option value='10%'>10%</option>
                      <option value='15%'>15%</option>
                      <option value='20%'>20%</option>
                    </select>
                    <span> (liée au dallage des prises de vue), une orthophotographie de résolution </span>
                    <select
                      className='editable-text'
                      onChange={e => setPixelDensity(e.target.value)}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                    </select>
                    <span>cm comportera environ <b>{formatNumber(sizeInGigas.numberOfPixelsWithMargin / 1_000_000)}</b> millions de pixels.</span>
                  </p>
                  <p>
                    <b>{formatNumber(sizeInGigas.numberOfPixelsWithMargin / 1_000_000)}</b> millions de pixels non compressés sur 3 canaux de couleurs 8 bits ont un poids total de <b>{formatSize(sizeInGigas.sizeUncompressed)}</b>.
                  </p>
                  <p>
                    <span>En appliquant une compression </span>
                    <select
                      className='editable-text'
                      onChange={e => setCompression(e.target.value)}
                    >
                      <option value='GeoTIFF/Non-compressé'>GeoTIFF/Non-compressé</option>
                      <option value='JPEG2000/Lossy'>JPEG2000/Lossy</option>
                      <option value='JPEG2000/Lossless'>JPEG2000/Lossless</option>
                      <option value='GeoTIFF/LZW'>GeoTIFF/LZW</option>
                      <option value='GeoTIFF/Deflate'>GeoTIFF/Deflate</option>
                    </select>
                    <span>, on obtient des fichiers d’un poids total de <b>{formatSize(sizeInGigas.sizeCompressed)}</b>.</span>
                  </p>
                  <p>L’hébergement seul, sans service associé, de ce volume de fichier chez un hébergeur moyen (0,01€/Go/mois) revient à <b>{formatNumber(sizeInGigas.sizeCompressed * 0.01) > 1 ? `${formatNumber(sizeInGigas.sizeCompressed * 0.01)} € HT / mois` : 'moins d’un euro HT par mois'}</b>.</p>
                  <div>
                    <small><b><a href='https://it.nc.gov/documents/files/understanding-compression-geospatial-raster-imagery/download?attachment' target='_blank' rel='noreferrer'>Source des taux de compression</a></b></small>
                  </div>
                </div>
              </div>
            )}
          </>
        </Tab>
      </Section>
      <style jsx>{`
        .fat-hr {
          border: 2px solid #ddd;
          margin: 0 1.5em;
          width: 100%;
        }

        .list-item {
          background-color: #f5f5f5;
          padding: .5em;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .list-item-content {
          color: #000091;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .resume {
          color: #fff;
          background-color: #0063cb;
          padding: 1em;
          border-radius: 2px;
        }

        .editable-text {
          color: #fff;
          background-color: #0063cb;
          text-align: center;
          padding: 0 5px;
          margin: 0 5px;
          border-radius: 3px;
        }

        .error-message {
          width: 100%;
          min-height: 25px;
          padding: 0 1em;
          text-align: end;
          color: ${colors.error425};
          font-size: .8em;
          font-style: italic;
        }
      `}</style>
    </Page>
  )
}

export default Calculatrice
