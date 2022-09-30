const getProviderAvailable = (
  country: string,
  list: {[s: string]: unknown} | ArrayLike<unknown>
): boolean => {
  return Object.values(list).includes(country) ? true : false;
};

export default getProviderAvailable;
