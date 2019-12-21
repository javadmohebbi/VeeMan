export const FROM_TYPE_SEPARATOR = 'SEPARATOR-FIXED-TEXT'

export const FROM_TYPE_REPORT = 'reports'

export const getAllFroms = () => {
  return [
    { type: FROM_TYPE_REPORT, i18n: 'froms.reports' },
  ]
}


export const getSeparatorFroms = () => {
  return { type: FROM_TYPE_SEPARATOR, i18n: '!!! FIXED TEXT (SEPARATOR) !!!' }
}
