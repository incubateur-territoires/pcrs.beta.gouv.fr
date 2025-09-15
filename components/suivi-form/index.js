import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/legacy/image'
import {useRouter} from 'next/router'
import {uniq} from 'lodash-es'

import colors from '@/styles/colors.js'

import {postSuivi, editProject, refreshScan} from '@/lib/suivi-pcrs.js'

import {useInput} from '@/hooks/input.js'

import AuthentificationModal from '@/components/suivi-form/authentification/authentification-modal.js'
import GeneralInfos from '@/components/suivi-form/general-infos.js'
import Livrables from '@/components/suivi-form/livrables/index.js'
import Acteurs from '@/components/suivi-form/acteurs/index.js'
import Perimetres from '@/components/suivi-form/perimetres/index.js'
import Etapes from '@/components/suivi-form/etapes.js'
import Subventions from '@/components/suivi-form/subventions/index.js'
import Reutilisations from '@/components/suivi-form/reutilisations/index.js'
import ShareModal from '@/components/suivi-form/share-modal.js'
import DeleteModal from '@/components/suivi-form/delete-modal.js'
import Button from '@/components/button.js'
import BackToProjectButton from '@/components/ui/back-to-project-button.js'

const SuiviForm = ({
  nom = '',
  nature = '',
  regime = '',
  budget = null,
  livrables = [],
  acteurs = [],
  perimetres = [],
  etapes = [{statut: 'investigation', date_debut: ''}], // eslint-disable-line camelcase
  subventions = [],
  reutilisations = [],
  metaPerimetreMillesime = null,
  _id = null,
  token = null,
  userRole = null,
  projectEditCode = null,
  isTokenRecovering
}) => {
  const router = useRouter()

  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [hasMissingItemsOnValidation, setHasMissingItemsOnValidation] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errors, setErrors] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [editedProjectId, setEditedProjectId] = useState(null)
  const [editCode, setEditCode] = useState(projectEditCode)

  const [suiviNom, setSuiviNom] = useInput({initialValue: nom})
  const [suiviNature, setSuiviNature] = useInput({initialValue: nature})
  const [suiviRegime, setSuiviRegime] = useInput({initialValue: regime})
  const [suiviBudget, setSuiviBudget] = useInput({initialValue: budget})

  const [projetLivrables, setProjetLivrables] = useState(livrables)
  const [projetActeurs, setProjetActeurs] = useState(acteurs)
  const [projetPerimetres, setProjetPerimetres] = useState(perimetres)
  const [projetEtapes, setProjetEtapes] = useState(etapes)
  const [projetSubventions, setProjetSubventions] = useState(subventions || [])
  const [projetReutilisations, setProjetReutilisations] = useState(reutilisations || [])
  const [projetPerimetreMillesime, setProjetPerimetreMillesime] = useState(metaPerimetreMillesime)

  const hasMissingRequiredItems = projetLivrables.length === 0 || projetPerimetres.length === 0
  const isPorteurMissing = Boolean(!projetActeurs.some(acteur => acteur.role === 'aplc' || acteur.role === 'porteur'))
  // L'étape "disponible" ne peut être ajoutée que lorsque qu'un stockage est téléchargeable
  const canBeDisponible = Boolean(projetLivrables.some(l => (l.stockage_params?.url_externe || projetLivrables.some(l => l.stockage_telechargement))))

  const MILLESIME = process.env.NEXT_PUBLIC_MILLESIME

  const handleDeleteModalOpen = () => setIsDeleteModalOpen(!isDeleteModalOpen)

  useEffect(() => {
    if (!hasMissingRequiredItems) {
      setErrorMessage(null)
    }
  }, [hasMissingRequiredItems])

  const handleAuthentificationModal = () => router.push('/suivi-pcrs')
  const handleModal = () => router.push('/suivi-pcrs')

  const handleSubmitError = error => {
    if (error.code === 400) {
      const errorsMessages = error.validationErrors.map(error => {
        const {message} = error
        const section = error.path[0]

        return `${section} - ${message}`
      })
      setErrors(uniq(errorsMessages))
      setErrorMessage('Le projet n’a pas pu être pris en compte car il y a des erreurs :')
    } else {
      setErrorMessage(error.message)
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()

    setValidationMessage(null)
    setErrorMessage(null)
    setHasMissingItemsOnValidation(false)

    const handleScrollToError = () => {
      const firstErrorSection = projetLivrables.length === 0 ? 'livrables' : (projetActeurs.length === 0 ? 'acteurs' : 'perimetres')
      const input = document.querySelector(`#${firstErrorSection}`)

      input.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }

    try {
      if (hasMissingRequiredItems) {
        setHasMissingItemsOnValidation(true)
        handleScrollToError()
        setErrorMessage('Des données nécessaires à la validation du formulaires sont manquantes. Au moins un livrable, un acteur et un périmètre doivent être ajoutés.')
      } else if (isPorteurMissing) {
        setHasMissingItemsOnValidation(true)
        setErrorMessage('Au moins un acteur doit être ajouté et avoir le rôle de porteur de projet.')
      } else {
        const suivi = {
          nom: suiviNom,
          regime: suiviRegime,
          nature: suiviNature,
          budget: suiviBudget ? Number(suiviBudget) : null,
          livrables: projetLivrables,
          acteurs: projetActeurs,
          perimetres: projetPerimetres,
          etapes: projetEtapes,
          subventions: projetSubventions,
          reutilisations: projetReutilisations,
          metaPerimetreMillesime: projetPerimetreMillesime
        }

        const authorizationCode = editCode || token
        const {data, error} = _id ? await editProject(suivi, _id, authorizationCode) : await postSuivi(suivi, token)

        if (error) {
          handleSubmitError(error)
        } else if (userRole === 'admin' || _id) {
          router.push(`/projet/${data._id}`)
        } else {
          setEditedProjectId(data._id)
          setEditCode(data.editorKey)
          setIsShareModalOpen(true)
        }
      }
    } catch {
      const errorMessage = _id ? 'Une erreur a eu lieu lors de la modification du suivi' : 'Une erreur a eu lieu lors de la création du suivi'

      setErrorMessage(errorMessage)
    }
  }

  const handleRefreshScan = async stockageId => {
    try {
      await refreshScan(_id, stockageId, editCode)
    } catch (error) {
      throw new Error('La scan n’a pas pu être relancé : ' + error.message)
    }
  }

  return (
    <>
      <div className='form-header fr-my-5w'>
        <Image
          src='/images/illustrations/form_illustration.svg'
          height={200}
          width={200}
          alt=''
          aria-hidden='true'
        />
        <h2 className='fr-mt-5w fr-mb-0'>Formulaire de suivi PCRS</h2>
      </div>
      <div className='fr-p-5w'>
        {(!token && !isTokenRecovering && !editCode) && <AuthentificationModal handleModalClose={handleAuthentificationModal} />}

        <div className='fr-grid-row fr-col-12'>
          <div className='fr-grid-row fr-grid-row--left fr-col-12 fr-col-md-10'>
            <BackToProjectButton projetId={_id} />
          </div>

          {_id && (
            <div className='fr-grid-row fr-grid-row--left fr-col-12 fr-col-md-2 fr-mt-3w fr-mt-md-0'>
              <button
                type='button'
                aria-label='Supprimer le projet'
                icon='delete-line'
                className='delete-button'
                onClick={handleDeleteModalOpen}
              >
                <span className='fr-icon-delete-fill fr-icon--sm fr-mr-1w' aria-hidden='true' />Supprimer le projet
              </button>
            </div>
          )}
        </div>

        {MILLESIME && projetPerimetreMillesime && projetPerimetreMillesime !== MILLESIME && (
          <div className='fr-alert fr-alert--warning fr-my-3w'>
            <h3 className='fr-alert__title'>Vérification nécessaire des périmètres administratifs</h3>
            <p>Le périmètre du projet est actuellement défini avec les contours administratifs <b>{metaPerimetreMillesime}</b>.</p>
            <p>Nous utilisons désormais le millésime <b>{MILLESIME}</b>, nous vous invitons à vérifier les territoires utilisés pour éviter toute incohérence.</p>
            <div className='fr-grid-row fr-grid-row--right fr-mt-3w'>
              <button
                type='button'
                icon='checkbox-circle'
                className='warning-button'
                onClick={() => setProjetPerimetreMillesime(MILLESIME)}
              >
                <span>J’ai vérifié les territoires, fermer ce message</span>
                <span className='fr-icon-checkbox-circle-fill fr-icon--sm fr-ml-1w' aria-hidden='true' />
              </button>
            </div>
          </div>
        )}

        <p className='required-disclaimer fr-mt-3w'>Les champs indiqués par une * sont obligatoires</p>

        <form className='fr-mt-5w' onSubmit={handleSubmit}>
          <GeneralInfos
            inputValues={{
              nom: suiviNom,
              nature: suiviNature,
              regime: suiviRegime,
              budget: suiviBudget
            }}
            handleNom={setSuiviNom}
            handleRegime={setSuiviRegime}
            handleNature={setSuiviNature}
            handleBudget={setSuiviBudget}
          />

          <div id='livrables'>
            <Livrables
              livrables={projetLivrables}
              handleLivrables={setProjetLivrables}
              hasMissingData={hasMissingItemsOnValidation}
              handleRefreshScan={handleRefreshScan}
            />
          </div>

          <div id='acteurs'>
            <Acteurs
              acteurs={projetActeurs}
              handleActors={setProjetActeurs}
            />
          </div>

          <div id='perimetres'>
            <Perimetres
              perimetres={projetPerimetres}
              handlePerimetres={setProjetPerimetres}
              hasMissingData={hasMissingItemsOnValidation}
              projetPerimetreMillesime={projetPerimetreMillesime}
              setMillesime={setProjetPerimetreMillesime}
            />
          </div>

          <Etapes
            etapes={projetEtapes}
            handleEtapes={setProjetEtapes}
            initialValue={projetEtapes.at(-1)}
            canBeDisponible={canBeDisponible}
          />

          <Subventions
            subventions={projetSubventions}
            handleSubventions={setProjetSubventions}
          />

          <Reutilisations
            projectId={_id || null}
            editCode={editCode || token}
            reutilisations={projetReutilisations}
            handleReutilisations={setProjetReutilisations}
          />

          <div className='fr-grid-row fr-grid-row--center  fr-grid-row--gutters fr-mt-2w'>
            <div className='fr-grid-row fr-mt-12w fr-col-12'>
              <div className='fr-grid-row fr-col-12'>
                <div className='fr-grid-row fr-grid-row--left fr-col-12 fr-col-md-10'>
                  <BackToProjectButton projetId={_id} />
                </div>

                {_id && (
                  <div className='fr-grid-row fr-grid-row--left fr-col-12 fr-col-md-2 fr-mt-3w fr-mt-md-0'>
                    <button
                      type='button'
                      aria-label='Supprimer le projet'
                      icon='delete-line'
                      className='delete-button'
                      onClick={handleDeleteModalOpen}
                    >
                      <span className='fr-icon-delete-fill fr-icon--sm fr-mr-1w' aria-hidden='true' />Supprimer le projet
                    </button>
                  </div>
                )}
              </div>

              <div className='fr-grid-row fr-grid-row--center fr-mt-10w fr-col-12'>
                <Button
                  label='Valider le formulaire'
                  icon='checkbox-circle-fill'
                  iconSide='right'
                  type='submit'
                  size='lg'
                >
                  Valider le formulaire
                </Button>
              </div>
            </div>

            {isDeleteModalOpen && (
              <DeleteModal
                nom={nom}
                id={_id}
                authorizationCode={editCode}
                handleDeleteModalOpen={handleDeleteModalOpen}
              />
            )}

            {validationMessage && (
              <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-col-md-6 fr-mb-0'>
                {validationMessage}
              </p>
            )}

            {errorMessage && (
              <div>
                <p className='fr-grid-row--center fr-error-text fr-text--sm fr-col-12 fr-mt-2w fr-mb-0'>
                  {errorMessage}
                </p>

                <ul className='fr-mt-2w'>
                  {errors.map(error => <li key={error} className='fr-text--sm error-list fr-m-0'>{error}</li>)}
                </ul>
              </div>
            )}
          </div>
        </form>
      </div>

      {isShareModalOpen && userRole !== 'admin' && (
        <ShareModal
          handleModal={handleModal}
          validationMessage={validationMessage}
          projectId={editedProjectId}
          editCode={editCode}
        />
      )}

      <style jsx>{`
        .form-header {
          text-align: center;
        }

        .required-disclaimer {
          font-style: italic;
        }

        .delete-button {
          color: ${colors.redMarianne425};
          font-weight: bold;
          border: 1px solid ${colors.redMarianne425};
        }

        .warning-button {
          color: ${colors.warningMain525};
          font-weight: bold;
          padding: 5px 10px;
          border: 1px solid ${colors.warningMain525};
        }

        .error-list {
          color: ${colors.error425};
          list-style-type: disc;
        }
      `}</style>
    </>
  )
}

SuiviForm.propTypes = {
  userRole: PropTypes.string,
  nom: PropTypes.string,
  nature: PropTypes.string,
  budget: PropTypes.number,
  regime: PropTypes.string,
  livrables: PropTypes.array,
  acteurs: PropTypes.array,
  perimetres: PropTypes.array,
  etapes: PropTypes.array,
  subventions: PropTypes.array,
  reutilisations: PropTypes.array,
  _id: PropTypes.string,
  token: PropTypes.string,
  projectEditCode: PropTypes.string,
  metaPerimetreMillesime: PropTypes.string,
  isTokenRecovering: PropTypes.bool.isRequired
}

export default SuiviForm
