import PropTypes from 'prop-types'
import Image from 'next/legacy/image'

import colors from '@/styles/colors.js'

const SectionImage = ({
  title = null,
  subtitle = null,
  background = 'primary',
  imageLink,
  imageSide = 'left',
  panelBottom = null,
  children = null,
  ...props
}) => (
  <section className={`fr-py-12w ${background}`} {...props}>
    <div className={`content-wrapper ${imageLink ? 'illustrated' : ''}`}>
      <div className='illustration fr-m-auto'>
        <Image
          src={imageLink}
          height={250}
          width={250}
          alt=''
        />
      </div>

      <div className='rows-section'>
        <div className='fr-mb-4w'>
          <h2>{title}</h2>
          <div className='subtitle fr-text fr-text--lg'>
            <b>{subtitle}</b>
          </div>
        </div>
        {children}
      </div>
    </div>

    {panelBottom && (
      <div className='fr-col-12 fr-mt-n4w'>
        {panelBottom}
      </div>
    )}

    <style jsx>{`
      section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5em;
      }

      .primary {
        background: white;
      }

      .secondary {
        background: ${colors.grey975};
      }

      .blue {
        background: ${colors.info200};
        color: white;
      }

      .dark {
        background: ${colors.darkgrey};
        color: white;
      }

      h2 {
        text-align: center;
        color: ${background === 'color' || background === 'dark' || background === 'blue' ? 'white' : ''};
      }

      .subtitle {
         color: ${colors.grey200};
         text-align: center;
      }

      .content-wrapper {
        display: flex;
        justify-content: center;
        gap: 1em;
        width: 80%;
      }

      .illustrated {
        display: flex;
        flex-direction: ${imageSide === 'right' ? 'row-reverse' : 'row'};
        justify-content: center;
        flex-wrap: wrap;
      }

      .illustration {
        flex: 1;
        text-align: center;
      }

      .rows-section {
        min-width: 250px;
        flex: 2;
      }
    `}</style>
  </section>
)

SectionImage.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  imageLink: PropTypes.string.isRequired,
  background: PropTypes.oneOf([
    'primary',
    'secondary',
    'blue',
    'dark'
  ]),
  imageSide: PropTypes.oneOf([
    'left',
    'right'
  ]),
  children: PropTypes.node,
  panelBottom: PropTypes.node
}

export default SectionImage

