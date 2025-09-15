import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const Section = ({title = null, subtitle = null, background = 'primary', children, ...props}) => (
  <section className={`fr-py-12w ${background}`} {...props}>
    <div className='fr-container'>
      {title && (
        <h2 className='fr-pt-4w'>{title}</h2>
      )}

      {subtitle && (
        <div className='fr-p-2w subtitle fr-text fr-text--lg'><b>{subtitle}</b></div>
      )}

      <div className='fr-grid fr-grid--gutter'>
        {children}
      </div>
    </div>
    <style jsx>{`
      h2 {
        color: ${(background === 'dark' || background === 'blue') ? 'white' : 'inherit'}
      }

      .subtitle {
        color: ${(background === 'dark' || background === 'blue') ? 'white' : colors.grey200}
      }

      .primary {
        background-color: white;
      }

      .secondary {
        background-color: ${colors.grey975};
      }

      .dark {
        background-color: ${colors.darkgrey};
        color: white;
      }

      .blue {
        background-color: ${colors.info200};
        color: white;
      }
    `}</style>
  </section>
)

Section.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  background: PropTypes.oneOf([
    'primary',
    'secondary',
    'dark',
    'blue'
  ]),
  children: PropTypes.node.isRequired
}

export default Section

