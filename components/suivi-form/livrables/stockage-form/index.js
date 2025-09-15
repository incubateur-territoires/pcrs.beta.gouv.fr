/* eslint-disable camelcase */
import {useState} from 'react'
import PropTypes from 'prop-types'

import GeneralSettingsInputs from './general-settings-inputs.js'
import HttpParamsInputs from '@/components/suivi-form/livrables/stockage-form/http-params-inputs.js'
import FtpParamsInputs from '@/components/suivi-form/livrables/stockage-form/ftp-params-inputs.js'
import SftpParamsInputs from '@/components/suivi-form/livrables/stockage-form/sftp-params-inputs.js'
import SelectInput from '@/components/select-input.js'
import Button from '@/components/button.js'

import {isURLValid} from '@/components/suivi-form/livrables/utils/url.js'

const trimObjectValues = obj => {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'string' ? value.trim() : value
  }

  return result
}

const StockageForm = ({initialValues = {}, handleLivrableStockage, onCancel}) => {
  const [validationMessage, setValidationMessage] = useState(null)
  const [isSubmitable, setIsSubmitable] = useState(false)
  const [stockageType, setStockageType] = useState(initialValues?.stockage || undefined)
  const [stockageParams, setStockageParams] = useState(initialValues?.stockage_params || {})
  const [generalSettings, setGeneralSettings] = useState({
    isPublic: initialValues?.stockage_public || false,
    isDownloadable: initialValues?.stockage_telechargement || false
  })

  const onSubmit = () => {
    const trimmedParams = trimObjectValues(stockageParams)

    handleLivrableStockage({
      stockage: stockageType,
      stockage_public: generalSettings.isPublic,
      stockage_telechargement: generalSettings.isDownloadable,
      stockage_params: trimmedParams
    })
  }

  const handleUrl = url => {
    setStockageParams(prev => ({...prev, url}))

    if (isURLValid(url)) {
      setIsSubmitable(true)
      setValidationMessage(null)
    } else {
      setIsSubmitable(false)
      setValidationMessage({httpParams: {url: 'Cette URL n’est pas valide'}})
    }
  }

  const handleExternalUrl = externalUrl => {
    setStockageParams(prev => ({...prev, url_externe: externalUrl}))

    if (isURLValid(externalUrl)) {
      setIsSubmitable(true)
      setGeneralSettings(prev => ({...prev, isPublic: true}))
      setValidationMessage(null)
    } else {
      setIsSubmitable(false)
      setValidationMessage({httpParams: {url_externe: 'Cette URL n’est pas valide'}})
    }
  }

  return (
    <div className='fr-col-12'>
      <div className='fr-col-12'>
        <SelectInput
          isDisabled={Boolean(stockageType)}
          label='Type de stockage'
          value={stockageType}
          options={[
            {value: 'http', label: 'HTTP'},
            {value: 'ftp', label: 'FTP'},
            {value: 'sftp', label: 'SFTP'}
          ]}
          onValueChange={e => setStockageType(e.target.value)}
        />
      </div>

      {stockageType === 'sftp' && (
        <SftpParamsInputs
          stockageParams={stockageParams}
          handleParams={setStockageParams}
        />
      )}

      {stockageType === 'ftp' && (
        <FtpParamsInputs
          stockageParams={stockageParams}
          handleParams={setStockageParams}
        />
      )}

      {stockageType === 'http' && (
        <HttpParamsInputs
          url={stockageParams?.url}
          externalUrl={stockageParams?.url_externe}
          handleUrl={handleUrl}
          handleExternalUrl={handleExternalUrl}
          validationMessage={validationMessage?.httpParams}
        />
      )}

      {stockageType && (
        <GeneralSettingsInputs
          generalSettings={generalSettings}
          handleGeneralSettings={setGeneralSettings}
        />
      )}

      <div className='fr-mt-3w'>
        <Button
          label='Valider le stockage'
          isDisabled={stockageType === 'http' ? !isSubmitable : !stockageParams.host}
          onClick={onSubmit}
        >
          {(!initialValues || initialValues.stockage === null) ? 'Ajouter le serveur' : 'Modifier le serveur'}
        </Button>
        <Button
          style={{marginLeft: '1em'}}
          label='Annuler l’ajout du serveur'
          buttonStyle='secondary'
          onClick={onCancel}
        >
          Annuler
        </Button>
      </div>

      <style jsx>{`
        .input-container {
          display: flex;
        }

        .input-container label {
          padding-left: 1em;
        }
      `}</style>
    </div>
  )
}

StockageForm.propTypes = {
  initialValues: PropTypes.object,
  handleLivrableStockage: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default StockageForm
