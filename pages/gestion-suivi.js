import {useState, useContext, useEffect} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/router'

import AuthentificationContext from '@/contexts/authentification-token.js'

import Page from '@/layouts/main.js'

import AdminAuthentificationModal from '@/components/suivi-form/authentification/admin-authentification-modal.js'
import Porteurs from '@/components/gestion-admin/porteurs.js'
import Changes from '@/components/gestion-admin/changes.js'
import Administrateurs from '@/components/gestion-admin/administrateurs.js'

const Admin = () => {
  const router = useRouter()
  const {userRole, token, isTokenRecovering} = useContext(AuthentificationContext)

  const [activeTab, setActiveTab] = useState('porteurs')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isAuthentified = Boolean(token && userRole === 'admin')

  useEffect(() => {
    if (!isTokenRecovering && !isAuthentified) {
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
    }
  }, [isAuthentified, isTokenRecovering])

  return (
    <Page>
      {isModalOpen && (
        <AdminAuthentificationModal
          handleIsModalOpen={setIsModalOpen}
          onModalClose={() => isAuthentified ? setIsModalOpen(false) : router.push('/suivi-pcrs')}
        />
      )}

      <div className='page-header fr-my-5w'>
        <Image
          src='/images/illustrations/admin-illustration.svg'
          height={200}
          width={200}
          alt=''
          aria-hidden='true'
        />
        <h2 className='fr-mt-5w fr-mb-0'>Gestion des suivis</h2>
      </div>

      <div className='fr-px-md-1w'>
        <h3 className='fr-h6 fr-mb-6w'><span className='fr-icon-file-text-line' aria-hidden='true' /> Liste des administrateurs et porteurs de projets</h3>

        <div className='fr-tabs'>
          <ul className='fr-tabs__list' role='tablist' aria-label='Choix du type d’utilisateurs'>
            <li role='presentation'>
              <button
                type='button'
                className='fr-tabs__tab fr-icon-checkbox-line fr-tabs__tab--icon-left'
                role='tab'
                aria-selected={activeTab === 'porteurs' ? 'true' : 'false'}
                onClick={() => setActiveTab('porteurs')}
              >
                Porteurs de projets
              </button>
            </li>
            <li role='presentation'>
              <button
                type='button'
                className='fr-tabs__tab fr-icon-checkbox-line fr-tabs__tab--icon-left'
                role='tab'
                aria-selected={activeTab === 'admin' ? 'true' : 'false'}
                onClick={() => setActiveTab('admin')}
              >
                Administrateurs
              </button>
            </li>
            <li role='presentation'>
              <button
                type='button'
                className='fr-tabs__tab fr-icon-checkbox-line fr-tabs__tab--icon-left'
                role='tab'
                aria-selected={activeTab === 'changes' ? 'true' : 'false'}
                onClick={() => setActiveTab('changes')}
              >
                Projets édités récemment
              </button>
            </li>
          </ul>
          {activeTab === 'porteurs' && (
            <div className='fr-tabs__panel fr-tabs__panel--selected' role='tabpanel'>
              <Porteurs />
            </div>
          )}

          {activeTab === 'admin' && (
            <div className='fr-tabs__panel fr-tabs__panel--selected' role='tabpanel'>
              <Administrateurs />
            </div>
          )}

          {activeTab === 'changes' && (
            <div className='fr-tabs__panel fr-tabs__panel--selected' role='tabpanel'>
              <Changes token={token} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page-header {
          text-align: center;
        }
      `}</style>
    </Page>
  )
}

export default Admin
