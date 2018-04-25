const dns = require('dns');
const hostfile = require('@zeit/cached-hostfile');
const retry = require('async-retry');
const LRU = require('lru-cache');

const HOSTFILE_RESULT_TTL = 0.5; // half a second

const lruOptions = {
  max: 500
};
const cache4 = LRU(lruOptions);
const cache6 = LRU(lruOptions);

function resolve4(host) {
  return new Promise((resolve, reject) => {
    // Try to resolve from the hostfile
    const localips = hostfile.resolve4(host);
    if (localips) {
      return resolve(localips.map(ip => {
        return {
          address: String(ip),
          ttl: HOSTFILE_RESULT_TTL
        };
      }));
    }

    dns.resolve4(host, { ttl: true }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function resolve6(host) {
  return new Promise((resolve, reject) => {
    // Try to resolve from the hostfile
    const localips = hostfile.resolve6(host);
    if (localips) {
      return resolve(localips.map(ip => {
        return {
          address: String(ip),
          ttl: HOSTFILE_RESULT_TTL
        };
      }));
    }

    dns.resolve6(host, { ttl: true }, (err, res) => {
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
    refreshCache = false,
    retryOpts = { minTimeout: 10, retries: 3, factor: 5 }
  } = {}
) {
  const { cache, resolve } = ipv6
    ? { cache: cache6, resolve: resolve6 }
    : { cache: cache4, resolve: resolve4 };

  if (refreshCache) {
    cache.del(host);
  } else {
    const ip = cache.get(host);
    if (ip) return await ip;
  }

  const p = (async () => {
    const res = await retry(() => {
      return resolve(host);
    }, retryOpts);
    const rec = res[Math.floor(Math.random() * res.length)];
    const ttl = Math.max(rec.ttl, minimumCacheTime);
    cache.set(host, rec.address, ttl * 1000);
    return rec.address;
  })();
  cache.set(host, p, 5000);

  return await p;
}
module.exports = dnsResolve;
