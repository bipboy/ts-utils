export default function isNode(): boolean {
  return (
    typeof process === 'object' &&
    process.versions != null &&
    process.versions.node != null
  );
}
