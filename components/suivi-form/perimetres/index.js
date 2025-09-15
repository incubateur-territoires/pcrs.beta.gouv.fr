import PropTypes from 'prop-types'

import {useState} from 'react'
import colors from '@/styles/colors.js'

import Perimetre from '@/components/suivi-form/perimetres/perimetre.js'
import PerimetreForm from '@/components/suivi-form/perimetres/perimetre-form.js'
import Button from '@/components/button.js'

const Perimetres = ({
  perimetres,
  hasMissingData = false,
  handlePerimetres,
  projetPerimetreMillesime = null,
  setMillesime = () => {}
}) => {
  const hasPerimetres = perimetres.length > 0
  const [perimetre, setPerimetre] = useState(hasPerimetres ? null : {})
  const MILLESIME = process.env.NEXT_PUBLIC_MILLESIME

  const handlePerimetre = ({type, code}) => {
    handlePerimetres([...perimetres, `${type}:${code}`])
    setPerimetre(null)
    if (MILLESIME && projetPerimetreMillesime !== MILLESIME) {
      setMillesime(MILLESIME)
    }
  }

  const onDelete = index => {
    handlePerimetres(current => current.filter((_, i) => index !== i))
    if (MILLESIME && projetPerimetreMillesime !== MILLESIME) {
      setMillesime(MILLESIME)
    }
  }

  return (
    <div className='fr-mt-8w'>
      <h3 className='fr-h5 fr-m-0'>Périmètres *</h3>
      <hr className='fr-my-3w' />

      <div className='fr-notice fr-notice--info'>
        <div className='fr-mx-2w fr-notice__body'>
          <p>les référentiels INSEE les plus à jour qui ne tiennent pas compte des territoires fusionnés il y a plus d’un an </p>
        </div>
      </div>

      {(hasMissingData && perimetres.length === 0) && (
        <div className='fr-error-text fr-mt-1w'>Au moins un périmètre doit être ajouté</div>
      )}

      <div className='fr-grid-row fr-mt-2w'>
        {perimetres.map((perimetre, index) => {
          const [type, code] = perimetre.split(':')
          return (
            <Perimetre
              key={perimetre}
              type={type}
              code={code}
              handleDelete={() => onDelete(index)}
            />
          )
        })}
      </div>

      {hasPerimetres && (
        <hr className='edit-separator fr-my-3w' />
      )}

      {perimetre || !hasPerimetres ? (
        <PerimetreForm
          perimetres={perimetres}
          onCancel={hasPerimetres ? () => setPerimetre(null) : null}
          onSubmit={handlePerimetre}
        />
      ) : (
        <div className='fr-mt-3w'>
          <Button
            label='Ajouter un périmètre'
            icon='add-circle-fill'
            iconSide='left'
            onClick={() => setPerimetre({})}
          >
            Ajouter un périmètre
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

Perimetres.propTypes = {
  perimetres: PropTypes.array.isRequired,
  hasMissingData: PropTypes.bool,
  handlePerimetres: PropTypes.func.isRequired,
  projetPerimetreMillesime: PropTypes.string,
  setMillesime: PropTypes.func
}

export default Perimetres
