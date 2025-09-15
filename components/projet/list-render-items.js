import {formatDate} from '@/lib/date-utils.js'
import {formatBytes} from '@/lib/utils/file.js'
import {SUBVENTIONS_NATURES, LICENCES, LIVRABLE_NATURES, LIVRABLE_DIFFUSION} from '@/lib/utils/projet.js'

import colors from '@/styles/colors.js'

import ListItem from '@/components/projet/list-item.js'
import Badge from '@/components/badge.js'

const BANDES_COLORS = {
  Red: {color: '#c9191e', textColor: '#fff'},
  Blue: {color: '#0063cb', textColor: '#fff'},
  Green: {color: '#18753C', textColor: '#fff'},
  Alpha: {color: '#304B5B', textColor: '#fff'}
}

const renderRowItem = (title, value, defaultText = 'Non renseigné', style) => (
  <div key={title} className='fr-grid-row'>
    <div className={`${style} title fr-mr-1w`}>{title} :</div>
    <span className='fr-grid-row'>{value || defaultText}</span>
    <style jsx>{`
      .content-wrapper {
        background: white;
        text-align: left;
        gap: 5px;
      }

      .title {
        color: ${colors.info425};
        font-weight: bold;
      }

      .secondary {
        font-size: 0.9em;
        color: ${colors.darkgrey};
      }

      .content-wrapper span {
        font-weight: normal;
      }
    `}</style>
  </div>
)

const renderItem = (rows, style) => (
  <div className='content-wrapper fr-p-2w'>
    {rows.map(row => renderRowItem(row.title, row.value, style))}

    <style jsx>{`
      .content-wrapper {
        background: white;
        text-align: left;
        gap: 5px;
      }
    `}</style>
  </div>
)

export const livrableRenderItem = livrable => {
  let diffLink = null
  if (livrable.diffusion !== null) {
    diffLink = LIVRABLE_DIFFUSION[livrable.diffusion].label
    if (livrable.diffusion !== null && livrable.diffusion_url !== null) {
      diffLink = `${diffLink} (URL : ${livrable.diffusion_url})`
    }
  }

  const rows = [
    {title: 'Nature', value: LIVRABLE_NATURES[livrable.nature].label, defaultText: 'Non renseignée'},
    {title: 'Licence', value: LICENCES[livrable.licence].label, defaultText: 'Non renseignée'},
    {title: 'Stockage', value: livrable?.stockage?.toUpperCase(), defaultText: 'Non renseigné'},
    {title: 'Date livraison', value: livrable?.date_livraison ? `le ${formatDate(livrable.date_livraison)}` : null, defaultText: 'Non renseignée'},
    {title: 'Diffusion', value: diffLink, defaultText: 'Non renseignée'},
    {title: 'Ressource', value: livrable?.diffusion_layer || null, defaultText: 'Non renseignée'}
  ]
  return renderItem(rows)
}

export const acteurRenderItem = acteur => {
  const rows = [
    {title: 'SIREN', value: acteur.siren},
    {title: 'Mail', value: acteur.mail, defaultText: 'Non renseignée'},
    {title: 'Téléphone', value: acteur.telephone},
    {title: 'Part de financement', value: acteur.finance_part_perc, defaultText: 'Non renseignée'},
    {title: 'Montant du financement', value: acteur.finance_part_euro}
  ]
  return (
    <ListItem title={acteur.nom}>
      {renderItem(rows)}
    </ListItem>
  )
}

export const subventionRenderItem = subvention => {
  const rows = [
    {title: 'Nature', value: SUBVENTIONS_NATURES[subvention.nature].label, defaultText: 'Non renseignée'},
    {title: 'Montant', value: subvention.montant ? `${subvention.montant}€` : null},
    {title: 'Échance', value: formatDate(subvention.echeance), defaultText: 'Non renseignée'}
  ]
  return (
    <ListItem title={subvention.nom}>
      {renderItem(rows)}
    </ListItem>
  )
}

export const scanRenderItem = result => {
  const rows = [
    {title: 'Nature', value: <Badge size='small' background='#fc916f'>PCRS raster</Badge>},
    {title: 'Format', value: result?.format && LIVRABLE_NATURES[result.format].label, defaultText: 'Non renseigné'},
    {title: 'Nombre de dalles', value: result?.numRasterFiles, defaultText: 'Non renseigné'},
    {title: 'Projection', value: result?.projection?.name, defaultText: 'Non renseignée'},
    {title: 'Poids', value: result?.sizeRasterFiles && formatBytes(result?.sizeRasterFiles), defaultText: 'Non renseignées'},
    {
      title: 'Bandes',
      value: result?.bands?.length > 0 && result.bands.map(band => (
        <Badge
          key={band.id}
          size='small'
          background={BANDES_COLORS[band.colorInterpretation].color}
          textColor={BANDES_COLORS[band.colorInterpretation].textColor}
        >
          {band.colorInterpretation}
        </Badge>
      )),
      defaultText: 'Non renseigné'
    }
  ]

  return renderItem(rows)
}
