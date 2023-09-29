export const checkIsPhoneValid = phone => {
  const phoneChecker = /^$|^(?:\+33|0)[1-9](?:\d{8}|\d{9})$/
  if (phoneChecker.test(phone)) {
    return true
  }

  return false
}

export const checkIsEmailValid = mail => {
  const emailChecker = /^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
  if (emailChecker.test(mail)) {
    return true
  }

  return false
}

export const checkIsSirenValid = siren => {
  const sirenChecker = /^$|^\d{9}$/
  if (sirenChecker.test(siren)) {
    return true
  }

  return false
}

export function handlePhoneError(input) {
  if (!checkIsPhoneValid(input)) {
    return 'Le numéro de téléphone doit être composé de 10 chiffres ou de 9 chiffres précédés du préfixe +33'
  }
}

export function handleMailError(input) {
  if (!checkIsEmailValid(input)) {
    return 'L’adresse mail entrée est invalide. Exemple : dupont@domaine.fr'
  }
}

export function handleSirenError(input) {
  if (!checkIsSirenValid(input)) {
    return 'Le SIREN doit être composé de 9 chiffres'
  }
}
