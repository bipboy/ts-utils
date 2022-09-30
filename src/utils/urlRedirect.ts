import isBrowser from './isBrowser';
import isNode from './isNode';

export default function urlRedirect(path: string): string | void {
  if (isBrowser() && window.location) {
    const urlPath = (window.location.href = path);
    return urlPath;
  } else if (isNode()) {
    // continue building on ssr
    () => {}; // noop
  } else {
    throw new Error('Not supported');
  }
}
