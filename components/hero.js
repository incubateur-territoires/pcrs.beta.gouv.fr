import Image from 'next/legacy/image'
import Link from 'next/link'

import colors from '@/styles/colors.js'

const Hero = () => (
  <div className='hero-component'>
    <div className='hero-title fr-p-4w'>
      <h2>Accompagnement national des projets PCRS</h2>
      <div className='subtitle fr-text fr-text--lg'>Animer et outiller les projets locaux du Plan Corps de Rue Simplifié en cours et à venir</div>
    </div>

    <div className='nav-wrapper fr-mb-3w'>
      <div className='fr-p-2w'>
        <Link
          passHref
          legacyBehavior
          href='/#documentation'
        >
          <a aria-label='Accéder à la section documentation' className='fr-link illustrated-link fr-text--sm'>
            <Image
              height={70}
              width={70}
              src='/images/illustrations/doc_illustration.svg'
              alt=''
            />
            <span className='fr-pt-2w'>Documentation</span>
          </a>
        </Link>
      </div>

      <div className='fr-p-2w'>
        <Link
          passHref
          legacyBehavior
          href='/#evenements'
        >
          <a aria-label='Accéder à la section événements' className='fr-link illustrated-link fr-text--sm'>
            <Image
              height={70}
              width={70}
              src='/images/illustrations/calendar_illustration-colored.svg'
              alt=''
            />
            <span className='fr-pt-2w'>Événements</span>
          </a>
        </Link>
      </div>

      <div className='fr-p-2w'>
        <Link
          passHref
          legacyBehavior
          href='/#contact'
        >
          <a aria-label='Accéder à la section suivez de contact' className='fr-link illustrated-link fr-text--sm'>
            <Image
              height={70}
              width={70}
              src='/images/illustrations/contact_illustration.svg'
              alt=''
            />
            <span className='fr-pt-2w'>Prendre contact</span>
          </a>
        </Link>
      </div>
    </div>

    <div className='banner'>
      <Image
        src='/images/illustrations/banner.svg'
        alt=''
        height={292}
        width={1800}
        aria-hidden='true'
        style={{
          width: '100%',
          height: 'auto',
          display: 'flex',
          position: 'relative',
          left: '-1px',
          bottom: '-1px'
        }}
      /></div>
    <style jsx>{`
      .hero-component {
        text-align: center;
        position: relative;
      }

      .subtitle {
         color: ${colors.grey200};
         font-weight: bold;
      }

      .nav-wrapper {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 1em;
      }

      .illustrated-link {
        display: grid;
        grid-template-rows: 1fr auto;
        align-items: center;
        justify-items: center;
      }

      h3 {
        color: white;
      }

      .fr-link--icon-right {
        color: white;
      }

      @media screen and (max-width: 767px) {
      .banner {
        display: none;
      }
    }
  `}</style>
  </div>
)

export default Hero
