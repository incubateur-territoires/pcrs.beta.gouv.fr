import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import Progression from '@/components/map-sidebar/progression.js'
import Header from '@/components/map-sidebar/project-header.js'
import PcrsInfos from '@/components/map-sidebar/pcrs-infos.js'
import Documents from '@/components/map-sidebar/documents.js'
import Contact from '@/components/map-sidebar/contact.js'
import Button from '@/components/button.js'

const API_URL = process.env.NEXT_PUBLIC_URL || 'https://pcrs.beta.gouv.fr'

const MapSidebar = ({projet, onClose, onProjetChange = null, projets = null, resetProjet}) => {
  const router = useRouter()

  const {
    nom,
    territoires,
    _id,
    etapes,
    source,
    subventions,
    reutilisations,
    documentation,
    contrat,
    nature,
    regime,
    livrables,
    licence,
    acteurs
  } = projet

  const contactAPLC = acteurs.find(acteur => acteur.role === 'aplc' || 'porteur')

  return (
    <>
      <Header
        projets={projets}
        projectId={_id}
        projectName={nom}
        territoires={territoires}
        resetProjet={resetProjet}
        onSidebarClose={onClose}
        onProjetChange={onProjetChange}
      />
      <div className='infos-container'>
        <h2 className='fr-text--lead fr-mb-1w'>État d’avancement</h2>
        <Progression etapes={etapes} />

        <h2 className='fr-text--lead fr-my-0'>Détails du projet</h2>
        <PcrsInfos
          nature={nature}
          regime={regime}
          livrables={livrables}
          licence={licence}
          acteurs={acteurs}
          subventions={subventions || []}
          reutilisations={reutilisations || []}
        />

        <h2 className='fr-text--lead fr-mt-3w'>Sources et documentations</h2>
        <Documents
          source={source}
          documentation={documentation || 'https://docs.pcrs.beta.gouv.fr'}
          contract={contrat}
        />

        <h2 className='fr-text--lead fr-mt-3w'>Contact</h2>
        <Contact
          name={contactAPLC?.nom}
          phone={contactAPLC?.telephone}
          mail={contactAPLC?.mail}
        />

        <div className='fr-mt-5w'>
          <Button
            label='Consulter le projet'
            size='sm'
            icon='arrow-right-line'
            onClick={() => router.push(`${API_URL}/projet/${_id}`)}
          >
            Consulter le projet
          </Button>
        </div>
      </div>

      <style jsx>{`
        .infos-container {
          padding: 1em;
          background-color: #ffffff;
        }
      `}</style>
    </>
  )
}

MapSidebar.propTypes = {
  projet: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  projets: PropTypes.array,
  resetProjet: PropTypes.func.isRequired,
  onProjetChange: PropTypes.func
}

export default MapSidebar

