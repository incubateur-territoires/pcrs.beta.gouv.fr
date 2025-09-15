import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const ListItem = ({title, children = null}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='fr-p-1w dropdown-item-container'>
      <div className='title-action-container' onClick={handleOpen}>
        <div className='title fr-text--sm fr-m-0'>{title}</div>
        <span className={`fr-icon-arrow-${isOpen ? 'down' : 'right'}-s-line`} aria-hidden='true' />
      </div>
      {isOpen && (
        <div className='fr-mt-4w'>
          {children}
        </div>
      )}

      <style jsx>{`
        .dropdown-item-container {
          background: ${colors.grey975};
        }

        .title-action-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .title {
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default ListItem
