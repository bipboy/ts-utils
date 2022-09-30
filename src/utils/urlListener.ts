import isBrowser from './isBrowser';
import isNode from './isNode';

export default (callback: (arg0: {url: string}) => void): void => {
  if (isBrowser() && window.location) {
    const url = window.location.href;

    callback({url});
  } else if (isNode()) {
    // continue building on ssr
    () => {}; // noop
  } else {
    throw new Error('Not supported');
  }
};
