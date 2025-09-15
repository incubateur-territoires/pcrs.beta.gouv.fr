/* eslint-disable camelcase */
import {useMemo, useReducer, useRef} from 'react'
import PropTypes from 'prop-types'

import formReducer, {checkFormValidity} from 'reducers/form-reducer.js'
import {debounce} from 'lodash-es'
import ActorsAutocompleteInput from './actors-autocomplete-input.js'
import {handlePhoneError, handleMailError, handleSirenError, checkIsPhoneValid, checkIsEmailValid, checkIsSirenValid, isInRange, handleRangeError} from '@/components/suivi-form/acteurs/utils/error-handlers.js'

import {roleOptions} from '@/components/suivi-form/acteurs/utils/select-options.js'

import TextInput from '@/components/text-input.js'
import SelectInput from '@/components/select-input.js'
import Button from '@/components/button.js'
import {stripNonNumericCharacters, formatInternationalPhone} from '@/lib/string.js'

const initState = ({
  initialValues = {
    nom: '',
    siren: '',
    phone: '',
    mail: '',
    finPerc: '',
    finEuros: '',
    role: ''
  },
  fieldsValidations
}) => {
  const fields = {
    nom: {
      value: initialValues.nom || '',
      isRequired: true,
      isValid: Boolean(initialValues.nom)
    },
    siren: {
      value: initialValues.siren || '',
      isRequired: true,
      isValid: Boolean(initialValues.siren),
      getValidationMessage: siren => handleSirenError(siren, fieldsValidations.siren),
      validate(siren) {
        return checkIsSirenValid(siren) && !fieldsValidations.siren(siren)
      }
    },
    telephone: {
      value: initialValues.telephone || '',
      isRequired: false,
      isValid: initialValues.telephone ? checkIsPhoneValid(initialValues.telephone) : true,
      sanitize: formatInternationalPhone,
      getValidationMessage: handlePhoneError,
      validate: checkIsPhoneValid,
      noAutoValidation: true
    },
    mail: {
      value: initialValues.mail || '',
      isRequired: false,
      isValid: initialValues.mail ? checkIsEmailValid(initialValues.mail) : true,
      validate: checkIsEmailValid,
      getValidationMessage: handleMailError,
      noAutoValidation: true
    },
    finPerc: {
      value: initialValues.finance_part_perc || '',
      isRequired: false,
      sanitize: stripNonNumericCharacters,
      isValid: true,
      validateOnChange: true,
      validate: value => isInRange(value, 0, 100),
      getValidationMessage: value => handleRangeError(value, 0, 100)
    },
    finEuros: {
      value: initialValues.finance_part_euro || '',
      isRequired: false,
      sanitize: stripNonNumericCharacters,
      isValid: true,
      validateOnChange: true,
      validate: value => isInRange(value, 0),
      getValidationMessage: value => handleRangeError(value, 0)
    },
    role: {
      value: initialValues.role || '',
      isRequired: true,
      isValid: Boolean(initialValues.role)
    }
  }

  return {fields, isFormValid: checkFormValidity(fields)}
}

