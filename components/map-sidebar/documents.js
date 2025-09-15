import PropTypes from 'prop-types'
import Image from 'next/image.js'

import colors from '@/styles/colors.js'

const Documents = ({source = null, documentation = null, contract = null}) => (
  <ul className='nav-wrapper'>
    <li className={source ? '' : 'disable'}>
      <a
        href={source}
        aria-label={source ? 'Consulter la source' : 'Source non-consutable'}
        className={`fr-link illustrated-link ${source ? '' : 'no-data'}`}
      >
        <Image
          height={50}
          width={50}
          src='/images/icons/link.svg'
          alt=''
          aria-hidden='true'
        />
        Source
      </a>
    </li>
    <li className={documentation ? '' : 'disable'}>
      <a
        href={documentation}
        aria-label={documentation ? 'Consulter la documentation' : 'Documentation non-consultable'}
        className={`fr-link illustrated-link ${documentation ? '' : 'no-data'}`}
      >
        <Image
          height={50}
          width={50}
          src='/images/icons/book.svg'
          alt=''
          aria-hidden='true'
        />
        Documentation
      </a>

    </li>
    <li className={contract ? '' : 'disable'}>
      <a
        href={contract}
        aria-label={contract ? 'Consulter la convention' : 'Convention non-consultable'}
        className={`fr-link illustrated-link ${contract ? '' : 'no-data'}`}
      >
        <Image
          height={50}
          width={50}
          src='/images/icons/contract.svg'
          alt=''
          aria-hidden='true'
        />
        Convention
      </a>
    </li>

    <style jsx>{`
      .nav-wrapper {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1em;
      }

      .illustrated-link {
        display: grid;
        grid-template-rows: 1fr auto;
        align-items: center;
        justify-items: center;
      }

      .disable a {
        pointer-events: none;
        opacity: 70%;
        color: ${colors.grey200};
      }
    `}</style>
  </ul>
)

Documents.propTypes = {
  source: PropTypes.string,
  documentation: PropTypes.string,
  contract: PropTypes.string
}

export default Documents
