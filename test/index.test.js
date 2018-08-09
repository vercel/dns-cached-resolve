let dnsResolve;
const {Resolver} = require('dns')

const domains = ['s3.amazonaws.com', 'zeit.co'];

beforeEach(() => {
  dnsResolve = require('../index.js');
});

let resnr = 0;

async function resolve(domain, options = {}) {
  console.log(`dnsResolve("${domain}")`);

  const line = `resolve ${resnr++}`;
  console.time(line);
  console.log('IP: ', await dnsResolve(domain, options));
  console.timeEnd(line);
}

test('should resolve domains', async () => {
  for (const domain of domains) {
    await resolve(domain);
  }
}, 10000)

test('should resolve using a custom resolver', async () => {
  const resolver = new Resolver()
  resolver.setServers(['8.8.8.8', '1.1.1.1'])
  for (const domain of domains) {
    await resolve(domain, { resolver });
  }
}, 10000)

test('repeated resolves', async () => {
  for (const domain of domains) {
    await resolve(domain, domain);
  }
}, 100000);

test('concurrent resolves', async () => {
  for (const domain of domains) {
    const arr = [domain, domain, domain, domain, domain];
    const res = await Promise.all(arr.map(resolve));
    const first = res[0];

    expect(res.every((v) => v === first)).toBeTruthy();
  }
}, 10000);
