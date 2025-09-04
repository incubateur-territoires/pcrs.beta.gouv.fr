import {useState} from 'react'
import PropTypes from 'prop-types'

import {stripNonNumericCharacters} from '@/lib/string.js'

import {useInput} from '@/hooks/input.js'

import {natureOptions} from '@/components/suivi-form/subventions/utils/select-options.js'

import TextInput from '@/components/text-input.js'
import SelectInput from '@/components/select-input.js'
import DateInput from '@/components/date-input.js'
import Button from '@/components/button.js'
import NumberInput from '@/components/number-input.js'

const SubventionForm = ({initialValues, isSubventionExisting, onSubmit, onCancel}) => {
  const [errorMessage, setErrorMessage] = useState()

  const handleSubventionNameError = name => isSubventionExisting(name) ? 'Cette subvention existe déjà' : null

  const [nom, setNom, nomError] = useInput({initialValue: initialValues.nom, checkValue: handleSubventionNameError, isRequired: true})
  const [nature, setNature, natureError] = useInput({initialValue: initialValues.nature, isRequired: true})
  const [montant, setMontant, montantError, handleMontantValidity] = useInput({initialValue: initialValues?.montant?.toString()})
  const [echeance, setEcheance] = useInput({initialValue: initialValues.echeance})

  const isFormCompleted = Boolean(nom && nature)

  const handleSubmit = () => {
    setErrorMessage(null)

    const newSubvention = {
      nom,
      nature,
      montant: Number(montant) || null,
      echeance: echeance || null
    }

    onSubmit(newSubvention)
  }

  const handleMontant = e => {
    const {value} = e.target
    const montant = stripNonNumericCharacters(value)
    setMontant(montant)
  }

  return (
    <div
      style={{
        width: '100%',
        border: '1px solid lightgrey',
        padding: '0 2em 1em 2em',
        borderRadius: '4px'
      }}
    >
      <div className='fr-grid-row fr-my-5w'>
        <div className='fr-grid-row fr-col-12 fr-pr-3w'>
          <div className='fr-col-12 fr-col-md-6'>
            <TextInput
              isRequired
              label='Nom'
              value={nom}
              ariaLabel='nom de la subvention'
              description='Nom de la subvention'
              errorMessage={nomError}
              onValueChange={e => setNom(e.target.value)}
            />
          </div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-mt-5w'>
          <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-3w fr-mt-lg-0'>
            <SelectInput
              isRequired
              options={natureOptions}
              label='Nature'
              value={nature}
              ariaLabel='nature de la subvention'
              description='Nature de la subvention'
              errorMessage={natureError}
              onValueChange={e => setNature(e.target.value)}
            />
          </div>

          <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-3w fr-mt-lg-0'>
            <NumberInput
              label='Montant'
              value={montant}
              ariaLabel='montant de la subvention'
              description='Montant de la subvention'
              min={0}
              errorMessage={montantError}
              setIsValueValid={handleMontantValidity}
              onValueChange={handleMontant}
            />
          </div>

          <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-3w fr-mt-lg-0'>
            <DateInput
              label='Échéance'
              value={echeance}
              ariaLabel='date d’expiration de la subvention'
              description='Date à laquelle la subvention expire'
              onValueChange={e => setEcheance(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='fr-grid-row'>
        <Button
          label='Valider l’ajout de la subvention'
          icon='checkbox-circle-fill'
          isDisabled={!isFormCompleted || errorMessage}
          onClick={handleSubmit}
        >
          Valider l’ajout de la subvention
        </Button>
        <div className='fr-pl-3w'>
          <Button
            label='Annuler l’ajout de la subvention'
            buttonStyle='tertiary'
            onClick={onCancel}
          >
            Annuler
          </Button>
        </div>
      </div>
      {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
    </div>
  )
}

SubventionForm.propTypes = {
  initialValues: PropTypes.shape({
    nom: PropTypes.string,
    nature: PropTypes.string,
    montant: PropTypes.number,
    echeance: PropTypes.string
  }),
  isSubventionExisting: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default SubventionForm
