const HTTPS: string = 'https://';

export const imageRoot = (value: string, cdn?: string) =>
  typeof value === 'string' && value.includes(HTTPS)
    ? value
    : `${cdn}/${value}`;