const ActeurForm = ({initialValues, isSirenAlreadyUsed, isAplcDisabled, onCancel, onSubmit}) => {
  const [form, dispatch] = useReducer(formReducer, initState({initialValues, fieldsValidations: {siren: isSirenAlreadyUsed}}))

  const availableRoles = useMemo(() => roleOptions.map(({value, ...props}) => {
    const actorIsAplc = ['aplc', 'porteur'].includes(initialValues?.role)
    return {
      ...props,
      value,
      isDisabled: ['aplc', 'porteur'].includes(value) ? isAplcDisabled && !actorIsAplc : !isAplcDisabled
    }
  }), [isAplcDisabled, initialValues])

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

  const handleSelectValue = ({name, value}) => {
    dispatch({
      type: 'SET_FIELD_VALUE',
      payload: {fieldName: name, value}
    })
  }

  const handleInputBlur = event => {
    const {name} = event.target
    dispatch({
      type: 'VALIDATE_FIELD',
      fieldName: name
    })
  }

  const handleSubmit = () => {
    const {nom, siren, role, mail, telephone, finPerc, finEuros} = form.fields

    const newActor = {
      nom: nom.value,
      siren: Number(siren.value),
      role: role.value,
      mail: mail.value || null,
      telephone: telephone.value || null,
      finance_part_perc: finPerc.value ? Number(finPerc.value) : null,
      finance_part_euro: finEuros.value ? Number(finEuros.value) : null
    }

    onSubmit(newActor)
  }

  return (
    <div
      className='fr-mt-4w'
      style={{
        width: '100%',
        border: '1px solid lightgrey',
        padding: '2em',
        borderRadius: '4px'
      }}
    >
      <div className='fr-grid-row'>
        <div className='fr-col-12 fr-mt-2w fr-col-md-6'>
          <ActorsAutocompleteInput
            isRequired
            inputValue={form.fields.nom.value}
            inputError={form.fields.nom.validationMessage}
            onValueChange={handleInputChange}
            onSelectValue={item => {
              handleSelectValue({name: 'nom', value: item.nom_complet})
              handleSelectValue({name: 'siren', value: item.siren})
            }}
          />
        </div>
        <div className='fr-col-12 fr-mt-6w fr-col-md-6 fr-pl-md-3w'>
          <TextInput
            isRequired
            name='siren'
            label='SIREN'
            value={form.fields.siren.value}
            ariaLabel='numéro siren de l’entreprise'
            description='SIREN de l’entreprise'
            errorMessage={form.fields.siren.validationMessage}
            onValueChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>
      </div>

      <div className='fr-grid-row'>
        <div className='fr-col-12 fr-mt-6w fr-col-md-6'>
          <TextInput
            name='telephone'
            label='Téléphone'
            value={form.fields.telephone.value}
            ariaLabel='numéro de téléphone de l’interlocuteur'
            description='Numéro de téléphone de l’interlocuteur'
            errorMessage={form.fields.telephone.validationMessage}
            onValueChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>

        <div className='fr-col-12 fr-mt-6w fr-col-md-6 fr-pl-md-3w'>
          <TextInput
            name='mail'
            label='Adresse e-mail'
            value={form.fields.mail.value}
            type='email'
            ariaLabel='Adresse e-mail de l’interlocuteur'
            description='Adresse e-mail de l’interlocuteur'
            errorMessage={form.fields.mail.validationMessage}
            placeholder='exemple@domaine.fr'
            onValueChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-col-12'>
        <div className='fr-col-12 fr-mt-6w fr-col-md-4 fr-pr-md-3w'>
          <SelectInput
            isRequired
            name='role'
            label='Rôle'
            options={availableRoles}
            value={form.fields.role.value}
            description='Rôle de l’acteur dans le projet'
            ariaLabel='rôle de l’acteur dans le projet'
            errorMessage={form.fields.role.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>
        <div className='fr-col-12 fr-col-md-4 fr-mt-6w'>
          <TextInput
            name='finPerc'
            label='Part de financement'
            value={form.fields.finPerc.value}
            ariaLabel='Part de financement en pourcentage du total'
            description='Part de financement en pourcentage du total'
            placeholder='Veuillez n’entrer que des valeurs numéraires'
            errorMessage={form.fields.finPerc.validationMessage}
            onValueChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>

        <div className='fr-col-12 fr-col-md-4 fr-mt-6w fr-pl-md-3w'>
          <TextInput
            name='finEuros'
            label='Montant du financement'
            value={form.fields.finEuros.value}
            ariaLabel='montant du financement'
            description='Montant du financement en euros'
            placeholder='Veuillez n’entrer que des valeurs numéraires'
            errorMessage={form.fields.finEuros.validationMessage}
            onValueChange={handleInputChange}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-mt-3w'>
        <Button
          label='Valider l’ajout de l’acteur'
          icon='checkbox-circle-fill'
          isDisabled={!form.isFormValid}
          onClick={handleSubmit}
        >
          Valider l’ajout de l’acteur
        </Button>
        {onCancel && (
          <div className='fr-pl-3w'>
            <Button
              label='Annuler l’ajout de l’acteur'
              buttonStyle='tertiary'
              onClick={onCancel}
            >
              Annuler
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

ActeurForm.propTypes = {
  initialValues: PropTypes.shape({
    nom: PropTypes.string,
    siren: PropTypes.number,
    phone: PropTypes.string,
    mail: PropTypes.string,
    finPerc: PropTypes.number,
    finEuros: PropTypes.number,
    role: PropTypes.string
  }),
  isAplcDisabled: PropTypes.bool.isRequired,
  isSirenAlreadyUsed: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
}

export default ActeurForm
