/* eslint-disable camelcase */
import {useState, useReducer, useRef} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash-es'

import formReducer, {checkFormValidity} from 'reducers/form-reducer'
import {handleRangeError, isInRange} from '../acteurs/utils/error-handlers.js'

import {stripNonNumericCharacters} from '@/lib/string.js'
import colors from '@/styles/colors.js'

import {natureOptions, diffusionOptions, licenceOptions, publicationOptions, systRefSpatialOptions} from '@/components/suivi-form/livrables/utils/select-options.js'
import SelectInput from '@/components/select-input.js'
import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'
import DateInput from '@/components/date-input.js'
import StockageForm from '@/components/suivi-form/livrables/stockage-form/index.js'

const initState = ({initialValues, fieldsValidations}) => {
  const fields = {
    nom: {
      value: initialValues.nom || '',
      isRequired: true,
      isValid: Boolean(initialValues.nom),
      validateOnChange: true,
      validate: nom => !fieldsValidations.nom(nom),
      getValidationMessage: nom => fieldsValidations.nom(nom) ? 'Un livrable avec un nom identique est déjà présent.' : null
    },
    nature: {
      value: initialValues.nature || '',
      isRequired: true,
      isValid: Boolean(initialValues.nature)
    },
    diffusion: {
      value: initialValues.diffusion || '',
      isRequired: false,
      isValid: Boolean(initialValues.diffusion)
    },
    licence: {
      value: initialValues.licence || '',
      isRequired: true,
      isValid: Boolean(initialValues.licence)
    },
    avancement: {
      value: initialValues.avancement || '',
      isRequired: false,
      sanitize: stripNonNumericCharacters,
      isValid: Boolean(initialValues.avancement),
      validateOnChange: true,
      validate: value => isInRange(value, 0, 100),
      getValidationMessage: value => handleRangeError(value, 0, 100)
    },
    crs: {
      value: initialValues.crs || '',
      isRequired: false,
      isValid: Boolean(initialValues.crs)
    },
    compression: {
      value: initialValues.compression || '',
      isRequired: false,
      isValid: Boolean(initialValues.compression)
    },
    publication: {
      value: initialValues.publication || '',
      isRequired: false,
      isValid: Boolean(initialValues.publication)
    },
    dateLivraison: {
      value: initialValues.date_livraison || '',
      isRequired: false,
      isValid: Boolean(initialValues.date_livraison)
    }
  }
  return {fields, isFormValid: checkFormValidity(fields)}
}

