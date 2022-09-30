const BIPTIK_SYMBOL = (
  typeof Symbol !== 'undefined' && typeof Symbol.for === 'function'
    ? Symbol.for('biptik_default')
    : '@@biptik_default'
) as Symbol;
interface IPattern {
  pattern: RegExp;
  callback: HubCallback;
}

interface IListener {
  name: string;
  callback: HubCallback;
}

export type HubCapsule = {
  channel: string;
  payload: HubPayload;
  source: string;
  patternInfo?: string[];
};

export type HubPayload = {
  event: string;
  data?: any;
  message?: string;
};

export type HubCallback = (capsule: HubCapsule) => void;

export type LegacyCallback = {onHubCapsule: HubCallback};

function isLegacyCallback(callback: any): callback is LegacyCallback {
  return (<LegacyCallback>callback).onHubCapsule !== undefined;
}

export class HubClass {
  name: string;
  private listeners: IListener[] = [];
  private patterns: IPattern[] = [];

  protectedChannels = ['core', 'auth', 'api'];

  constructor(name: string) {
    this.name = name;
  }

  // Note - Need to pass channel as a reference for removal to work and not anonymous function
  remove(channel: string | RegExp, listener: HubCallback) {
    if (channel instanceof RegExp) {
      const pattern = this.patterns.find(
        ({pattern}) => pattern.source === channel.source
      );
      if (!pattern) {
        console.warn(`No listeners for ${channel}`);
        return;
      }
      this.patterns = [...this.patterns.filter((x) => x !== pattern)];
    } else {
      const holder = this.listeners[channel];
      if (!holder) {
        console.warn(`No listeners for ${channel}`);
        return;
      }
      this.listeners[channel] = [
        ...holder.filter(({callback}) => callback !== listener)
      ];
    }
  }

  dispatch(
    channel: string,
    payload: HubPayload,
    source: string = '',
    ampSymbol?: Symbol
  ) {
    if (this.protectedChannels.indexOf(channel) > -1) {
      const hasAccess = ampSymbol === BIPTIK_SYMBOL;

      if (!hasAccess) {
        console.warn(
          `WARNING: ${channel} is protected and dispatching on it can have unintended consequences`
        );
      }
    }

    const capsule: HubCapsule = {
      channel,
      payload: {...payload},
      source,
      patternInfo: []
    };

    try {
      this._toListeners(capsule);
    } catch (e) {
      console.warn(e);
    }
  }

  listen(
    channel: string | RegExp,
    callback?: HubCallback | LegacyCallback,
    listenerName = 'noname'
  ) {
    let cb: HubCallback;
    // Check for legacy onHubCapsule callback for backwards compatability
    if (isLegacyCallback(callback)) {
      console.warn(
        `WARNING onHubCapsule is Deprecated. Please pass in a callback.`
      );
      cb = callback.onHubCapsule.bind(callback);
    } else if (typeof callback !== 'function') {
      throw new Error('No callback supplied to Hub');
    } else {
      cb = callback;
    }

    if (channel instanceof RegExp) {
      this.patterns.push({
        pattern: channel,
        callback: cb
      });
    } else {
      let holder = this.listeners[channel];

      if (!holder) {
        holder = [];
        this.listeners[channel] = holder;
      }

      holder.push({
        name: listenerName,
        callback: cb
      });
    }

    return () => {
      this.remove(channel, cb);
    };
  }

  private _toListeners(capsule: HubCapsule) {
    const {channel, payload} = capsule;
    const holder = this.listeners[channel];

    if (holder) {
      holder.forEach((listener) => {
        console.debug(`Dispatching to ${channel} with `, payload);
        try {
          listener.callback(capsule);
        } catch (e) {
          console.error(e);
        }
      });
    }

    if (this.patterns.length > 0) {
      if (!payload.message) {
        console.warn(`Cannot perform pattern matching without a message key`);
        return;
      }

      const payloadStr = payload.message;

      this.patterns.forEach((pattern) => {
        const match = payloadStr.match(pattern.pattern);
        if (match) {
          const [, ...groups] = match;
          const dispatchingCapsule: HubCapsule = {
            ...capsule,
            patternInfo: groups
          };
          try {
            pattern.callback(dispatchingCapsule);
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  }
}

/*We export a __default__ instance of HubClass to use it as a
psuedo Singleton for the main messaging bus, however you can still create
your own instance of HubClass() for a separate "private bus" of events.*/
export const Hub = new HubClass('__default__');
