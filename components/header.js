import {useState, useContext} from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'

import DeviceContext from '@/contexts/device.js'

const Header = () => {
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const {isMobileDevice} = useContext(DeviceContext)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMenuOpen = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <div>
      <header role='banner' className='header fr-header'>
        <div className='fr-header__body'>
          <div className='fr-container'>
            <div className='fr-header__body-row'>
              <div className='header-redirect fr-header__brand fr-enlarge-link'>
                <div className='fr-header__brand-top'>
                  <Link href='/'>
                    <div className='fr-header__logo'>
                      <p className='fr-logo'>
                        RÉPUBLIQUE<br />FRANÇAISE
                      </p>
                    </div>
                  </Link>
                  <div className='fr-header__navbar'>
                    <button type='button' className='fr-btn--menu fr-btn' onClick={handleMenuOpen}>
                      Menu
                    </button>
                  </div>
                </div>
                <Link href='/'>
                  <div className='fr-header__service'>
                    <Image
                      src='/images/logos/logo-pcrsgouvfr.png'
                      height='25'
                      width='205'
                      alt='pcrs.beta.gouv.fr'
                    />
                  </div>
                </Link>
              </div>

              <div className='fr-header__tools'>
                <div className='fr-header__tools-links'>
                  <ul className='fr-btns-group'>
                    <li>
                      <Link legacyBehavior href='/suivi-pcrs'>
                        <a className='fr-btn fr-icon-road-map-line'>
                          Suivi géographique
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link legacyBehavior href='/blog'>
                        <a className='fr-btn fr-icon-article-line'>
                          Blog du PCRS
                        </a>
                      </Link>
                    </li>
                    <li>
                      <a href='https://docs.pcrs.beta.gouv.fr/' className='fr-btn fr-icon-book-2-line'>
                        Espace documentaire
                      </a>
                    </li>
                    <li>
                      <div
                        className='drop-button'
                        onMouseEnter={() => setIsToolsOpen(true)}
                        onMouseLeave={() => setIsToolsOpen(false)}
                      >
                        <div className='fr-btn fr-icon-arrow-down-s-line'>
                          Outils
                        </div>
                        {isToolsOpen && (
                          <div className='drop-item'>
                            <Link
                              legacyBehavior href='/calculatrice'
                            >
                              <a className='fr-btn fr-icon-money-euro-circle-line'>
                                Calculatrice de coûts
                              </a>
                            </Link>
                          </div>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && isMobileDevice && (
        <header className='header fr-header'>
          <div className='custom-mobile-menu fr-p-0'>
            <button
              type='button'
              className='fr-btn--close fr-btn fr-mr-2w fr-mt-2w'
              title='Fermer'
              onClick={handleMenuOpen}
            >
              Fermer
            </button>

            <div className='fr-header__menu-links'>
              <ul className='fr-btns-group fr-pl-2w'>
                <li>
                  <Link legacyBehavior href='/suivi-pcrs'>
                    <a className='fr-btn fr-icon-road-map-line fr-py-1w fr-px-2w'>
                      Suivi géographique
                    </a>
                  </Link>
                </li>
                <li>
                  <Link legacyBehavior href='/blog'>
                    <a className='fr-btn fr-icon-article-line fr-py-1w fr-px-2w'>
                      Blog du PCRS
                    </a>
                  </Link>
                </li>
                <li>
                  <a href='https://docs.pcrs.beta.gouv.fr/' className='fr-btn fr-icon-book-2-line fr-py-1w fr-px-2w'>
                    Espace documentaire
                  </a>
                </li>
                <li>
                  <div
                    className='drop-button fr-py-1w fr-px-2w'
                    onClick={() => setIsToolsOpen(!isToolsOpen)}
                  >
                    <div className='fr-btn fr-icon-arrow-down-s-line'>
                      Outils
                    </div>
                    {isToolsOpen && (
                      <div className='drop-item-mobile'>
                        <Link legacyBehavior href='/calculatrice'>
                          <a className='fr-btn fr-icon-money-euro-circle-line'>
                            Calculatrice de coûts
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </header>
      )}

      <style jsx>{`
        .header {
          z-index: 6;
        }

        .header-redirect {
          cursor: pointer;
        }

        .custom-mobile-menu {
          z-index: 6;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          padding: 1.5em;
        }

        .custom-mobile-menu li {
          width: fit-content;
        }

        .drop-button {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .drop-item {
          background-color: #f6f6f6;
          position: absolute;
          right: 0;
          padding-top: 15px;
          margin-top: 45px;
        }

        .drop-item-mobile {
          left: 8px;
          width: fit-content;
          padding: 15px;
        }

        .drop-button:hover, .drop-button:active {
          background-color: #f6f6f6;
        }
      `}</style>
    </div>
  )
}

export default Header
