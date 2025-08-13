/* eslint-disable camelcase */
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'
import {STATUS} from '@/lib/utils/projet.js'

import {useInput} from '@/hooks/input.js'

import DateInput from '@/components/date-input.js'
import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const Etapes = ({initialValue, etapes, handleEtapes, canBeDisponible}) => {
  const {statut, date_debut} = initialValue

  const [statutInput, setStatutInput] = useInput({initialValue: statut})
  const [startDate, setStartDate] = useInput({initialValue: date_debut})

  const statusKeys = Object.keys(STATUS)

  const handleDateChange = event => {
    const {value, name} = event.target

    if (name === statutInput) {
      setStartDate(value)
    }

    handleEtapes(prevEtapes => {
      const etapesCopy = [...prevEtapes]
      etapesCopy[etapesCopy.findIndex(e => e.statut === name)] = {statut: name, date_debut: value}
      return etapesCopy
    })
  }

  const addStep = () => {
    const currentStepIndex = statusKeys.indexOf(statutInput)
    const nextStepIndex = statusKeys.indexOf(statutInput) + 1

    etapes[currentStepIndex].date_debut = startDate

    handleEtapes([...etapes, {statut: statusKeys[nextStepIndex], date_debut: ''}])

    setStatutInput(statusKeys[nextStepIndex])
    setStartDate('')
  }

  const onDelete = (etape, index) => {
    handleEtapes(current => current.filter(c => c.statut !== etape.statut))
    setStatutInput(etapes[index - 1].statut)
    setStartDate(etapes[index - 1].date_debut)
  }

  return (
    <div className='fr-mt-8w'>
      <h3 className='fr-h5'>Étapes</h3>
      <hr className='separator fr-my-3w' />

      {etapes.map((etape, index) => (
        <div key={etape.statut} className='fr-grid-row fr-my-5w'>
          <div className='fr-grid-row fr-col-11'>
            <div className='fr-col-12 fr-col-md-6'>
              <TextInput
                isRequired
                isDisabled
                id={etape.statut}
                label='Statut'
                ariaLabel='statut du projet'
                description='Statut du projet'
                value={STATUS[etape.statut].label}
              />
            </div>

            <div className='fr-col-12 fr-mt-3w fr-mt-md-0 fr-col-md-6 fr-pl-md-3w'>
              <DateInput
                isRequired
                name={etape.statut}
                label='Date de début'
                ariaLabel='date de commencement du statut'
                description='Date de début du statut'
                value={etape.statut === statutInput ? startDate : etape.date_debut || ''}
                onValueChange={handleDateChange}
              />
            </div>
          </div>
          <div className='fr-grid-row fr-grid-row--bottom fr-pl-2w fr-col-1 fr-pb-1w'>
            <button
              type='button'
              aria-label='Supprimer l’étape'
              className='delete-button fr-p-0'
              disabled={etape.statut !== statutInput || etape.statut === 'investigation'}
              onClick={() => onDelete(etape, index)}
            >
              <span className='fr-icon-delete-line' aria-hidden='true' />
            </button>
          </div>
        </div>
      )
      )}

      <Button
        label='Ajouter une étape'
        icon='add-circle-fill'
        iconSide='left'
        disabled={
          (!canBeDisponible && etapes.at(-1).statut === 'realise')
            || etapes.at(-1).statut === 'obsolete'
        }
        onClick={addStep}
      >
        Ajouter l’étape suivante
      </Button>

      <style jsx>{`
        .delete-button {
          text-decoration: underline;
          width: fit-content;
          color: ${colors.error425};
        }

        button:disabled {
          color: ${colors.grey850};
        }

        hr {
          border-top: 3px solid ${colors.grey850};
        }
      `}</style>
    </div>
  )
}

Etapes.propTypes = {
  etapes: PropTypes.array.isRequired,
  handleEtapes: PropTypes.func.isRequired,
  // eslint-disable-next-line react/boolean-prop-naming
  canBeDisponible: PropTypes.bool,
  initialValue: PropTypes.shape({
    statut: PropTypes.string.isRequired,
    date_debut: PropTypes.string
  }).isRequired
}

export default Etapes
