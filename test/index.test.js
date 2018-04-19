const dnsResolve = require('../index.js');
const {Resolver} = require('dns')

const domains = ['s3.amazonaws.com', 'zeit.co', 'localhost'];

async function resolve(name, domain, options = {}) {
  console.log(`dnsResolve("${domain}")`);
  for (let i = 0; i < 10; i++) {
    console.time('resolve');
    console.log('IP: ', await dnsResolve(domain, options));
    console.timeEnd('resolve');
  }
}

it('should resolve domains', async () => {
  for (const domain of domains) {
    await resolve(domain);
  }
}, 10000)

it('should resolve using a custom resolver', async () => {
  const resolver = new Resolver()
  resolver.setServers(['8.8.8.8', '1.1.1.1'])
  for (const domain of domains) {
    await resolve(domain, { resolver });
  }
}, 10000)
