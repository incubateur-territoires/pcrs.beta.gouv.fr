import {useState} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash-es'

import StockagePreview from './stockage-preview.js'
import {LIVRABLE_NATURES} from '@/lib/utils/projet.js'

import {livrableRenderItem} from '@/components/projet/list-render-items.js'
import SelectInput from '@/components/select-input.js'

const LivrablesSection = ({projectId, livrables}) => {
  const [selectedLivrable, setSelectedLivrable] = useState(livrables.length > 0 ? livrables[0] : null)

  const orderedLivrablesByPublication = sortBy(livrables, livrable =>
    livrable.date_livraison ? new Date(livrable.date_livraison) : 0
  )

  const livrablesOptions = orderedLivrablesByPublication.map(item => ({
    label: `${item.nom} - ${LIVRABLE_NATURES[item.nature].label}`,
    value: item.nom
  }))

  const handleSelectedLivrable = event => {
    const {value} = event.target
    const selectedLivrable = livrables.find(({nom}) => nom === value)
    setSelectedLivrable(selectedLivrable)
  }

  return (
    <div>
      <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Livrables : {livrables.length}</h3>
      <div>
        <SelectInput
          value={selectedLivrable.nom}
          label={selectedLivrable.nom}
          options={livrablesOptions}
          isDisabled={livrables.length === 1}
          onValueChange={handleSelectedLivrable}
        />

        <div>
          {livrableRenderItem(selectedLivrable)}

          {selectedLivrable.stockage && selectedLivrable.stockage_id && (
            <div className='stockage-preview'>
              <StockagePreview
                projectId={projectId}
                stockageId={selectedLivrable.stockage_id}
                isStockagePublic={selectedLivrable.stockage_public}
                isDownloadable={selectedLivrable.stockage_telechargement}
                params={selectedLivrable.stockage_params}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .stockage-preview {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}

LivrablesSection.propTypes = {
  projectId: PropTypes.string.isRequired,
  livrables: PropTypes.array.isRequired
}

export default LivrablesSection
