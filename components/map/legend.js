import {useState} from 'react'
import PropTypes from 'prop-types'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'
import Badge from '@/components/badge.js'

const Legend = ({isMobile}) => {
  const {status} = PCRS_DATA_COLORS
  const [isOpen, setIsOpen] = useState(!isMobile)

  return (
    <div
      style={{
        position: 'absolute',
        left: '10px',
        top: isMobile ? '5px' : '',
        bottom: isMobile ? '' : '5px',
        backgroundColor: 'rgba(255, 255, 255, .8)',
        padding: '.5em',
        borderRadius: '5px'
      }}
    >
      {isOpen ? (
        <>
          <span><u>Légende :</u></span>
          <Badge className='fr-pb-1v fr-pt-1v' size='small' background={status.investigation}>Investigation</Badge>
          <Badge className='fr-pb-1v' size='small' background={status.production}>Production</Badge>
          <Badge className='fr-pb-1v' size='small' background={status.produit}>Produit</Badge>
          <Badge className='fr-pb-1v' size='small' background={status.livre} textColor='snow'>Livré</Badge>
          <Badge className='fr-pb-2v' size='small' background={status.obsolete} textColor='snow'>Obsolète</Badge>
          <hr className='fr-p-1v' />
          <span
            className='fr-icon--sm fr-icon-close-circle-line'
            aria-hidden='true'
            style={{
              verticalAlign: 'middle',
              cursor: 'pointer'
            }}
            onClick={() => setIsOpen(false)}
          >
            <small className='fr-pl-1v'>Fermer</small>
          </span>
        </>
      ) : (
        <span style={{cursor: 'pointer'}} onClick={() => setIsOpen(true)}>
          <span
            className='fr-icon--sm fr-icon-add-circle-line'
            aria-hidden='true'
            style={{
              verticalAlign: 'middle'
            }}
          />
          <small className='fr-pl-1v'>Ouvrir la légende</small>
        </span>
      )}
    </div>
  )
}

Legend.defaultProps = {
  isMobile: true
}

Legend.propTypes = {
  isMobile: PropTypes.bool
}

export default Legend

