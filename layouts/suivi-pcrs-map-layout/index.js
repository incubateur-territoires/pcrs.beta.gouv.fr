import {useContext, useMemo} from 'react'
import PropTypes from 'prop-types'

import Mobile from '@/layouts/suivi-pcrs-map-layout/mobile.js'
import Desktop from '@/layouts/suivi-pcrs-map-layout/desktop.js'
import DeviceContext from '@/contexts/device.js'

import Map from '@/components/map/index.js'
import MapSidebar from '@/components/map-sidebar/index.js'

const SuiviPCRSMapLayout = ({...props}) => {
  const {projet = null, projets, onProjetChange, resetProjet, setIsOpen, handleNewProject, selectProjets, geometry} = props
  const {isMobileDevice} = useContext(DeviceContext)

  const Layout = useMemo(() => isMobileDevice ? Mobile : Desktop, [isMobileDevice])

  const sidebar = projet ? (
    <MapSidebar
      projet={projet}
      projets={projets}
      resetProjet={resetProjet}
      onProjetChange={onProjetChange}
      onClose={() => setIsOpen(false)}
    />
  ) : null

  const map = (
    <Map
      isMobile={isMobileDevice}
      projetId={projet?._id}
      geometry={geometry}
      handleNewProject={handleNewProject}
      handleSelectProjets={selectProjets}
    />
  )

  return (
    <Layout
      {...props}
      sidebar={sidebar}
      map={map}
    />
  )
}

SuiviPCRSMapLayout.propTypes = {
  geometry: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  projet: PropTypes.object,
  projets: PropTypes.array,
  setIsOpen: PropTypes.func,
  handleNewProject: PropTypes.func.isRequired,
  resetProjet: PropTypes.func.isRequired,
  onProjetChange: PropTypes.func.isRequired,
  selectProjets: PropTypes.func.isRequired
}

export default SuiviPCRSMapLayout
