export const fonts = {
  primary: {
    regular: 'Tienne-Black',
    bold: 'Tienne-Bold',
    black: 'Tienne-Regular',
  },
  secondary: {
    regular: 'Inconsolata-Black',
    bold: 'Inconsolata-Bold',
    black: 'Inconsolata-Regular',
  },
  tertiary: {
    regular: 'Inconsolata_SemiExpanded-Black',
    bold: 'Inconsolata_SemiExpanded-Bold',
    black: 'Inconsolata_SemiExpanded-Regular',
  },
  quaternary: {
    regular: 'Spartan-Bold',
    bold: 'Spartan-Regular',
    black: 'Spartan-Light',
  },
};

export type FontsType = typeof fonts;

export const fontImports = Object.fromEntries(
  Object.values(fonts)
    .flatMap(group => Object.values(group))
    .map(name => [name, require(`@assets/fonts/${name}.ttf`)])
);
