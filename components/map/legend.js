import {useState} from 'react'
import PropTypes from 'prop-types'

import {STATUS, NATURES, REGIMES} from '@/lib/utils/projet.js'

import Badge from '@/components/badge.js'

const Legend = ({isMobile = false, legend = 'project-fills'}) => {
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
        borderRadius: '5px',
        zIndex: 1
      }}
    >
      {isOpen ? (
        <>
          <span><u>Légende :</u></span>
          {(legend === 'projets-fills' || !legend) && (
            <>
              {Object.values(STATUS).map(({label, color, textColor}) => (
                <Badge
                  key={label}
                  className='fr-pb-1v'
                  size='small'
                  background={color}
                  textColor={textColor}
                >
                  {label}
                </Badge>
              ))}
            </>
          )}
          {legend === 'projets-fills-nature' && (
            <>
              <Badge className='fr-pb-1v fr-pt-1v' size='small' background={NATURES.vecteur.color}>{NATURES.vecteur.label}</Badge>
              <Badge className='fr-pb-1v' size='small' background={NATURES.raster.color}>{NATURES.raster.label}</Badge>
              <Badge className='fr-pb-2v' size='small' background={NATURES.mixte.color}>{NATURES.mixte.label}</Badge>
            </>
          )}
          {legend === 'projets-fills-regime' && (
            <>
              <Badge className='fr-pb-1v fr-pt-1v' size='small' background={REGIMES.production.color}>{REGIMES.production.label}</Badge>
              <Badge className='fr-pb-1v' size='small' background={REGIMES.maj.color}>{REGIMES.maj.label}</Badge>
              <Badge className='fr-pb-2v' size='small' background={REGIMES.anticipation.color}>{REGIMES.anticipation.label}</Badge>
            </>
          )}
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

Legend.propTypes = {
  isMobile: PropTypes.bool,
  legend: PropTypes.string
}

export default Legend
