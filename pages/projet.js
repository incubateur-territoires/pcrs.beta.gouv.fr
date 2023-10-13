import Page from '@/layouts/main.js'

import StockagePreview from '@/components/containers/stockage-preview.js'

const Projet = () => (
  <Page
    title='Carte des PCRS'
    description='Carte de déploiement des PCRS'
    hasFooter={false}
  >
    <StockagePreview stockageId='6529063a0c43f5c75284d6db' />
  </Page>
)

export default Projet

