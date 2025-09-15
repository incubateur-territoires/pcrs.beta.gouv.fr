import {useCallback, useState} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash-es'

import colors from '@/styles/colors.js'

import Button from '@/components/button.js'
import LivrableCard from '@/components/suivi-form/livrables/livrable-card.js'
import LivrableForm from '@/components/suivi-form/livrables/livrable-form.js'

const Livrables = ({
  livrables,
  hasMissingData = false,
  handleLivrables,
  handleRefreshScan = () => {}
}) => {
  const [editedLivrable, setEditedLivrable] = useState(livrables?.length > 0 ? null : {})

  const onDelete = index => {
    handleLivrables(current => current.filter((_, i) => index !== i))
    setEditedLivrable(null)
  }

  const handleLivrable = useCallback(livrable => {
    if (editedLivrable && editedLivrable.index >= 0) {
      handleLivrables(prevLivrables => {
        const livrablesCopy = [...prevLivrables]
        livrablesCopy[editedLivrable.index] = livrable
        return livrablesCopy
      })
    } else {
      handleLivrables([...livrables, livrable])
    }

    setEditedLivrable(null)
  }, [editedLivrable, livrables, handleLivrables])

  const isLivrableNameAvailable = useCallback(nom => {
    const _livrables = (editedLivrable?.index === undefined)
      ? livrables
      : livrables.filter((a, idx) => idx !== editedLivrable.index) // Filter livrable being edited
    return _livrables.some(livrable => nom === livrable.nom)
  }, [editedLivrable, livrables])

  return (
    <div className='fr-mt-8w fr-grid-row'>
      <h3 className='fr-h5 fr-m-0 fr-col-12'>Livrables *</h3>
      <hr className='fr-my-3w fr-col-12' />

      {(hasMissingData && livrables.length === 0) && (
        <div className='fr-error-text fr-mt-1w fr-col-12'>Au moins un livrable doit être ajouté</div>
      )}

      <div className='fr-grid-row fr-col-12'>
        {livrables.map((livrable, index) => (
          <div key={uniqueId()} className='fr-col-12 fr-mb-7w fr-p-0'>
            {editedLivrable && editedLivrable.index === index ? (
              <>
                <LivrableForm
                  initialValues={livrable}
                  isLivrableNameAvailable={isLivrableNameAvailable}
                  onCancel={() => setEditedLivrable(null)}
                  onSubmit={handleLivrable}
                />
                <div className='edit-separator fr-my-3w' />
              </>
            ) : (
              <LivrableCard
                livrable={livrable}
                isDisabled={Boolean(editedLivrable)}
                handleEdition={() => setEditedLivrable({livrable, index})}
                handleDelete={() => onDelete(index)}
                handleRefreshScan={handleRefreshScan}
              />
            )}
          </div>
        ))}
      </div>

      {(livrables.length === 0 || (editedLivrable && editedLivrable.index === undefined)) && (
        <LivrableForm
          initialValues={{}}
          isLivrableNameAvailable={isLivrableNameAvailable}
          onCancel={livrables.length > 0 ? () => setEditedLivrable(null) : null}
          onSubmit={handleLivrable}
        />
      )}

      {(!editedLivrable && livrables.length > 0) && (
        <div className='fr-mt-3w fr-col-12'>
          <Button
            label='Ajouter un livrable'
            icon='add-circle-fill'
            iconSide='left'
            onClick={() => setEditedLivrable({actor: {}})}
          >
            Ajouter un livrable
          </Button>
        </div>
      )}

      <style jsx>{`
        hr {
          border-top: 3px solid ${colors.grey850};
        }

        .edit-separator {
          border-top: 2px solid ${colors.blueFrance850};
        }
      `}</style>
    </div>
  )
}

Livrables.propTypes = {
  livrables: PropTypes.array.isRequired,
  hasMissingData: PropTypes.bool,
  handleLivrables: PropTypes.func.isRequired,
  handleRefreshScan: PropTypes.func
}

export default Livrables
