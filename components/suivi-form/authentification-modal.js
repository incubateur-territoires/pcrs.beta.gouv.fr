import {useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import TextInput from '@/components/text-input.js'
import Modal from '@/components/modal.js'
import Button from '@/components/button.js'

const AuthentificationModal = ({isNewForm, handleModal, handleToken}) => {
  const router = useRouter()

  const [tokenInput, setTokenInput] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [validationMessage, setValidationMessage] = useState(null)

  const handleAuthentification = async e => {
    e.preventDefault()
    setErrorMessage(null)

    if (tokenInput) {
      try {
        handleToken(tokenInput)

        if (isNewForm) {
          setValidationMessage('Jeton valide ! Vous allez être redirigé...')

          setTimeout(() => {
            router.push('/formulaire-suivi')
          }, 3000)
        }
      } catch {
        setErrorMessage('L’authentification a échouée. Veuillez entrer un jeton valide')
      }
    } else {
      setErrorMessage('Veuillez entrer un jeton')
    }
  }

  return (
    <Modal title='S’authentifier' onClose={handleModal}>
      <div>
        <p>Afin de vérifier vos droit en tant qu’administrateur, nous devons procéder à la vérification de votre jeton d’authentification.<br /><br />
          Une fois authentifié, vous serez en mesure d’accéder au formulaire de suivi du PCRS
        </p>
        <div className='fr-alert fr-alert--info fr-alert--sm'>
          <p>Vous rencontrer un problème ? Contacter nous à <a href='mailto:contact@pcrs.beta.gouv.fr'>contact@pcrs.beta.gouv.fr</a></p>
        </div>

        <div className='fr-container fr-mt-6w fr-grid-row fr-grid-row--center'>
          <form onSubmit={handleAuthentification}>
            <div className='fr-col-12'>
              <TextInput
                label='Authentification'
                errorMessage={errorMessage}
                type='password'
                value={tokenInput}
                ariaLabel='Entrer le jeton d’authentification'
                description='Entrez votre jeton d’authentification'
                onValueChange={e => setTokenInput(e.target.value)}
              />
            </div>
            <div className='fr-col-12 fr-grid-row fr-grid-row--center fr-mt-3w'>
              <Button
                type='submit'
                label='S’authentifier'
              >
                S’authentifier
              </Button>
            </div>
          </form>
        </div>
        {validationMessage && (
          <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-mt-2w fr-mb-0'>
            {validationMessage}
          </p>
        )}
      </div>
    </Modal>
  )
}

AuthentificationModal.propTypes = {
  isNewForm: PropTypes.bool,
  handleModal: PropTypes.func.isRequired,
  handleToken: PropTypes.func
}

AuthentificationModal.defaultProps = {
  isNewForm: false,
  handleToken() {}
}

export default AuthentificationModal