const LivrableForm = ({initialValues, isLivrableNameAvailable, onCancel, onSubmit}) => {
  const [form, dispatch] = useReducer(formReducer, initState({initialValues, fieldsValidations: {nom: isLivrableNameAvailable}}))

  const [errorMessage, setErrorMessage] = useState()
  const [isStockageFormOpen, setIsStockageFormOpen] = useState()

  const [livrableStockage, setLivrableStockage] = useState({
    stockage: initialValues.stockage || null,
    stockageParams: initialValues.stockageParams || {}
  })

  const debouncedValidation = useRef(debounce(name => {
    dispatch({type: 'VALIDATE_FIELD', fieldName: name})
  }, 800))

  const handleInputChange = event => {
    const {name, value} = event.target
    dispatch({
      type: 'SET_FIELD_VALUE',
      payload: {fieldName: name, value}
    })

    const {noAutoValidation, validateOnChange} = form.fields[name]
    if (!noAutoValidation && !validateOnChange) {
      debouncedValidation.current(name)
    }
  }

  const handleSubmit = () => {
    setErrorMessage(null)
    const {nom, nature, diffusion, licence, avancement, crs, compression, publication, dateLivraison} = form.fields

    onSubmit({
      nom: nom.value.trim(),
      nature: nature.value,
      licence: licence.value,
      diffusion: diffusion.value || null,
      avancement: avancement.value ? Number(avancement.value) : null,
      crs: crs.value || null,
      compression: compression.value || null,
      publication: publication.value || null,
      date_livraison: dateLivraison.value || null,
      stockage: livrableStockage.stockage || null,
      stockageParams: livrableStockage.stockageParams || {}
    })
  }

  return (
    <div className='fr-mt-4w'>
      <div className='fr-grid-row'>
        {/* Nom du livrable */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-mb-0 fr-pr-3w'>
          <TextInput
            isRequired
            name='nom'
            label='Nom'
            ariaLabel='nom du livrable'
            description='Nom du livrable'
            value={form.fields.nom.value}
            placeholder='Nom du livrable'
            errorMessage={form.fields.nom.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>

        {/* Nature du livrable - selecteur */}
        <div className='fr-col-12 fr-mt-6w fr-col-lg-4 fr-pr-3w'>
          <SelectInput
            isRequired
            name='nature'
            label='Nature'
            value={form.fields.nature.value}
            ariaLabel='nature du livrable'
            description='Nature du livrable'
            errorMessage={form.fields.nature.validationMessage}
            options={natureOptions}
            onValueChange={handleInputChange}
          />
        </div>

        {/* Mode de diffusion du livrable - selecteur */}
        <div className='fr-col-12 fr-mt-6w fr-col-lg-4 fr-pr-3w'>
          <SelectInput
            name='diffusion'
            label='Diffusion'
            options={diffusionOptions}
            value={form.fields.diffusion.value}
            ariaLabel='mode de diffusion du livrable'
            description='Mode de diffusion'
            errorMessage={form.fields.diffusion.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>
      </div>

      <div className='fr-grid-row'>
        {/* Licence du livrable - select */}
        <div className='fr-select-group fr-col-12 fr-col-lg-4 fr-mt-6w fr-mb-0 fr-pr-3w'>
          <SelectInput
            isRequired
            name='licence'
            label='Licence'
            value={form.fields.licence.value}
            ariaLabel='licence du livrable'
            description='Licence du livrable'
            errorMessage={form.fields.licence.validationMessage}
            options={licenceOptions}
            onValueChange={handleInputChange}
          />
        </div>

        {/* Type de publication du livrable - text */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <SelectInput
            name='publication'
            label='Publication'
            options={publicationOptions}
            value={form.fields.publication.value}
            errorMessage={form.fields.publication.validationMessage}
            ariaLabel='publication du livrable'
            description='Publication du livrable'
            onValueChange={handleInputChange}
          />
        </div>

        {/* Date de livraison du projet - date */}
        <div className='fr-select-group fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <DateInput
            name='dateLivraison'
            label='Date de livraison'
            value={form.fields.dateLivraison.value}
            ariaLabel='date de livraison du livrable'
            description='Date de livraison du livrable'
            errorMessage={form.fields.dateLivraison.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>
      </div>

      <div className='fr-grid-row'>
        {/* Avancement du livrable - number */}
        <div className='fr-input-group fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w'>
          <TextInput
            name='avancement'
            label='Avancement'
            value={form.fields.avancement.value}
            ariaLabel='pourcentage de progression du livrable en pourcentage'
            description='Pourcentage de progression'
            errorMessage={form.fields.avancement.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>

        {/* Système de référence spatial du livrable - select */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <SelectInput
            name='crs'
            label='Système de référence spatial'
            options={systRefSpatialOptions}
            value={form.fields.crs.value}
            ariaLabel='système de référence spatial du livrable'
            description='Identifiant EPSG du livrable'
            errorMessage={form.fields.crs.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>

        {/* Nature de compression du livrable - text */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <TextInput
            name='compression'
            label='Compression'
            value={form.fields.compression.value}
            ariaLabel='nature de compression du livrable'
            description='Nature de compression du livrable'
            errorMessage={form.fields.compression.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>

        <div>
          {livrableStockage.stockage && (
            <div className='fr-grid-row stockage-card fr-p-1w fr-mb-2w'>
              <div className='fr-mr-1w'>Stockage ajouté : {livrableStockage.stockageParams.host || livrableStockage.stockageParams.url}</div>
              <button
                className='delete-button'
                type='button'
                onClick={() => {
                  setLivrableStockage({
                    stockage: initialValues.stockage || null,
                    stockageParams: initialValues.stockageParams || {}
                  })
                }}
              >
                <span className='fr-icon-delete-line' aria-hidden='true' />
              </button>
            </div>
          )}

          {isStockageFormOpen ? (
            <StockageForm
              initialValues={livrableStockage}
              handleLivrableStockage={setLivrableStockage}
              onClose={() => setIsStockageFormOpen(false)}
            />
          ) : (
            <Button label='Ajouter un stockage' onClick={() => setIsStockageFormOpen(true)}>
              Ajouter un stockage
            </Button>
          )}
        </div>
      </div>

      <div className='fr-grid-row fr-mt-3w'>
        <Button
          label='Valider l’ajout du livrable'
          icon='checkbox-circle-fill'
          isDisabled={!form.isFormValid}
          onClick={handleSubmit}
        >
          Valider
        </Button>

        {onCancel && (
          <div className='fr-pl-3w'>
            <Button
              label='Annuler l’ajout du livrable'
              buttonStyle='tertiary'
              onClick={onCancel}
            >
              Annuler
            </Button>
          </div>
        )}
      </div>

      {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}

      <style jsx>{`
        .stockage-card {
          width: fit-content;
          background: ${colors.grey975};
          border-radius: 3px;
        }

        .delete-button {
          color: ${colors.error425};
        }
      `}</style>
    </div>
  )
}

LivrableForm.propTypes = {
  initialValues: PropTypes.shape({
    nom: PropTypes.string,
    nature: PropTypes.string,
    diffusion: PropTypes.string,
    licence: PropTypes.string,
    avancement: PropTypes.string,
    crs: PropTypes.string,
    compression: PropTypes.string,
    publication: PropTypes.string,
    dateLivraison: PropTypes.string,
    stockage: PropTypes.string,
    stockageParams: PropTypes.object
  }),
  isLivrableNameAvailable: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
}

LivrableForm.defaultProps = {
  initialValues: {stockage: null, stockageParams: {}}
}

export default LivrableForm
