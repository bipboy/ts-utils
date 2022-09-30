type NullOrUndefined = null | undefined;

export default function isNullOrUndefined(
  value: any
): value is NullOrUndefined {
  return [null, undefined].includes(value);
}
