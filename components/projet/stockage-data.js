import PropTypes from 'prop-types'

import DropdownList from '../containers/dropdown-list.js'
import colors from '@/styles/colors.js'

import {STOCKAGE_PARAMS} from '@/lib/utils/projet.js'

import Badge from '@/components/badge.js'

const StockageData = ({isPublic, type, params}) => (
  <div className='fr-mt-3w'>
    <div className='fr-grid-row fr-grid-row--middle'>
      <span className='fr-icon-server-fill fr-mr-1w' aria-hidden='true' />
      <h3 className='section-title fr-text--md fr-m-0'>Stockage</h3>
    </div>

    <div className='fr-mt-1w'>
      <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Type de stockage :</div><span>{type.toUpperCase()}</span></div>
      <div className='fr-mt-1w fr-grid-row'>
        <div className='data-title fr-mr-1w'>Statut du stockage:</div>
        <Badge background={isPublic ? colors.success425 : colors.warningMain525} textColor='white'> {isPublic ? 'Public' : 'Privé'} </Badge>
      </div>

      {(isPublic && ['ftp', 'sftp'].includes(type)) && (
        <DropdownList
          title='Afficher les paramètres du stockage'
          list={Object.keys(params).map(key => {
            const {label, defaultValue} = STOCKAGE_PARAMS[key]

            return {
              label,
              value: params[key] || defaultValue
            }
          })}
          isDefaultOpen={false}
        />
      )}
    </div>

    <style jsx>{`
      .data-title {
        color: ${colors.info425};
        font-weight: bold;
      }
    `}</style>
  </div>
)

StockageData.propTypes = {
  type: PropTypes.string.isRequired,
  params: PropTypes.object,
  isPublic: PropTypes.bool
}

StockageData.defaultProps = {
  isPublic: false
}

export default StockageData

