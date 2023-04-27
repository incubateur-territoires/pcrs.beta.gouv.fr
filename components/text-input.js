import PropTypes from 'prop-types'

const TextInput = ({label, value, type, ariaLabel, placeholder, errorMessage, description, isRequired, isDisabled, onValueChange, onFocus, onBlur}) => {
  const inputState = errorMessage ? 'error' : ''

  return (
    <div className={`fr-input-group fr-input-group--${inputState}`}>
      <label className='fr-label'>
        <div className={isRequired ? 'required-label' : ''}>{label}</div>
        {description && <span className='fr-hint-text fr-mb-2w fr-mt-0'>{description}</span>}
      </label>

      <input
        type={type}
        required={isRequired}
        className={`fr-input fr-input--${inputState}`}
        value={value}
        aria-label={ariaLabel}
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={onValueChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}

      <style jsx>{`
        .required-label::after {
          content: '*';
          margin-left: 5px
        }
      `}</style>
    </div>
  )
}

TextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.oneOf([
    'text',
    'password',
    'email'
  ]),
  ariaLabel: PropTypes.string,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  description: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onValueChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

TextInput.defaultProps = {
  label: '',
  value: '',
  type: 'text',
  ariaLabel: '',
  placeholder: null,
  errorMessage: null,
  description: null,
  isRequired: false,
  isDisabled: false,
  onFocus: null,
  onBlur: null
}

export default TextInput
