import {useState, useRef, useCallback} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import Loader from '@/components/loader.js'

const AutocompleteInput = ({
  label = '',
  value = '',
  description = null,
  placeholder = null,
  ariaLabel = null,
  errorMessage = null,
  isRequired = false,
  isDisabled = false,
  onInputChange,
  onSelectValue,
  results,
  renderItem,
  isLoading = false,
  ...props
}) => {
  const inputState = errorMessage ? 'error' : ''
  const wrapperRef = useRef(null)

  const [activeSuggestion, setActiveSuggestion] = useState(0)
  const [isSuggestionsMenuOpen, setIsSuggestionsMenuOpen] = useState(false)

  const onValueChange = useCallback(e => {
    if (value.length === 0) {
      setIsSuggestionsMenuOpen(false)
    }

    onInputChange(e)
    setActiveSuggestion(0)
    setIsSuggestionsMenuOpen(true)
  }, [value, onInputChange])

  const onLoseFocus = event => {
    if (wrapperRef?.current && !wrapperRef?.current.contains(event.relatedTarget)) {
      // Close the menu only if focus is not on the list or input
      setIsSuggestionsMenuOpen(false)
    }
  }

  const onFocus = () => {
    if (results) {
      setIsSuggestionsMenuOpen(true)
    }
  }

  const onTabSelect = useCallback((event, item) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      setActiveSuggestion(0)
      onSelectValue(item)
      setIsSuggestionsMenuOpen(false)
    }
  }, [onSelectValue])

  const onKeyDown = useCallback(event => {
    if (event.key === 'Enter' && results.length === 0) {
      event.preventDefault()

      return
    }

    if (event.key === 'Enter' && results.length > 0) {
      event.preventDefault()

      setActiveSuggestion(0)
      onSelectValue(results[activeSuggestion])
      setIsSuggestionsMenuOpen(false)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (activeSuggestion === 0) {
        return
      }

      setActiveSuggestion(activeSuggestion - 1)
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (activeSuggestion === results.length - 1) {
        return
      }

      setActiveSuggestion(activeSuggestion + 1)
    }

    if (event.key === 'Tab' && isSuggestionsMenuOpen) {
      onTabSelect(event, results[activeSuggestion])
    }
  }, [activeSuggestion, results, isSuggestionsMenuOpen, onSelectValue, onTabSelect])

  return (
    <div className='search-wrapper'>
      <div className={`fr-grid-row fr-search fr-input-group--${inputState}`}>
        <label className='fr-col-12'>
          <div className={isRequired ? 'required-label' : ''} >{label}</div>

          {description && <span className='fr-hint-text fr-mb-2w fr-mt-0'>{description}</span>}
        </label>

        <input
          {...props}
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
          onKeyDown={onKeyDown}
        />

        {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
      </div>

      {isSuggestionsMenuOpen && (
        isLoading ? (
          <div className='fr-grid-row fr-grid-row--center fr-p-2w fr-mt-1w fr-p-0 menu'><Loader size='small' /></div>
        ) : (
          <ul ref={wrapperRef} className='fr-mt-1w fr-p-0 menu' role='listbox'>
            {results.map((item, index) => (
              <li
                key={JSON.stringify(item)}
                className={`${index === activeSuggestion ? 'suggestion-active' : ''} fr-p-2w`}
                tabIndex={0} // Allow keyboard focus
                aria-selected={index === activeSuggestion} // Indicate selected item for screen readers
                onClick={() => {
                  setActiveSuggestion(0)
                  setIsSuggestionsMenuOpen(false)
                  onSelectValue(item)
                }}
                onKeyDown={e => onTabSelect(e, item)}
              >
                {renderItem(item)}
              </li>
            ))}

            {results.length === 0 && value.length >= 3 && <li className='fr-p-2w'>Aucun résultat</li>}
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

        .suggestion-active,
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
  isLoading: PropTypes.bool,
  renderItem: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSelectValue: PropTypes.func.isRequired
}

export default AutocompleteInput
