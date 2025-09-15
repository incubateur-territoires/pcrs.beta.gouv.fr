import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const Loader = ({type = 'spinner', size = 'regular', speed = 2}) => {
  if (type === 'spinner') {
    return (
      <div className='spinner'>
        <style jsx>{`
          .spinner {
            display: inline-block;
            width: ${size === 'regular' ? '50' : '35'}px;
            height: ${size === 'regular' ? '50' : '35'}px;
            border: 3px solid ${colors.info425};
            border-radius: 50%;
            border-top-color: ${colors.blueFrance975};
            animation: spin ${speed}s ease-in-out infinite;
            z-index: 1;
          }

          @keyframes spin {
            to { -webkit-transform: rotate(360deg); }
          }
          @-webkit-keyframes spin {
            to { -webkit-transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className='pulse'>
      <style jsx>{`
        .pulse {
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
          width: ${size === 'regular' ? '50' : '35'}px;
          height: ${size === 'regular' ? '50' : '35'}px;
          transform: scale(1);
          background: rgba(0, 91, 192, 1);
          box-shadow: 0 0 0 0 rgba(0, 91, 192, 0.1);
          animation: pulse-red ${speed}s infinite;
        }


        @keyframes pulse-red {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 91, 192, 0.7);
          }

          50% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
          }
        }
      `}</style>
    </div>
  )
}

Loader.propTypes = {
  type: PropTypes.oneOf([
    'spinner',
    'pulse'
  ]),
  size: PropTypes.oneOf([
    'small',
    'regular'
  ]),
  speed: PropTypes.number
}

export default Loader
