type IpError = {
  code: string;
  message: string;
};

type IpToIntResult =
  | {ipv4: number}
  | {ipv6: [bigint, bigint]}
  | {error: IpError};

/**
 * Converts an IP address to a 32-bit integer (for IPv4) or two 64-bit integers (for IPv6).
 * @param ip - The IP address in string format.
 * @returns An object containing the result of the conversion or an error object.
 */
export const ipToInt = (ip: string): IpToIntResult => {
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    return {ipv4: ip2int(ip)};
  } else if (/^([0-9a-fA-F]{0,4}:){2,7}([0-9a-fA-F]{0,4})$/.test(ip)) {
    return {ipv6: ipv62int(ip)};
  } else {
    return {error: {code: 'INVALID_IP', message: 'Invalid IP address format'}};
  }
};

/**
 * Converts an IP address to a 32-bit integer.
 * @param ip - The IP address in string format.
 * @returns A 32-bit integer.
 */
export const ip2int = (ip: string): number =>
  ip.split('.').reduce((ipInt: number, octet: string) => {
    return (ipInt << 8) + parseInt(octet, 10);
  }, 0) >>> 0;

/**
 * Converts an IPv6 address to two 64-bit integers.
 * @param ip - The IPv6 address in string format.
 * @returns An array containing two 64-bit integers.
 */
export const ipv62int = (ip: string): [bigint, bigint] => {
  const fullIp = ip.replace(/::/, `:${'0'.repeat(9 - ip.split(':').length)}:`);
  const groups = fullIp.split(':').filter(Boolean);
  const high = groups.slice(0, 4).reduce((acc, group) => {
    return (acc << BigInt(16)) + BigInt(`0x${group}`);
  }, BigInt(0));
  const low = groups.slice(4).reduce((acc, group) => {
    return (acc << BigInt(16)) + BigInt(`0x${group}`);
  }, BigInt(0));
  return [high, low];
};
