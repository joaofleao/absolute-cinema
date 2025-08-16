export const fonts = {
  primary: {
    regular: 'BaskervvilleSC-Regular',
    bold: 'BaskervvilleSC-SemiBold',
    black: 'BaskervvilleSC-Bold',
  },
  secondary: {
    regular: 'Inconsolata-Regular',
    bold: 'Inconsolata-Bold',
    black: 'Inconsolata-Black',
  },
  tertiary: {
    regular: 'Inconsolata_SemiExpanded-Regular',
    bold: 'Inconsolata_SemiExpanded-Bold',
    black: 'Inconsolata_SemiExpanded-Black',
  },
};

export type FontsType = typeof fonts;

export const fontImports = {
  'BaskervvilleSC-Regular': require('@assets/fonts/BaskervvilleSC-Regular.ttf'),
  'BaskervvilleSC-SemiBold': require('@assets/fonts/BaskervvilleSC-SemiBold.ttf'),
  'BaskervvilleSC-Bold': require('@assets/fonts/BaskervvilleSC-Bold.ttf'),
  'Inconsolata_SemiExpanded-Regular': require('@assets/fonts/Inconsolata_SemiExpanded-Regular.ttf'),
  'Inconsolata_SemiExpanded-Bold': require('@assets/fonts/Inconsolata_SemiExpanded-Bold.ttf'),
  'Inconsolata_SemiExpanded-Black': require('@assets/fonts/Inconsolata_SemiExpanded-Black.ttf'),
  'Inconsolata-Regular': require('@assets/fonts/Inconsolata-Regular.ttf'),
  'Inconsolata-Bold': require('@assets/fonts/Inconsolata-Bold.ttf'),
  'Inconsolata-Black': require('@assets/fonts/Inconsolata-Black.ttf'),
};
