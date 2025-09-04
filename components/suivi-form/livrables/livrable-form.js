/* eslint-disable react/boolean-prop-naming */
/* eslint-disable camelcase */
import {useState, useReducer, useRef} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash-es'

import formReducer, {checkFormValidity} from 'reducers/form-reducer'
import {handleRangeError, isInRange} from '../acteurs/utils/error-handlers.js'

import StockageCard from './stockage-card.js'
import {stripNonNumericCharacters} from '@/lib/string.js'

import {natureOptions, diffusionOptions, licenceOptions} from '@/components/suivi-form/livrables/utils/select-options.js'
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
    dateLivraison: {
      value: initialValues.date_livraison || '',
      isRequired: false,
      isValid: Boolean(initialValues.date_livraison)
    },
    recouvr_lat: {
      value: initialValues.recouvr_lat || '',
      isRequired: false,
      isValid: Boolean(initialValues.recouvr_lat)
    },
    recouvr_lon: {
      value: initialValues.recouvr_lon || '',
      isRequired: false,
      isValid: Boolean(initialValues.recouvr_lon)
    },
    focale: {
      value: initialValues.focale || '',
      isRequired: false,
      isValid: Boolean(initialValues.focale)
    },
    cout: {
      value: initialValues.cout || '',
      isRequired: false,
      isValid: Boolean(initialValues.cout)
    },
    diffusion: {
      value: initialValues.diffusion || '',
      isRequired: false,
      isValid: Boolean(initialValues.diffusion)
    },
    diffusion_url: {
      value: initialValues.diffusion_url || '',
      isRequired: false,
      isValid: Boolean(initialValues.diffusion_url)
    },
    diffusion_layer: {
      value: initialValues.diffusion_layer || '',
      isRequired: false,
      isValid: Boolean(initialValues.diffusion_layer)
    }
  }

  return {fields, isFormValid: checkFormValidity(fields)}
}

