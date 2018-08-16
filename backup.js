const dns = require('./');
const addresses = {};

function startReadingDns (key, host, opts = {}, resolve) {
  dns(host, opts).then((value) => {
    addresses[key] = value;
    // console.log('host', host, 'value', value);
    if (resolve) resolve(value);
  }).catch((error) => {
    error.host = host;
    error.opts = opts;
    console.error('not thrown', error);
  }).then(() => {
    const t = setTimeout(() => {
      startReadingDns(key, host, opts);
    }, 2000);

    if (t.unref) {
      t.unref();
    }
  });
}

module.exports = function (host, opts = {}) {
  const key = JSON.stringify({
    host, ipv6: Boolean(opts.ipv6)
  });

  if (addresses[key]) {
    return addresses[key];
  }

  const p = new Promise((resolve) => {
    startReadingDns(key, host, opts, resolve);
  });

  addresses[key] = p;
  return p;
};
