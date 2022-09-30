import isBrowser from './isBrowser';

const reloadBrowser = () => {
  if (isBrowser()) {
    return window.location.reload();
  }
};

export default reloadBrowser;