const LivrableForm = ({initialValues, isLivrableNameAvailable, onCancel, onSubmit}) => {
  const [form, dispatch] = useReducer(formReducer, initState({initialValues, fieldsValidations: {nom: isLivrableNameAvailable}}))

  const [isStockageFormOpen, setIsStockageFormOpen] = useState(false)

  const livrableFormRef = useRef()

  const [errorMessage, setErrorMessage] = useState()

  const [livrableStockage, setLivrableStockage] = useState(initialValues?.stockage ? {
    stockage: initialValues.stockage,
    stockage_public: initialValues.stockage_public,
    stockage_telechargement: initialValues.stockage_telechargement,
    stockage_params: initialValues.stockage_params
  } : null)

  const debouncedValidation = useRef(debounce(name => {
    dispatch({type: 'VALIDATE_FIELD', fieldName: name})
  }, 800))

  const handleInputChange = event => {
    const {name, value} = event.target

    // Check if the diffusion layer or diffusion url are required
    if (name === 'diffusion_url' && form.fields.diffusion_layer.value === '' && value !== '') {
      form.fields.diffusion_layer.isRequired = true
      form.fields.diffusion_layer.validationMessage = 'Ce champ est obligatoire lorsque que l’URL de diffusion est renseignée.'
    } else if (name === 'diffusion_layer' && form.fields.diffusion_url.value === '' && value !== '') {
      form.fields.diffusion_url.isRequired = true
      form.fields.diffusion_url.validationMessage = 'Ce champ est obligatoire lorsque que le nom de couche de diffusion est renseignée.'
    } else {
      form.fields.diffusion_layer.isRequired = false
      form.fields.diffusion_layer.validationMessage = null
      form.fields.diffusion_url.isRequired = false
      form.fields.diffusion_url.validationMessage = null
    }

    dispatch({
      type: 'SET_FIELD_VALUE',
      payload: {fieldName: name, value}
    })

    const {noAutoValidation, validateOnChange} = form.fields[name]
    if (!noAutoValidation && !validateOnChange) {
      debouncedValidation.current(name)
    }
  }

  const handleLivrableStockage = e => {
    setIsStockageFormOpen(false)
    setLivrableStockage(e)
    livrableFormRef.current.scrollIntoView()
  }

  const handleStockageCancel = () => {
    setIsStockageFormOpen(false)
    livrableFormRef.current.scrollIntoView()
  }

  const handleSubmit = () => {
    setErrorMessage(null)
    const {nom, nature, licence, avancement, dateLivraison, recouvr_lon, recouvr_lat, focale, cout, diffusion, diffusion_url, diffusion_layer} = form.fields

    onSubmit({
      nom: nom.value.trim(),
      nature: nature.value,
      licence: licence.value,
      date_livraison: dateLivraison.value || null,
      avancement: avancement.value ? Number(avancement.value) : null,
      recouvr_lat: recouvr_lat.value ? Number(recouvr_lat.value) : null,
      recouvr_lon: recouvr_lon.value ? Number(recouvr_lon.value) : null,
      focale: focale.value ? Number(focale.value) : null,
      cout: cout.value ? Number(cout.value) : null,
      diffusion: diffusion.value || null,
      diffusion_url: diffusion_url.value || null,
      diffusion_layer: diffusion_layer.value || null,
      stockage: livrableStockage?.stockage || null,
      stockage_public: livrableStockage?.stockage_public || false,
      stockage_telechargement: livrableStockage?.stockage_telechargement || false,
      stockage_params: livrableStockage?.stockage_params || {}
    })
  }

  return (
    <div
      ref={livrableFormRef}
      className='fr-mt-4w'
      style={{
        width: '100%',
        border: '1px solid lightgrey',
        padding: '2em',
        borderRadius: '4px'
      }}
    >
      <div className='fr-grid-row fr-grid-row--gutters'>
        {/* Nom du livrable */}
        <div className='fr-col-12 fr-col-lg-8'>
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
        <div className='fr-col-12 fr-col-lg-4'>
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
      </div>

      <div className='fr-grid-row fr-grid-row--gutters'>
        {/* Licence du livrable - select */}
        <div className='fr-col-12 fr-col-lg-4'>
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

        {/* Date de livraison du projet - date */}
        <div className='fr-col-12 fr-col-lg-4'>
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

        {/* Avancement du livrable - number */}
        <div className='fr-col-12 fr-col-lg-4'>
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
      </div>

      <div className='fr-grid-row fr-grid-row--gutters'>
        <div className='fr-col-12 fr-col-lg-3'>
          <TextInput
            name='recouvr_lat'
            label='Recouvrement latéral'
            value={form.fields.recouvr_lat.value}
            ariaLabel='Pourcentage de recouvrement latéral du livrable'
            description='Pourcentage de recouvrement latéral'
            errorMessage={form.fields.recouvr_lat.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>
        <div className='fr-col-12 fr-col-lg-3'>
          <TextInput
            name='recouvr_lon'
            label='Recouvrement longitudinal'
            value={form.fields.recouvr_lon.value}
            ariaLabel='Pourcentage de recouvrement longitudinal du livrable'
            description='Pourcentage de recouvrement longitudinal'
            errorMessage={form.fields.recouvr_lon.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>
        <div className='fr-col-12 fr-col-lg-3'>
          <TextInput
            name='focale'
            label='Focale'
            value={form.fields.focale.value}
            ariaLabel='Distance focale en millimètres'
            description='Distance focale en millimètres'
            errorMessage={form.fields.focale.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>
        <div className='fr-col-12 fr-col-lg-3'>
          <TextInput
            name='cout'
            label='Coût'
            value={form.fields.cout.value}
            ariaLabel='Coût total en euros'
            description='Coût total en euros'
            errorMessage={form.fields.cout.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-grid-row--gutters fr-mt-4w fr-pt-2w' style={{borderTop: '1px solid lightgrey'}}>
        {/* Mode de diffusion du livrable - selecteur */}
        <div className='fr-col-12 fr-col-lg-6'>
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
        <div className='fr-col-12 fr-col-lg-6'>
          <TextInput
            name='diffusion_layer'
            label='Nom de la couche de diffusion'
            value={form.fields.diffusion_layer.value}
            ariaLabel='Nom de la couche dans le service de diffusion'
            description='Nom de la couche dans le service de diffusion'
            errorMessage={form.fields.diffusion_layer.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-grid-row--gutters'>
        <div className='fr-col-12 fr-col-lg-12'>
          <TextInput
            name='diffusion_url'
            label='URL de diffusion'
            value={form.fields.diffusion_url.value}
            ariaLabel='URL de la couche de diffusion du livrable : une URL vers un service (WMS, WMTS...) et non GetCapabilities'
            description='URL de la couche de diffusion du livrable : une URL vers un service (WMS, WMTS...) et non GetCapabilities'
            errorMessage={form.fields.diffusion_url.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>
      </div>

      <div className='fr-mt-4w'>
        <div className='fr-grid-row fr-mb-3w'>
          <span className='fr-icon-database-fill fr-mr-1w' aria-hidden='true' />
          <div className='fr-label'>Stockage du livrable</div>
        </div>

        <div className='fr-col-12'>
          {(livrableStockage?.stockage_params.host || livrableStockage?.stockage_params.url || livrableStockage?.stockage_params.url_externe) && !isStockageFormOpen && (
            <StockageCard
              type={livrableStockage.stockage}
              params={livrableStockage.stockage_params}
              generalSettings={{isPublic: livrableStockage.stockage_public, isDownloadable: livrableStockage.stockage_telechargement}}
              handleEdition={() => setIsStockageFormOpen(true)}
              handleDelete={() => setLivrableStockage(null)}
            />
          )}

          {(isStockageFormOpen) && (
            <StockageForm
              initialValues={livrableStockage}
              handleLivrableStockage={handleLivrableStockage}
              onCancel={handleStockageCancel}
            />
          )}

          {!livrableStockage && !isStockageFormOpen && (
            <Button
              label='Ajouter un stockage'
              onClick={() => setIsStockageFormOpen(true)}
            >
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
          Valider l’ajout du livrable
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
    </div>
  )
}

LivrableForm.propTypes = {
  initialValues: PropTypes.shape({
    nom: PropTypes.string,
    nature: PropTypes.string,
    diffusion: PropTypes.string,
    licence: PropTypes.string,
    avancement: PropTypes.number,
    dateLivraison: PropTypes.string,
    stockageId: PropTypes.string,
    stockage: PropTypes.string,
    stockage_public: PropTypes.bool,
    stockage_telechargement: PropTypes.bool,
    stockage_params: PropTypes.object
  }),
  isLivrableNameAvailable: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
}

LivrableForm.defaultProps = {
  initialValues: {stockage: null, stockage_params: {}}
}

export default LivrableForm
