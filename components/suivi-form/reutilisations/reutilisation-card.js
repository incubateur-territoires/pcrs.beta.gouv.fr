import PropTypes from 'prop-types'
import Image from 'next/image'

import {s3ImageUrl} from '../../../utils/s3-image-url.js'

import colors from '@/styles/colors.js'

const ReutilisationCard = ({titre, lien, description, imageURL, isDisabled, handleDelete, handleEdition}) => (
  <div className={`fr-grid-row fr-p-2w fr-my-3w card-container ${isDisabled ? 'card-disable' : ''}`}>
    <div className='fr-grid-row fr-col-10'>

      <div className='fr-grid-row fr-col-12'>
        <div className='fr-grid-row fr-col-12 fr-col-md-4 fr-p-1w'>
          <div className='label fr-col-12 fr-text--lg fr-m-0'>Titre</div>
          <div className='fr-m-0 fr-col-12 fr-text--sm'>{titre}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-4 fr-p-1w'>
          <div className='label fr-col-12 fr-text--lg fr-m-0'>Lien</div>
          <div className='fr-m-0 fr-col-12 fr-text--sm'>{lien}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-3 fr-p-1w'>
          <div className='label fr-col-12 fr-text--lg fr-m-0'>Illustration</div>
          {imageURL ? (
            <Image
              className='fr-responsive-img'
              src={imageURL ? s3ImageUrl(imageURL) : '/images/illustrations/blog_fallback.svg'}
              alt={'Illustration de ' + titre}
              height={250}
              width={500}
            />
          ) : (
            <div>N/A</div>
          )}
        </div>
      </div>
      <div className='fr-grid-row fr-col-12 fr-col-md-10 fr-p-1w'>
        <div className='label fr-col-12 fr-text--lg fr-m-0'>Description</div>
        <div className='fr-m-0 fr-col-12 fr-text--sm'>
          {description
            ? description.split('\n').map((line, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={idx}>{line}</div>
            )) : 'Pas de description'}
        </div>
      </div>

    </div>

    {!isDisabled && (
      <div className='fr-grid-row fr-col-12 fr-col-md-2 fr-mt-3w fr-mt-md-0 fr-pl-md-1w fr-grid-row--middle '>
        <button
          type='button'
          className='fr-grid-row fr-col-md-12 fr-col-lg-6 update-button'
          onClick={handleEdition}
        >
          <span className='fr-icon-edit-line fr-col-12' aria-hidden='true' />
          <div className='fr-col-12'>Modifier</div>
        </button>

        <button
          type='button'
          className='fr-grid-row fr-col-md-12 fr-col-lg-6 fr-pl-1w delete-button'
          onClick={handleDelete}
        >
          <span className='fr-icon-delete-line fr-col-12' aria-hidden='true' />
          <div className='fr-col-12'>Supprimer</div>
        </button>
      </div>
    )}

    <style jsx>{`
      .card-container {
        background: ${colors.grey975};
        border-radius: 4px;
      }

      .card-disable {
        opacity: 30%;
        pointer-events: none;
      }

      .label {
        font-weight: bold;
        color: ${colors.blueFranceSun113};
      }

      .update-button, .delete-button {
        text-decoration: underline;
        width: fit-content;
      }

      .update-button {
        color: ${colors.blueFranceSun113};
      }

      .delete-button {
        color: ${colors.error425};
      }

      button:disabled {
        color: ${colors.grey200};
      }
    `}</style>
  </div>
)

ReutilisationCard.propTypes = {
  titre: PropTypes.string.isRequired,
  lien: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageURL: PropTypes.string,
  isDisabled: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleEdition: PropTypes.func
}

export default ReutilisationCard
