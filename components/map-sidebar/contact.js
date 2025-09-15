import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const Contact = ({name = null, phone = null, mail = null}) => (
  <div className='contact fr-container fr-pl-0 fr-ml-0'>
    <div className='contact-info fr-grid-row'>
      <span aria-disabled className='fr-icon-user-fill fr-col-1 fr-mr-1w' aria-hidden='true' />
      <div className='fr-col-10 contact-data fr-pl-2w fr-ml-1w'>
        <div aria-label='Nom du contact de référence'>
          {name || 'non renseigné'}
        </div>
      </div>
    </div>

    <div className='contact-info fr-grid-row fr-grid-row--middle'>
      <span aria-disabled className='fr-icon-phone-fill fr-col-1 fr-mr-1w fr-py-2w' aria-hidden='true' />
      <div className='fr-col-10 contact-data fr-py-2w fr-pl-2w fr-ml-1w'>
        <a href={phone && `tel:${phone}`} aria-label='Numéro de téléphone du contact de référence'>
          {phone || 'non renseigné'}
        </a>
      </div>
    </div>

    <div className='contact-info fr-grid-row fr-grid-row--middle'>
      <span aria-disabled className='fr-icon-mail-fill fr-col-1 fr-mr-1w' aria-hidden='true' />
      <div className='fr-col-10 contact-data fr-pl-2w fr-ml-1w'>
        <a
          href={mail && `mailto:${mail}`}
          target='_self'
          aria-label='Email du contact de référence'
        >
          {mail || 'non renseigné'}
        </a>
      </div>
    </div>
    <div />

    <style jsx>{`
      .contact {
        color: ${colors.blueFranceSun113};
      }

      .contact-data {
        border-left: 3px solid ${colors.blueFrance850};
      }
    `}</style>
  </div>
)

Contact.propTypes = {
  name: PropTypes.string,
  phone: PropTypes.string,
  mail: PropTypes.string
}

export default Contact
