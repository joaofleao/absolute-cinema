const rgba = (hex: string, alpha = 1): string => {
  const matches = hex.match(/\w\w/g);

  if (!matches) {
    throw new Error('Invalid hex color');
  }
  const [r, g, b] = matches.map(x => {
    return parseInt(x, 16);
  });
  return `rgba(${r},${g},${b},${alpha})`;
};

export default rgba;
