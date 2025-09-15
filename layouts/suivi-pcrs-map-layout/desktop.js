import PropTypes from 'prop-types'
import OpenDataMessage from '@/components/ui/open-data-message.js'

const SIDEBAR_WIDTH = 460
const HEADER_HEIGHT = 117

const Desktop = ({projet = null, isOpen, setIsOpen = () => {}, sidebar = null, map}) => {
  const sidebarWidth = isOpen ? `${SIDEBAR_WIDTH}px` : '5px'
  return (
    <div className='desktop-layout-container'>
      {projet && (
        <div className='desktop-sidebar-container'>
          {isOpen ? sidebar : null}
          <button
            type='button'
            className={`fr-icon-arrow-${isOpen ? 'left' : 'right'}-s-line sidebar-toggle-button`}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      )}

      <div className='map-container'>
        <OpenDataMessage />
        {map}
      </div>

      <style jsx>{`
        .desktop-layout-container {
          position: relative;
          display: flex;
          height: 100%;
        }

        .desktop-sidebar-container {
          min-width: ${sidebarWidth};
          max-width: ${SIDEBAR_WIDTH}px;
          box-shadow: 0px 0px 5px grey;
          height: calc(100vh - ${HEADER_HEIGHT}px);
          overflow-x: hidden;
        }

        .sidebar-toggle-button {
          position: absolute;
          top: 45px;
          left: ${sidebarWidth};
          background-color: white;
          height: 50px;
          width: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 0 5px 5px 0;
          box-shadow: 2px 2px 5px grey;
          z-index: 3;
        }

        .map-container {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
      `}</style>
    </div>
  )
}

Desktop.propTypes = {
  map: PropTypes.node.isRequired,
  sidebar: PropTypes.node,
  setIsOpen: PropTypes.func,
  projet: PropTypes.object,
  isOpen: PropTypes.bool.isRequired
}

export default Desktop
