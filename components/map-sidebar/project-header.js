import {useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import colors from '@/styles/colors.js'

import HiddenInfos from '@/components/hidden-infos.js'
import Button from '@/components/button.js'

const API_URL = process.env.NEXT_PUBLIC_URL || 'https://pcrs.beta.gouv.fr'

const Header = ({
  projectId,
  projectName,
  resetProjet,
  territoires = [],
  projets = null,
  onProjetChange = null
}) => {
  const router = useRouter()
  const [isTerritoiresShow, setIsTerritoiresShow] = useState(false)

  const hasToMuchTerritoires = territoires.length >= 4

  return (
    <div className='header'>
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <h1 className='fr-h4 fr-my-2w'>{projectName}</h1>
          <div>
            <button
              type='button'
              className='fr-btn fr-icon-close-circle-line fr-btn--tertiary-no-outline'
              onClick={resetProjet}
            />
          </div>
        </div>
        <div className='fr-mb-3w'>
          <Button
            isWhite
            label='Consulter le projet'
            icon='arrow-right-line'
            buttonStyle='secondary'
            onClick={() => router.push(`${API_URL}/projet/${projectId}`)}
          >
            Consulter le projet
          </Button>
        </div>
      </div>

      <div className='fr-text--lg fr-my-0 list-title'>Liste des territoires</div>
      {hasToMuchTerritoires ? (
      // More than 5 territoires
        <div>
          {isTerritoiresShow ? (
          // Display complete territoires list
            <HiddenInfos theme='secondary' onClose={() => setIsTerritoiresShow(false)}>
              {territoires.map((territoire, idx) => (
                <span key={territoire.nom} className='fr-text--sm'>
                  {territoire.nom} {idx === territoires.length - 1 ? '' : ' - '}
                </span>
              ))}
            </HiddenInfos>
          ) : (
          // Display shorten list
            <>
              {territoires.slice(0, 4).map((territoire, idx) => (
                <span key={territoire.nom}>{territoire.nom} {idx === 3 ? '' : ' - '}</span>
              ))}
              <button
                type='button'
                className='fr-btn--tertiary-no-outline'
                onClick={() => setIsTerritoiresShow(true)}
              >
                ...afficher la liste des territoires
              </button>
            </>
          )}
        </div>
      ) : (
      // Less than 5 territoires
        territoires.map((territoire, idx) => (
          <span key={territoire.nom}>
            {territoire.nom} {idx === territoires.length - 1 ? '' : ' - '}
          </span>
        ))
      )}
      {projets && projets.length > 1 && (
        <div className='fr-select-group fr-p-3v fr-mt-3w' style={{borderTop: '1px solid white'}}>
          <label className='fr-label' style={{color: 'white'}}>Sélectionnez un autre projet</label>
          <select
            className='fr-select'
            defaultValue={projets.find(p => p._id === projectId)?._id}
            onChange={onProjetChange}
          >
            {projets.map(projet => (
              <option key={projet.nom} value={projet._id}>{projet.nom}</option>
            ))}
          </select>
        </div>
      )}
      <style jsx>{`
        .header {
          padding: 1em;
        }

        .header, h1 {
          background: ${colors.info425};
          color: white;
        }

        .list-title {
          font-weight: bold;
        }

        .fr-btn--tertiary-no-outline {
          color: white;
          font-style: italic;
          text-decoration: underline;
        }

        .fr-btn--tertiary-no-outline:hover {
          color: ${colors.grey50};
        }
      `}</style>
    </div>
  )
}

Header.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  territoires: PropTypes.array,
  projets: PropTypes.array,
  resetProjet: PropTypes.func.isRequired,
  onProjetChange: PropTypes.func
}

export default Header
