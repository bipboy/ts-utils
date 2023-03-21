import {ipToInt} from '.';

describe('ipToInt', () => {
  test('converts IPv4 address to 32-bit integer', () => {
    expect(ipToInt('192.168.1.1')).toEqual({ipv4: 3232235777});
  });

  test('converts IPv6 address to two 64-bit integers', () => {
    expect(ipToInt('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toEqual({
      ipv6: [2306139570357600256n, 151930230829876n]
    });
  });

  test('returns error object for invalid IP address format', () => {
    expect(ipToInt('foo.bar.baz')).toEqual({
      error: {code: 'INVALID_IP', message: 'Invalid IP address format'}
    });
  });
});
