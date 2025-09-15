import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/legacy/image'

import {shortDate} from '@/lib/date-utils.js'

const PostCard = ({post, isTestimony = false}) => {
  const sanitizedDescription = post.excerpt.split(' ').slice(0, 25).join(' ') + '...'
  const postHref = isTestimony ? `/temoignages/${post.slug}` : `/blog/${post.slug}`

  return (
    <div className='blog-card fr-card fr-enlarge-link'>
      <div className='fr-card__body'>
        <div className='fr-card__content'>
          <h3 className='fr-card__title'>
            <Link passHref legacyBehavior href={postHref}>
              <a href=''>{post.title}</a>
            </Link>
          </h3>

          <p className='fr-card__desc'>{sanitizedDescription} <i>lire la suite</i></p>
          {!isTestimony && (
            <div className='fr-card__start'>
              <ul className='fr-tags-group'>
                {post.tags.map(tag => <li key={tag.id}><p className='fr-tag'>{tag.name}</p></li>)}
              </ul>
            </div>
          )}
        </div>
        <div className='posting-date fr-text--sm'>
          Publié le {shortDate(post.published_at)} - {post.reading_time} min de lecture
        </div>
      </div>

      <div className='fr-card__header'>
        <div className='fr-card__img'>
          <Image
            src={post.feature_image || `/images/illustrations/${isTestimony ? 'testimony' : 'blog'}_fallback.svg`}
            height={1000}
            width={1000}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover'
            }}
            alt={post.feature_image_alt || ''}
            aria-hidden='true'
          />
        </div>
      </div>

      <style jsx>{`
        .posting-date {
          text-align: right;
          font-style: italic;
          margin-right: -1rem
        }

        .blog-card i {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  isTestimony: PropTypes.bool
}

export default PostCard
