const dns = require('dns');
const retry = require('async-retry');
const LRU = require('lru-cache');

const lruOptions = {
  max: 500
};
const cache4 = LRU(lruOptions);
const cache6 = LRU(lruOptions);

function resolve4(host) {
  return new Promise((resolve, reject) => {
    dns.resolve4(host, { ttl: true }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function resolve6(host) {
  return new Promise((resolve, reject) => {
    dns.resolve4(host, { ttl: true }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

async function dnsResolve(
  host,
  {
    ipv6 = false,
    minimumCacheTime = 300,
    retryOpts = { minTimeout: 10, retries: 3, factor: 5 }
  } = {}
) {
  const { cache, resolve } = ipv6
    ? { cache: cache6, resolve: resolve6 }
    : { cache: cache4, resolve: resolve4 };

  const ip = cache.get(host);
  if (ip) return ip;

  const res = await retry(() => {
    return resolve(host);
  }, retryOpts);
  const rec = res[Math.floor(Math.random() * res.length)];
  const ttl = Math.max(rec.ttl, minimumCacheTime);
  cache.set(host, rec.address, ttl * 1000);
  return rec.address;
}
module.exports = dnsResolve;
