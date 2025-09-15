import PropTypes from 'prop-types'
import {useEffect, useState} from 'react'

import {getStockage} from '@/lib/pcrs-scanner-api.js'
import {getStorageDownloadToken} from '@/lib/suivi-pcrs.js'

import colors from '@/styles/colors.js'

import CenteredSpinner from '@/components/centered-spinner.js'
import StockageData from '@/components/projet/stockage-data.js'
import ScannedData from '@/components/projet/scanned-data.js'

const StockagePreview = ({
  projectId,
  stockageId = null,
  params = {},
  isStockagePublic = true,
  isDownloadable = false
}) => {
  const [stockage, setStockage] = useState()
  const [downloadToken, setDownloadToken] = useState()
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const isExternal = Boolean(params?.url_externe)

  useEffect(() => {
    setError(null)

    async function fetchStockage() {
      setIsLoading(true)
      try {
        const stockage = await getStockage(stockageId)
        setStockage(stockage)
      } catch {
        setError('Impossible de récupérer les données du livrable')
      }

      setIsLoading(false)
    }

    if (stockageId) {
      fetchStockage()
    }
  }, [stockageId])

  useEffect(() => {
    async function getDownloadToken() {
      try {
        const {token} = await getStorageDownloadToken(projectId, stockage._id)
        setDownloadToken(token)
      } catch (error) {
        console.error(`Fail to get download token : ${error}`)
      }
    }

    if (stockage && isDownloadable) {
      getDownloadToken()
    }
  }, [projectId, stockage, isDownloadable])

  return (
    <div className='fr-grid-row'>
      {isLoading ? (
        <div className='spinner-container fr-col-12 fr-grid-row fr-grid-row--center fr-grid-row--middle'>
          <div className='fr-col-12'>
            <CenteredSpinner />
          </div>
        </div>
      ) : (
        <div className='stockage-preview-data-container fr-col-12'>
          {error ? (
            <p className='fr-error-text'>{error}</p>
          ) : (
            stockage ? (
              <div className='fr-pl-3w'>
                <StockageData
                  isPublic={isStockagePublic}
                  params={params}
                  type={stockage.type}
                />
                {!isExternal && (
                  <ScannedData
                    stockage={stockage}
                    downloadToken={downloadToken}
                  />
                )}
              </div>
            ) : (
              <div className='fr-alert fr-alert--info fr-alert--sm fr-mt-2w'>
                <p>Les données relatives à cet espace de stockage ne sont pas encore disponibles.</p>
              </div>
            )
          )}
        </div>
      )}
      {isExternal && (
        <div className='fr-alert fr-alert--info fr-alert--sm fr-mt-2w'>
          <p>Ce stockage est externe et ne peut pas être scanné</p>
        </div>
      )}

      <style jsx>{`
        .stockage-preview-data-container {
          border-top: solid 3px ${colors.blueFrance925};
        }

        .map-wrapper {
          width: 100%;
          height: 500px;
        }
      `}</style>
    </div>
  )
}

StockagePreview.propTypes = {
  projectId: PropTypes.string.isRequired,
  stockageId: PropTypes.string,
  params: PropTypes.object,
  isDownloadable: PropTypes.bool,
  isStockagePublic: PropTypes.bool
}

export default StockagePreview
