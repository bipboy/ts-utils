// eslint-disable-next-line @typescript-eslint/ban-types
const getPathnameChunk = (context: {} | null): string => {
  const pathname =
    typeof window !== 'undefined'
      ? window.location.pathname
      : context?.['location'];
  return pathname.split('/')?.pop();
};

export default getPathnameChunk;
