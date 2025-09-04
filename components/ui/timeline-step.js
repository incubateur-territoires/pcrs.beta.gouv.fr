import Proptypes from 'prop-types'

import Loader from '@/components/loader.js'
import Tooltip from '@/components/tooltip.js'
import colors from '@/styles/colors.js'

const TimelineStep = ({step, status, isCurrentStep, isLastStep}) => {
  const tooltipContent = () => (
    <>
      <div className={`tooltip-label ${step ? '' : 'futur-label'}`}>
        {status.label}
      </div>

      {step?.date_debut
        ? <div className='start-date fr-text--sm fr-mb-0'>Depuis le {step.date_debut}</div>
        : <div className='start-date fr-text--sm fr-mb-0'>Date de début non renseignée</div>}

      <style jsx>{`
        .futur-label {
          color: ${colors.blueFrance850};
        }
        .tooltip-label, .next-step {
          font-weight: bold;
        }
        .start-date {
          font-style: italic;
        }
      `}</style>
    </>
  )

  return (
    <div className='step'>
      <Tooltip
        tooltipContent={() => tooltipContent()}
        position={(isLastStep || step?.statut === 'realise') ? 'left' : 'right'}
      >
        {(!isCurrentStep || isLastStep) ? (
          <div
            className='circle'
            style={{
              backgroundColor: step ? status.color : colors.grey900,
              color: step ? status.textColor : colors.grey200
            }}
          >
            {(step || isLastStep) && (
              <span className={isLastStep ? 'fr-icon-flag-fill' : 'fr-icon-check-line'} aria-hidden='true' />
            )}
          </div>
        ) : (
          <Loader type='pulse' size='small' />
        )}
      </Tooltip>

      {!isLastStep && <div className='separator' />}

      <style jsx>{`
        .circle {
          background: ${colors.grey900};
          height: 35px;
          width: 35px;
          border-radius: 50%;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .step {
          flex: 1;
          display: grid;
          grid-template-columns: 35px 1fr;
          align-items: center;
        }
        .separator {
          margin: 0 -2px;
          background: ${colors.info425};
          height: 5px;
        }
      `}</style>
    </div>
  )
}

TimelineStep.propTypes = {
  step: Proptypes.shape({
    statut: Proptypes.string,
    date_debut: Proptypes.string // eslint-disable-line camelcase
  }),
  status: Proptypes.shape({
    label: Proptypes.string.isRequired,
    color: Proptypes.string.isRequired,
    textColor: Proptypes.string.isRequired
  }).isRequired,
  isCurrentStep: Proptypes.bool.isRequired,
  isLastStep: Proptypes.bool.isRequired
}

export default TimelineStep
