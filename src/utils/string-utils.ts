export function urlSafeEncode(str: string) {
  return str
    .split('')
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export function urlSafeDecode(hex: string) {
  // @ts-ignore
  return hex
    .match(/.{2}/g)
    .map((char) => String.fromCharCode(parseInt(char, 16)))
    .join('');
}

// const short = textEllipsis('a very long text', 10);
// console.log(short);
// "a very ..."

// const short = textEllipsis('a very long text', 10, { side: 'start' });
// console.log(short);
// "...ng text"

// const short = textEllipsis('a very long text', 10, { textEllipsis: ' END' });
// console.log(short);
// "a very END"

export function stringEllipsis(
  str: string,
  maxLength: number,
  {side = 'end', ellipsis = '...'} = {}
): string {
  if (str?.length > maxLength) {
    switch (side) {
      case 'start':
        return ellipsis + str.slice(-(maxLength - ellipsis.length));
      case 'end':
      default:
        return str.slice(0, maxLength - ellipsis.length) + ellipsis;
    }
  }
  return str;
}
