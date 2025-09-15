import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {handleRangeError} from './suivi-form/acteurs/utils/error-handlers.js'
import {stripNonNumericCharacters} from '@/lib/string.js'

const NumberInput = ({
  label = '',
  value = '',
  min = null,
  max = null,
  ariaLabel = '',
  placeholder = null,
  errorMessage = null,
  description = null,
  isRequired = false,
  isDisabled = false,
  onValueChange = () => {},
  setIsValueValid = () => {},
  onFocus = null,
  onBlur = null,
  ...props
}) => {
  const [inputError, setInputError] = useState(errorMessage)

  const inputState = inputError ? 'error' : ''

  useEffect(() => {
    const inputErrorMessage = handleRangeError(value, min, max)
    setInputError(inputErrorMessage)
  }, [value, min, max, errorMessage])

  useEffect(() => {
    setIsValueValid(!inputError)
  }, [inputError, setIsValueValid])

  const handleChange = e => {
    const strippedValue = stripNonNumericCharacters(e.target.value)
    e.target.value = strippedValue
    onValueChange(e)
  }

  return (
    <div className={`fr-input-group fr-input-group--${inputState}`}>
      <label className='fr-label'>
        <div className={isRequired ? 'required-label' : ''}>{label}</div>
        {description && <span className='fr-hint-text fr-mb-2w fr-mt-0'>{description}</span>}
      </label>

      <input
        {...props}
        required={isRequired}
        className={`fr-input fr-input--${inputState}`}
        value={value}
        aria-label={ariaLabel}
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {(inputError) && (
        <p id='text-input-error-desc-error' className='fr-error-text'>
          {inputError}
        </p>
      )}

      <style jsx>{`
        .required-label::after {
          content: '*';
          margin-left: 5px
        }
      `}</style>
    </div>
  )
}

NumberInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  ariaLabel: PropTypes.string,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  description: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onValueChange: PropTypes.func,
  setIsValueValid: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

export default NumberInput
