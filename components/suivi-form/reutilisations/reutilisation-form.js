import {useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {useInput} from '@/hooks/input.js'

import colors from '@/styles/colors.js'

import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const ReutilisationForm = ({initialValues, isReutilisationExists, editCode, projectId, onSubmit, onCancel}) => {
  const [file, setFile] = useState(null)
  const [imageURL, setImageURL] = useState(initialValues?.imageURL || null)
  const [imageKey, setImageKey] = useState(initialValues?.imageKey || null)
  const [message, setMessage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleLinkError = lien => (
    isReutilisationExists(lien)
      ? 'Cette réutilisation existe déjà'
      : null
  )

  const [titre, setTitre] = useInput({
    initialValue: initialValues?.titre,
    isRequired: true
  })

  const [description, setDescription] = useInput({
    initialValue: initialValues?.description,
    isRequired: false
  })

  const [lien, setLien] = useInput({
    initialValue: initialValues?.lien,
    checkValue: handleLinkError,
    isRequired: true
  })

  const isFormComplete = Boolean(titre && lien)

  const handleUpload = async () => {
    setMessage(null)
    setIsUploading(true)

    if (file.size > 3_000_000) {
      setMessage('L’image doit faire moins de 3 Mo')
      setIsUploading(false)
      return
    }

    if (!['image/webp', 'image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      setMessage('Format d’image non supporté')
      setIsUploading(false)
      return
    }

    const formData = new FormData()

    formData.append('image', file)

    const response = await fetch(`/image-upload?projectId=${projectId}`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${editCode}`
      },
      body: formData
    })

    const data = await response.json()

    if (data.code) {
      setMessage(data.message)
    }

    setImageURL(data?.imageURL?.replaceAll(S3_URL, ''))
    setImageKey(data.imageKey)
    setIsUploading(false)
  }

  const handleSubmit = () => {
    onSubmit({
      titre,
      description,
      lien,
      imageKey,
      imageURL
    })
  }

  const handleDelete = async () => {
    setMessage(null)
    setIsUploading(true)
    const response = await fetch(`/image-upload/${imageKey}?projectId=${projectId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${editCode}`
      }
    })

    if (response.ok) {
      setImageURL(null)
      setImageKey(null)
    }

    setIsUploading(false)
  }

  return (
    <>
      <div className='fr-grid-row fr-my-5w'>
        <div className='fr-col-12 fr-col-md-6 fr-pr-md-3w'>
          <TextInput
            isRequired
            label='Titre'
            value={titre}
            ariaLabel='Titre de la réutilisation'
            description='Titre de la réutilisation'
            onValueChange={e => setTitre(e.target.value)}
          />
        </div>
        <div className='fr-col-12 fr-col-md-6 fr-pt-3w fr-pt-md-0 fr-pr-md-3w'>
          <TextInput
            isRequired
            label='Lien'
            value={lien}
            placeholder='https://'
            ariaLabel='Lien vers la réutilisation'
            description='Lien vers la réutilisation'
            onValueChange={e => setLien(e.target.value)}
          />
        </div>
      </div>
      <div className='fr-grid-row fr-my-5w'>
        <div className='fr-grid-row fr-col-12 fr-pr-md-3w'>
          <div className='fr-col-12'>
            <TextInput
              type='textarea'
              label='Description'
              value={description}
              ariaLabel='Description de la réutilisation'
              description='Description de la réutilisation'
              onValueChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='fr-grid-row'>
        <div className='image-upload fr-grid-row fr-col-12 fr-col-md-7'>
          <div className='fr-upload-group fr-p-3w fr-col-12 fr-col-md-8'>
            <label className='fr-label' htmlFor='file-upload'>
              {imageURL ? (
                <span>Modifier l’illustration</span>
              ) : (
                <span>Ajouter une illustration</span>
              )}
              <span className='fr-hint-text'>Taille max : 3Mo, Resolution min : 500x250</span>
            </label>
            <input
              className='fr-upload'
              type='file'
              id='file-upload'
              name='file-upload'
              encType='multipart/form-data'
              onChange={e => setFile(e.target.files[0])}
            />
          </div>
          {imageURL && (
            <div className='fr-col-12 fr-col-md-4'>
              <Image
                className='fr-responsive-img'
                src={imageURL}
                alt={'Illustration de ' + titre}
                height={250}
                width={500}
              />
            </div>
          )}
          <div className='fr-grid-row fr-grid-row--bottom fr-grid-row--right fr-col-12'>
            {imageURL ? (
              <Button
                label='Supprimer'
                disabled={!imageURL}
                className='fr-btn fr-btn--sm fr-btn--icon-left fr-btn--tertiary-no-outline fr-icon-delete-line fr-mr-3w'
                style={{
                  color: imageURL ? colors.redMarianne425 : colors.grey200,
                  border: `1px solid ${imageURL ? colors.redMarianne425 : colors.grey200}`
                }}
                onClick={handleDelete}
              >
                Supprimer l’image
              </Button>
            ) : (
              <Button
                label='Téléverser une illustration'
                disabled={!file || isUploading}
                className='fr-btn fr-btn--sm fr-btn--icon-left fr-icon-upload-2-fill'
                onClick={handleUpload}
              >
                {isUploading ? 'Téléversement en cours…' : (imageURL ? 'Modifier l’image' : 'Téléverser l’image')}
              </Button>
            )}
          </div>
          {message && (
            <div style={{color: 'red'}}>
              <small>{message}</small>
            </div>
          )}

        </div>
      </div>
      <div className='fr-grid-row'>
        <Button
          label='Valider l’ajout de la subvention'
          icon='checkbox-circle-fill'
          isDisabled={!isFormComplete || isUploading}
          onClick={handleSubmit}
        >
          Valider
        </Button>
        <div className='fr-pl-3w'>
          <Button
            label='Annuler l’ajout de la subvention'
            buttonStyle='tertiary'
            onClick={onCancel}
          >
            Annuler
          </Button>
        </div>
      </div>
      <style jsx>{`
        .image-upload {
          border: 1px solid lightgrey;
          padding: 1em;
          margin: 1em 0;
        }

        .flex-container {
          display: flex;
          justify-content: end;
          align-items: center;
        }
      `}</style>
    </>
  )
}

ReutilisationForm.propTypes = {
  initialValues: PropTypes.object,
  isReutilisationExists: PropTypes.func,
  editCode: PropTypes.string,
  projectId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default ReutilisationForm
