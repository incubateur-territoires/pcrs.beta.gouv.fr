import {useEffect, useState, useContext} from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'

import {getProject} from '@/lib/suivi-pcrs.js'

import colors from '@/styles/colors.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

import Page from '@/layouts/main.js'

import Button from '@/components/button.js'
import CenteredSpinner from '@/components/centered-spinner.js'
import ProjetInfos from '@/components/projet/index.js'

const Projet = () => {
  const router = useRouter()
  const {token} = useContext(AuthentificationContext)

  const [project, setProject] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const {id} = router.query

  useEffect(() => {
    async function getProjectData() {
      setIsLoading(true)
      try {
        const project = token ? await getProject(id, token) : await getProject(id)

        setProject(project)
      } catch (error) {
        setErrorMessage(error.message)
      }

      setIsLoading(false)
    }

    if (id) {
      getProjectData()
    } else {
      setIsLoading(false)
    }
  }, [id, token])

  if (errorMessage) {
    return (
      <Page>
        <div className='not-found-wrapper fr-p-5w'>
          <Image
            src='/images/illustrations/403.png'
            height={456}
            width={986}
            alt=''
            style={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto'
            }}
          />

          <div className='not-found-explain fr-pt-8w'>
            <p><b className='fr-mt-3w fr-text--xl'>{errorMessage}</b></p>
            <Button label='Retour à la page d’accueil' href='/suivi-form'><span className='fr-icon-home-4-line' aria-hidden='true' />&nbsp;Retour au début de la rue</Button>
          </div>
        </div>

        <style jsx>{`
          .not-found-wrapper, h1 {
            text-align: center;
            color: ${colors.darkgrey};
          }
        `}</style>
      </Page>
    )
  }

  return (
    <Page>
      {isLoading ? (
        <CenteredSpinner />
      ) : (
        project && (
          <div>
            <div className='page-header fr-my-5w'>
              <Image
                src='/images/illustrations/file.svg'
                height={200}
                width={200}
                alt=''
                aria-hidden='true'
              />
              <h2 className='fr-mt-5w fr-mb-0'>{project.nom}</h2>
            </div>
            <ProjetInfos project={project} />
          </div>
        ))}

      <style jsx>{`
        .page-header {
          text-align: center;
        }
      `}</style>
    </Page>
  )
}

export default Projet
