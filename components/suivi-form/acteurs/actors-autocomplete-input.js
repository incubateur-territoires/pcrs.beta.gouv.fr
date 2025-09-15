import {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {debounce, pick} from 'lodash-es'

import {getEntreprises} from '@/lib/entreprises-api.js'
import {secteursActivites} from '@/components/suivi-form/acteurs/utils/actor-activites.js'

import AutocompleteInput from '@/components/autocomplete-input.js'

const ActorsAutocompleteInput = ({
  isRequired = false,
  inputValue,
  inputError = '',
  onValueChange,
  onSelectValue,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [foundEtablissements, setFoundEtablissements] = useState([])
  const [errorMessage, setErrorMessage] = useState()

  const fetchActors = useRef(debounce(async (nom, signal) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const foundActors = await getEntreprises(nom, {signal})
      const firstResults = foundActors.results.slice(0, 5)

      const sanitizedResults = firstResults.map(result => pick(result, ['nom_complet', 'siren', 'section_activite_principale', 'tranche_effectif_salarie']))

      setFoundEtablissements(sanitizedResults)
    } catch {
      if (!signal.aborted) {
        setErrorMessage('Aucun acteur n’a été trouvé')
        setFoundEtablissements([])
      }
    }

    setIsLoading(false)
  }, 300))

  useEffect(() => {
    if (!inputValue || inputValue.length < 3) {
      setErrorMessage(null)
      setFoundEtablissements([])
      return
    }

    const ac = new AbortController()
    fetchActors.current(inputValue, ac.signal)

    return () => {
      ac.abort()
    }
  }, [inputValue, fetchActors])

  return (
    <AutocompleteInput
      {...props}
      name='nom'
      isRequired={isRequired}
      label='Nom'
      value={inputValue}
      description='Nom de l’entreprise'
      ariaLabel='nom de l’entreprise à rechercher'
      results={foundEtablissements}
      isLoading={isLoading}
      errorMessage={errorMessage || inputError}
      renderItem={item => `${item.nom_complet} ${secteursActivites[item.section_activite_principale] ? `- ${secteursActivites[item.section_activite_principale]}` : ''}`}
      onInputChange={onValueChange}
      onSelectValue={onSelectValue}
    />
  )
}

ActorsAutocompleteInput.propTypes = {
  isRequired: PropTypes.bool,
  inputValue: PropTypes.string.isRequired,
  inputError: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  onSelectValue: PropTypes.func.isRequired
}

export default ActorsAutocompleteInput
