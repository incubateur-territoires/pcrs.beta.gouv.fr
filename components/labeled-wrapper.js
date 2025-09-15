import PropTypes from 'prop-types'

const LabeledWrapper = ({label, children = null, ...props}) => (
  <div {...props}>
    <div className='label'>{label}</div>
    {children}

    <style jsx>{`
      .label {
          font-weight: bold;
        }
    `}</style>
  </div>
)

LabeledWrapper.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default LabeledWrapper

