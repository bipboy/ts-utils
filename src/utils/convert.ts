let baseFontSize: number = 16;

export const rem = (px: number): string => {
  return (px / baseFontSize).toString() + 'rem';
};

export const em = (px: number): string => {
  return (px / baseFontSize).toString() + 'em';
};

export const px = (value: number): string => {
  return value.toString() + 'px';
};
