import PropTypes from 'prop-types'
import Head from 'next/head'
import prune from 'underscore.string/prune'

const SITE_NAME = 'pcrs.beta.gouv.fr'

const Meta = ({
  title = null,
  description,
  type = 'website',
  image = null
}) => {
  description = prune(description, 160, '…')

  return (
    <Head>
      <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
      <link rel='icon' type='image/x-icon' href='/images/favicon.svg' />

      {/* Search Engine */}
      <meta name='description' content={description} />
      <meta name='image' content={image || 'https://pcrs.beta.gouv.fr/images/logos/card-meta.png'} />

      {/* Open Graph meta (Facebook, Pinterest) */}
      <meta property='og:title' content={title} />
      <meta property='og:type' content={type} />
      <meta property='og:description' content={description} />
      <meta property='author' content='pcrs.beta.gouv.fr' />
      <meta property='og:image' content='https://pcrs.beta.gouv.fr/images/logos/opengraph-meta.png' />
    </Head>
  )
}

Meta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'website',
    'article'
  ]),
  image: PropTypes.string
}

export default Meta
