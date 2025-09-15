import Image from 'next/legacy/image'

import Page from '@/layouts/main.js'

import colors from '@/styles/colors.js'

import Hero from '@/components/hero.js'
import SectionImage from '@/components/section-image.js'
import Section from '@/components/section.js'
import Button from '@/components/button.js'
import EventCarousel from '@/components/event-carousel.js'
import PostCard from '@/components/post-card.js'
import {getStaticPosts} from '@/lib/blog-static.js'

const Home = () => {
  const testimonies = getStaticPosts().filter(p =>
    p.tags.some(tag => tag.name === 'Témoignage')
  ) || []

  return (
    <Page>
      <EventCarousel />
      <Hero />
      <>
        <p className='intro fr-p-3w fr-p-md-7w fr-text--lg'>
          Vous êtes sur le site construit par et pour les territoires. Il expose les différents projets PCRS en cours, leurs acteurs et résultats produits. C’est le support de l’animation nationale associé à la documentation à produire.
        </p>

        <style jsx>{`
.intro {
background: ${colors.darkgrey};
color: white;
text-align: center;
}
`}</style>
      </>

      <SectionImage
        title='Documentation'
        imageLink='/images/illustrations/doc_illustration.svg'
        id='documentation'
      >
        <p>
          Accompagné par l’ANCT, vous avez tous les éléments en main pour mettre au point le PCRS sur votre territoire. Vous pouvez accéder au contexte réglementaire sur <a className='fr-link fr-icon-external-link-line fr-link--icon-right' href=' https://docs.pcrs.beta.gouv.fr/contexte-reglementaire/reglementation'>cette page</a>.
        </p>
        <p>
          Un ensemble de fiches pratiques est disponible en fonction des problématiques que vous pouvez rencontrer, associées à une foire aux questions pour répondre aux interrogations les plus fréquentes.
          Si vous ne trouvez pas le contenu correspondant à vos attentes, n’hésitez pas à nous contacter.
        </p>

        <div className='doc-links'>
          <ul className='doc-list'>
            <li>
              <a className='fr-link fr-icon-article-fill fr-link--icon-left' href='https://docs.pcrs.beta.gouv.fr/contexte-reglementaire/geostandards'>
                Standards
              </a>
            </li>
            <li>
              <a className='fr-link fr-icon-article-fill fr-link--icon-left' href='https://docs.pcrs.beta.gouv.fr/contexte-reglementaire/reglementation'>
                Règlementation
              </a>
            </li>
            <li>
              <a className='fr-link fr-icon-article-fill fr-link--icon-left' href='https://docs.pcrs.beta.gouv.fr/organiser-son-projet-pcrs/construction'>
                Bonnes pratiques
              </a>
            </li>
          </ul>

          <div className='fr-grid-row fr-grid-row--center fr-grid-row--middle fr-grid-row--gutters fr-mt-3w'>
            <div className='fr-grid-row fr-grid-row--center fr-col-12 fr-col-lg-5'>
              <Button
                isExternal
                href='https://docs.pcrs.beta.gouv.fr/'
                label='Accéder à la documentation'
              >
                <span className='fr-icon-book-2-fill' aria-hidden='true' />&nbsp;Voir la documentation
              </Button>
            </div>
            <div className='fr-grid-row fr-grid-row--center fr-col-12 fr-col-lg-5'>
              <Button
                isExternal
                href='https://tube.numerique.gouv.fr/c/pcrs/videos'
                label='Découvrir la chaîne vidéo'
              >
                <span className='fr-icon-film-line' aria-hidden='true' />&nbsp;Découvrir la chaîne vidéo
              </Button>
            </div>
          </div>
        </div>

        <style jsx>{`
          p, .doc-links{
            text-align: left;
          }

          .doc-links {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2em;
          }

          .doc-list {
            display: grid;
            justify-content: center;
            gap: 10px;
          }
        `}</style>
      </SectionImage>

      <SectionImage
        title='Événements autour du PCRS'
        background='blue'
        imageLink='/images/illustrations/calendar_illustration.svg'
        id='evenements'
      >
        <div className='fr-p-2w fr-p-lg-4w fr-grid-row fr-grid-row--center'>
          <p className='fr-py-1w'>
            Tenez-vous informé des prochains événements organisés par l’ANCT à propos du PCRS. Ateliers, conférences, annonces pour être toujours à jour.
          </p>
          <Button
            isWhite
            href='/evenements'
            buttonStyle='secondary'
            label='Évenement à venir'
          >
            Événements à venir
          </Button>
        </div>
      </SectionImage>

      {testimonies.length > 0 && (
        <Section
          title='Témoignages autour du PCRS'
          background='secondary'
          id='testimonies'
          style={{
            textAlign: 'center'
          }}
        >
          <Image
            src='/images/illustrations/testimony_illustration.svg'
            height={250}
            width={250}
            alt=''
            className='fr-my-5w'
          />
          <div className='fr-p-2w fr-p-lg-4w fr-container--fluid'>
            <div className='fr-grid-row fr-grid-row--gutters fr-my-5w'>
              {testimonies.map(testimony => (
                <div key={testimony.id} className='card-container fr-col-12 fr-col-lg'>
                  <PostCard isTestimony post={testimony} />
                </div>
              )
              )}
            </div>

            <Button href='/temoignages' label='Lire tous les témoignages'>
              Lire tous les témoignages
            </Button>
          </div>

          <style jsx>{`
.card-container {
text-align: start;
}
`}</style>
        </Section>
      )}

      <div>
        <SectionImage
          title='Contactez-nous'
          subtitle='Vous ne trouvez pas les réponses à vos questions sur ce site ou dans la documentation ?'
          id='contact'
          imageLink='/images/illustrations/contact_illustration.svg'
        >
          <div className='fr-grid-row'>
            <div className='fr-col-12'>
              <h3 className='fr-text--lg fr-mb-1w'>Envoyez nous un email</h3>
              <p className='fr-text--sm'>Notre équipe fera le nécessaire pour vous répondre dans les plus brefs délais, dans la limite de sa disponibilité.</p>
              <div className='fr-grid-row fr-grid-row--center'>
                <Button
                  isExternal
                  href='mailto:contact@pcrs.beta.gouv.fr'
                  label='Contacter l’équipe'
                  size='sm'
                >
                  <span className='fr-icon-mail-line' aria-hidden='true' />&nbsp;Contactez-nous
                </Button>
              </div>
            </div>

            <div className='fr-col-12 fr-py-7w'>
              <h3 className='fr-text--lg fr-mb-1w'>Rejoignez le forums des Géocommuns ou suivez-nous sur les réseaux sociaux</h3>
              <p className='fr-text--sm'>Des lieux d’échange entre <b>porteurs de projets</b>, <b>animateurs</b> et <b>utilisateurs des livrables</b> du PCRS. Venez nous rencontrer pour présenter <b>vos problématiques</b> et vous inspirer d’autres solutions dans les échanges existants.</p>
              <div className='fr-grid-row fr-grid-row--center fr-grid-row--middle fr-grid-row--gutters fr-mt-3w'>
                <div className='fr-grid-row fr-grid-row--center fr-col-12 fr-col-lg-5'>
                  <Button
                    isExternal
                    href='https://forum.geocommuns.fr/'
                    label='Rejoindre le forum'
                    size='sm'
                  >
                    <span className='fr-icon-question-answer-line' aria-hidden='true' />&nbsp;Rejoindre le forum
                  </Button>
                </div>
                <div className='fr-grid-row fr-grid-row--center fr-col-12 fr-col-lg-5'>
                  <Button
                    isExternal
                    href='https://www.linkedin.com/company/pcrs-beta-gouv-fr/'
                    label='Nous suivre sur Linkedin'
                    size='sm'
                  >
                    <span className='fr-icon-linkedin-box-fill' aria-hidden='true' />&nbsp;Nous suivre sur Linkedin
                  </Button>
                </div>
              </div>
            </div>

            <style jsx>{`
              .social-media {
                background: transparent;
              }
          `}</style>
          </div>
        </SectionImage>
      </div>
    </Page>
  )
}

export default Home
