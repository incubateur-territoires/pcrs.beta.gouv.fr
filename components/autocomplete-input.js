import {useState, useRef, useCallback} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash'

import colors from '@/styles/colors.js'

import Loader from '@/components/loader.js'

const AutocompleteInput = ({
  label,
  value,
  description,
  placeholder,
  ariaLabel,
  errorMessage,
  isRequired,
  isDisabled,
  onInputChange,
  onSelectValue,
  results,
  renderItem,
  isLoading
}) => {
  const inputState = errorMessage ? 'error' : ''
  const wrapperRef = useRef(null)

  const [isSuggestionsMenuOpen, setIsSuggestionsMenuOpen] = useState(false)

  const onValueChange = useCallback(e => {
    onInputChange(e.target.value)
    setIsSuggestionsMenuOpen(true)
  }, [onInputChange])

  const onLoseFocus = () => {
    // Delay closing the suggestions menu to check if focus is on the list or input
    setTimeout(() => {
      if (!wrapperRef.current.contains(document.activeElement)) {
        // Close the menu only if focus is not on the list or input
        setIsSuggestionsMenuOpen(false)
      }
    }, 0)
  }

  const onFocus = () => {
    if (results) {
      setIsSuggestionsMenuOpen(true)
    }
  }

  const onTabSelect = (event, item) => {
    if (event.key === 'Enter') {
      onSelectValue(item)
      setIsSuggestionsMenuOpen(false)
    }
  }

  return (
    <div className='search-wrapper'>
      <div className={`fr-grid-row fr-search fr-input-group--${inputState}`}>
        <label className='fr-col-12'>
          <div className={isRequired ? 'required-label' : ''} >{label}</div>

          {description && <span className='fr-hint-text fr-mb-2w fr-mt-0'>{description}</span>}
        </label>

        <input
          type='search'
          aria-label={ariaLabel}
          required={isRequired}
          className={`fr-input fr-input--${inputState}`}
          placeholder={placeholder}
          disabled={isDisabled}
          value={value}
          onChange={onValueChange}
          onFocus={onFocus}
          onBlur={onLoseFocus}
        />

        {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
      </div>

      {isSuggestionsMenuOpen && (
        isLoading ? (
          <div className='fr-grid-row fr-grid-row--center fr-p-2w fr-mt-1w fr-p-0 menu'><Loader size='small' /></div>
        ) : (
          <ul ref={wrapperRef} className='fr-mt-1w fr-p-0 menu' role='listbox'>
            {results.map(item => (
              <li
                key={uniqueId()}
                className='fr-p-2w'
                tabIndex={0} // Allow keyboard focus
                onClick={() => {
                  setIsSuggestionsMenuOpen(false)
                  onSelectValue(item)
                }}
                onKeyDown={e => onTabSelect(e, item)}
              >
                {renderItem(item)}
              </li>
            ))}
          </ul>
        )
      )}

      <style jsx>{`
        .required-label::after {
          content: '*';
          margin-left: 5px
        }

        .search-wrapper {
          position: relative;
          z-index: 2;
        }

        .menu {
          box-shadow: 2px 12px 23px 2px rgba(0,0,0,0.23);
          border-radius: 0 0 5px 5px;
          background: white;
          position: absolute;
          left: 0;
          right: 0;
        }

        .menu li {
          border-bottom: solid 2px ${colors.grey900};
        }

        .menu li:hover {
          background-color: ${colors.info425};
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .menu li:last-child{
          border-bottom: none;
        }
      `}</style>
    </div>
  )
}

AutocompleteInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  errorMessage: PropTypes.string,
  results: PropTypes.array.isRequired,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  renderItem: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSelectValue: PropTypes.func.isRequired
}

AutocompleteInput.defaultProps = {
  label: '',
  value: '',
  description: null,
  placeholder: null,
  ariaLabel: null,
  errorMessage: null,
  isRequired: false,
  isDisabled: false
}

export default AutocompleteInput
