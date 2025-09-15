import {useState, useMemo} from 'react'
import PropTypes from 'prop-types'

const ListSlicer = ({list = [], max = 5, itemId, renderListItem = () => {}}) => {
  const [listSize, setListSize] = useState(max)

  const truncatedList = useMemo(() => list.slice(0, listSize), [list, listSize])

  const toggleFullList = () => {
    setListSize(prevSize => (prevSize === max ? list.length : max))
  }

  const buttonText
    = listSize === max ? '...Afficher la liste complète' : '...Masquer la liste'

  if (list.length === 0) {
    return (
      <>
        <div className='fr-text--sm empty'>Aucun élément disponible à afficher</div>

        <style jsx>{`
          .empty {
            font-style: italic;
          }
        `}</style>
      </>
    )
  }

  return (
    <div>
      <ul className='fr-pl-0'>
        {truncatedList.map(item => (
          <li key={item[itemId]}>{renderListItem ? renderListItem(item) : item}</li>
        ))}
      </ul>
      <div className='fr-text--sm show-hide-toggle' onClick={toggleFullList}>
        {list.length > max && buttonText}
      </div>

      <style jsx>{`
        .show-hide-toggle {
          font-style: italic;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

ListSlicer.propTypes = {
  list: PropTypes.array,
  max: PropTypes.number,
  itemId: PropTypes.string.isRequired,
  renderListItem: PropTypes.func
}

export default ListSlicer
