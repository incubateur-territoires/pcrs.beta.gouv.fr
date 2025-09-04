import {useState, useCallback, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash-es'

import {getPerimetersByName, getCommuneByCode} from '@/lib/decoupage-administratif-api.js'

import {useInput} from '@/hooks/input.js'

import {typeOptions} from '@/components/suivi-form/perimetres/utils/select-options.js'

import SelectInput from '@/components/select-input.js'
import Button from '@/components/button.js'
import AutocompleteInput from '@/components/autocomplete-input.js'

const PerimetreForm = ({perimetres, onCancel, onSubmit}) => {
  const [type, setType, typeError] = useInput({initialValue: 'epci', isRequired: true})
  const [code, setCode] = useState(null)
  const searchValueInput = useInput({isRequired: true})
  const [searchValue, setSearchValue, searchValueError] = searchValueInput
  const resetSearchValueInput = searchValueInput[5]
  const [foundPerimetres, setFoundPerimetres] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isFormCompleted, setIsFormCompleted] = useState(false)
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {}, [type, code, foundPerimetres])

  const onReset = useCallback(() => {
    setErrorMessage(null)

    setSearchValue('')
    setCode(null)
    setFoundPerimetres([])
    resetSearchValueInput()
  }, [
    setSearchValue,
    setCode,
    setErrorMessage,
    resetSearchValueInput
  ])

  useEffect(() => {
    if (type && code) {
      setErrorMessage(null)
      setIsFormCompleted(true)
    } else {
      setIsFormCompleted(false)
    }
  }, [type, code])

  const handleSubmit = () => {
    onSubmit({type, code})
  }

  const fetchPerimetres = useRef(debounce(async (nom, type, signal) => {
    setIsLoading(true)

    const inputToNumber = Number.parseInt(nom, 10)
    const isInputNumber = !Number.isNaN(inputToNumber)

    try {
      if (isInputNumber && type === 'commune') {
        const perimetre = await getCommuneByCode(nom, signal)
        // Get on single object
        setFoundPerimetres([perimetre])
      } else {
        const perimetres = await getPerimetersByName(nom, type, signal)
        // Get an collection
        setFoundPerimetres(perimetres)
      }
    } catch {
      if (!signal.aborted) {
        setFoundPerimetres([])
      }
    }

    setIsLoading(false)
  }, 300))

  useEffect(() => {
    if (!searchValue || searchValue.length < 3) {
      setFoundPerimetres([])
      return
    }

    const ac = new AbortController()
    fetchPerimetres.current(searchValue, type, ac.signal)

    return () => {
      ac.abort()
    }
  }, [searchValue, type, fetchPerimetres])

  const handleChange = e => {
    const {value} = e.target

    setErrorMessage(null)

    setType(prevType => {
      if (value !== prevType) {
        onReset()

        return value
      }
    })
  }

  const handleSelect = ({code}) => {
    const foundPerimetreName = foundPerimetres.find(result => result.code === code).nom

    if (perimetres.includes(`${type}:${code}`)) {
      setErrorMessage('Ce périmètre est déjà présent.')
    } else {
      setCode(code)
      setSearchValue(foundPerimetreName)
    }
  }

  return (
    <div
      style={{
        width: '100%',
        border: '1px solid lightgrey',
        padding: '0 2em',
        borderRadius: '4px'
      }}
    >
      <div className='fr-grid-row fr-my-5w'>
        <div className='fr-col-12 fr-col-md-6 fr-mb-3w'>
          <SelectInput
            isRequired
            label='Type'
            value={type}
            options={typeOptions}
            ariaLabel='types de territoire'
            description='Types de territoire'
            errorMessage={typeError}
            onValueChange={handleChange}
          />
        </div>

        {type && (
          <div className='fr-col-12 fr-col-md-6 fr-pl-md-3w'>
            <AutocompleteInput
              isRequired
              label={`Nom ${type === 'commune' ? 'ou code' : ''}`}
              value={searchValue}
              description={`Recherche par nom ${type === 'commune' ? ' ou code INSEE' : ''} du territoire`}
              ariaLabel={`Rechercher par nom ${type === 'commune' ? 'ou code INSEE' : ''} du territoire`}
              errorMessage={searchValueError}
              results={foundPerimetres}
              isLoading={isLoading}
              renderItem={({nom, code}) => `${nom} - ${code}`}
              onInputChange={e => setSearchValue(e.target.value)}
              onSelectValue={handleSelect}
            />
          </div>
        )}

        <div className='fr-grid-row fr-mt-3w'>
          <Button
            label='Valider l’ajout du périmètre'
            icon='checkbox-circle-fill'
            isDisabled={!isFormCompleted || errorMessage}
            onClick={handleSubmit}
          >
            Valider l’ajout du périmètre
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
      </div>

      {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
    </div>
  )
}

PerimetreForm.propTypes = {
  perimetres: PropTypes.array.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
}

export default PerimetreForm
