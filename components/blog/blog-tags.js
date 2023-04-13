import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

const BlogTags = ({selectedTags, tagsList}) => {
  const router = useRouter()

  const capitalizeFirstLetter = tag => tag.charAt(0).toUpperCase() + tag.slice(1)

  const addTag = tag => {
    if (!selectedTags.includes(tag.slug)) {
      router.push(`/blog?tags=${[...selectedTags, tag.slug]}`)
    }
  }

  const removeTag = tag => {
    if (selectedTags.length === 1) {
      resetTags()
    } else {
      router.push(`/blog?tags=${selectedTags.filter(t => t !== tag)}`)
    }
  }

  const resetTags = () => {
    router.push('/blog')
  }

  return (
    <div className='tags-container fr-px-3w fr-px-md-6w'>
      <h2 className='fr-h6 fr-m-0'>Filtrer par tags</h2>

      <div className='tags-list'>
        {tagsList.map(tag => (
          <button
            key={tag.slug}
            type='button'
            className={`fr-tag ${selectedTags.includes(tag.slug) ? 'selected' : ''}`}
            onClick={() => addTag(tag)}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <div className='tags-list'>
        {selectedTags.map(tag => (
          <button
            key={tag}
            type='button'
            className='fr-tag fr-icon-close-line fr-tag--icon-left'
            onClick={() => removeTag(tag)}
          >
            {capitalizeFirstLetter(tag)}
          </button>
        ))}
      </div>

      <style jsx>{`
        .tags-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 1em;
        }

        .tags-list {
          display: flex;
          gap: 10px;
        }

        .selected {
          opacity: 50%;
        }
      `}</style>
    </div>
  )
}

BlogTags.propTypes = {
  selectedTags: PropTypes.array.isRequired,
  tagsList: PropTypes.array.isRequired
}

export default BlogTags
