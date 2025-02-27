import {getLabelFromValue} from '@/lib/utils/select-options.js'

export const natureOptions = [
  {label: 'Livrable GeoTIFF', value: 'geotiff'},
  {label: 'Livrable Jpeg 2000', value: 'jpeg2000'},
  {label: 'Livrable GML vecteur', value: 'gml'},
  {label: 'Livrable DXF vecteur', value: 'dxf'},
  {label: 'Livrable DWG vecteur', value: 'dwg'},
  {label: 'Livrable Géopackage vecteur', value: 'gpkg'}
]

export const diffusionOptions = [
  {label: 'Aucune diffusion', value: 'none'},
  {label: 'Diffusion via un service WMS', value: 'wms'},
  {label: 'Diffusion via un service WMTS', value: 'wmts'},
  {label: 'Diffusion via un service WFS', value: 'wfs'},
  {label: 'Diffusion via un service TMS', value: 'tms'}
]

export const licenceOptions = [
  {label: 'Ouvert sous licence ODbL', value: 'ouvert_odbl'},
  {label: 'Ouvert sous licence ouverte', value: 'ouvert_lo'},
  {label: 'Fermé', value: 'ferme'}
]

export function getNatures(value) {
  return getLabelFromValue(value, natureOptions)
}

export function getDiffusions(value) {
  return getLabelFromValue(value, diffusionOptions)
}

export function getLicences(value) {
  return getLabelFromValue(value, licenceOptions)
}
