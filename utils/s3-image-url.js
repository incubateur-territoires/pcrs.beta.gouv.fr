const URL = process.env.NEXT_PUBLIC_IMAGES_DOMAIN

// Fonction pour prendre en charge les images provenant du S3:
// Certaines images sont stockées en base avec l'URL complète du S3,
// après modification, les nouvelles images uploadées n'ont plus l'URL.

export function s3ImageUrl(imageURL) {
  if (imageURL.includes(URL)) {
    return imageURL
  }

  return URL + imageURL
}
