import {useEffect, useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import Image from 'next/image'

import {getProject} from '@/lib/suivi-pcrs.js'

import colors from '@/styles/colors.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

import Page from '@/layouts/main.js'

import Button from '@/components/button.js'
import CenteredSpinner from '@/components/centered-spinner.js'
import ProjetInfos from '@/components/projet/index.js'

const Projet = ({id = null}) => {
  const router = useRouter()
  const {token} = useContext(AuthentificationContext)

  const [project, setProject] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [isLoading, setIsLoading] = useState(true)

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
      router.push('/404')
    }
  }, [id, token, router])

  if (errorMessage) {
    return (
      <Page title='Erreur sur la page' description={errorMessage}>
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
            <Button label='Retour à la carte de suivi' href='/suivi-pcrs'><span className='fr-icon-home-4-line' aria-hidden='true' />&nbsp;Retour à la carte de suivi</Button>
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
    <Page title={project?.nom ? `Projet ${project.nom}` : null} description='Page contenant les informations relatives à un projet'>
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

export async function getServerSideProps(context) {
  // Check id before page is render
  const {id} = context.params

  return {
    props: {
      id
    }
  }
}

Projet.propTypes = {
  id: PropTypes.string
}

export default Projet

