const colors = {
  accent: {
    default: '#000000',
  },
  background: {
    default: '#000000',
    overlay: 'rgba(0,0,0,0.4)',
  },
  container: {
    filled: '#101012',
    default: 'rgba(32,32,36,0.5)',
    stroke: 'rgba(32,32,36,1)',
  },
  foreground: {
    default: '#fff',
    inverse: '#000',
    light: 'rgba(255,255,255,0.4)',
  },
  positive: {
    base: '#0B8B5B',
  },
  negative: {
    base: '#B80B0B',
  },
}

export { colors }
export type ColorsType = typeof colors
