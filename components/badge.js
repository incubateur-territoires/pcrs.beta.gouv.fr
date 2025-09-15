import PropTypes from 'prop-types'

const Badge = ({background = null, textColor = null, size = 'regular', children = null, ...props}) => (
  <div className='badge fr-mr-1w fr-mb-1w' {...props}>
    <p className={`fr-badge badge-color ${size === 'small' ? 'fr-badge--sm' : ''}`}>
      {children}
    </p>

    <style jsx>{`
        .badge-color {
          background: ${background};
          color: ${textColor};
        }
    `}</style>
  </div>
)

Badge.propTypes = {
  background: PropTypes.string,
  textColor: PropTypes.string,
  size: PropTypes.oneOf([
    'small',
    'regular'
  ]),
  children: PropTypes.node
}

export default Badge

