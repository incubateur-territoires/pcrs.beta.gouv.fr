/* eslint-disable unicorn/prefer-global-this */
import {useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import Link from 'next/link'

import {deleteSuivi} from '@/lib/suivi-pcrs.js'

import colors from '@/styles/colors.js'

import Button from '@/components/button.js'
import Modal from '@/components/modal.js'

const DeleteModal = ({nom, id, authorizationCode, isSidebar = false, handleDeleteModalOpen}) => {
  const router = useRouter()

  const [validationMessage, setValidationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const onDelete = async () => {
    setValidationMessage(null)
    setErrorMessage(null)

    try {
      await deleteSuivi(id, authorizationCode)

      setValidationMessage('le projet a bien été supprimé')
      setTimeout(() => {
        if (isSidebar) {
          router.reload(window.location.pathname)
        } else {
          router.push('/suivi-pcrs')
        }
      }, 2000)
    } catch {
      setErrorMessage('Impossible de supprimer ce projet')
    }
  }

  return (
    <Modal title='Confirmer la suppression du projet' onClose={handleDeleteModalOpen}>
      <div className='modal-content fr-mt-5w'>
        <p className='fr-text--lg'>Êtes-vous bien sûr de vouloir supprimer le suivi de <b>{nom}</b> ?</p><br />
        <div className='fr-alert fr-alert--info fr-alert--sm fr-mb-3w'>
          <p>
            Nous souhaitons <b>conserver les projets obsolètes</b> dans notre base de données. Etes-vous <b>certain</b> de supprimer un projet n’ayant jamais produit de livrables ou erronés ?
          </p>
          <p className='fr-pt-1w'>
            <i>Apprenez-en plus sur les pratiques de description des projets dans <Link href='https://docs.pcrs.beta.gouv.fr/suivi-des-projets/edition-des-donnees'>la documentation !</Link></i>
          </p>
        </div>
        <div className='fr-alert fr-alert--warning fr-alert--sm fr-mb-3w'>
          <b className='irreversible-alert'>Cette action est irréversible</b>
        </div>

        <div className='fr-grid-row fr-grid-row--center'>
          <Button
            label='Confirmer la suppression'
            isDisabled={Boolean(validationMessage)}
            onClick={() => onDelete()}
          >
            Supprimer le projet
          </Button>
        </div>
        {validationMessage && (
          <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-mt-2w fr-mb-0'>
            {validationMessage}
          </p>
        )}

        {errorMessage && (
          <p className='fr-grid-row fr-grid-row--center fr-error-text fr-col-12 fr-mt-2w fr-mb-0'>
            {errorMessage}
          </p>
        )}
      </div>

      <style jsx>{`
        .modal-content {
          text-align: center;
        }

        .irreversible-alert {
          color: ${colors.warningMain525};
        }
      `}</style>
    </Modal>
  )
}

DeleteModal.propTypes = {
  nom: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  authorizationCode: PropTypes.string.isRequired,
  handleDeleteModalOpen: PropTypes.func.isRequired,
  isSidebar: PropTypes.bool
}

export default DeleteModal
