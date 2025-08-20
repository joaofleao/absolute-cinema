import fs from 'fs'
import path from 'path'

const getKeys = (obj, prefix = '') => {
  return Object.keys(obj).flatMap((key) => {
    const value = obj[key]
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      return getKeys(value, fullKey)
    }
    return fullKey
  })
}

const basePath = path.resolve(__dirname, '../../src/i18n/locales')
const en = JSON.parse(fs.readFileSync(path.join(basePath, 'en-us.json'), 'utf8'))
const pt = JSON.parse(fs.readFileSync(path.join(basePath, 'pt-br.json'), 'utf8'))

const enKeys = getKeys(en).sort()
const ptKeys = getKeys(pt).sort()

const missingInPt = enKeys.filter((k) => !ptKeys.includes(k))
const extraInPt = ptKeys.filter((k) => !enKeys.includes(k))

if (missingInPt.length || extraInPt.length) {
  if (missingInPt.length) {
    // eslint-disable-next-line no-console
    console.error('Missing keys in pt-br.json:', missingInPt)
  }
  if (extraInPt.length) {
    // eslint-disable-next-line no-console
    console.error('Extra keys in pt-br.json:', extraInPt)
  }
  process.exit(1)
} else {
  // eslint-disable-next-line no-console
  console.log('i18n files have matching keys!')
}
