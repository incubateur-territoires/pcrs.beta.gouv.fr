import PropTypes from 'prop-types'

const Tab = ({
  activeTab = null,
  tabs,
  icon = null,
  children = null,
  handleActiveTab
}) => (
  <div>
    <div className='fr-tabs'>
      <ul className='fr-tabs__list' role='tablist'>
        {tabs.map((tab, index) => {
          const defaultTab = !activeTab && index === 0

          return (
            <li key={tab.label} role='presentation'>
              <button
                disabled={tab?.isDisabled}
                type='button'
                className={`fr-tabs__tab ${icon ? `fr-icon-${icon}` : ''} fr-tabs__tab--icon-left`}
                role='tab'
                aria-selected={defaultTab || activeTab === tab.value}
                onClick={() => handleActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>

    <div className='content-wrapper fr-p-3w' role='tabpanel'>
      {children}
    </div>

    <style jsx>{`
      .content-wrapper {
        border: 1px solid #dddddd;
        border-top: none;
       }
    `}</style>
  </div>
)

Tab.propTypes = {
  activeTab: PropTypes.string,
  icon: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool
  })).isRequired,
  handleActiveTab: PropTypes.func.isRequired,
  children: PropTypes.node
}

export default Tab
