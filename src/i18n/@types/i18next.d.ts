import enUS from '@i18n/locales/en-us.json'

const resources = {
  ...enUS,
}

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources
  }
}
