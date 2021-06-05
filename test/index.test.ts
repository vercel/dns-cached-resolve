import { Resolver } from 'dns'
import dnsResolve, { setupCache } from '../src/dns-resolve';

const domains = ['s3.amazonaws.com', 'vercel.com'];

beforeEach(setupCache);

let resnr = 0;

async function resolve(domain: string, options = {}) {
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

test('Proper error on CNAME pointing to nowhere', async () => {
  const p = dnsResolve('dns-cached-resolve-test.vercel.rocks');
  await expect(p).rejects.toThrow('queryA ENOTFOUND dns-cached-resolve-test.vercel.rocks');
}, 10000);

test('Resolve localhost v4', async () => {
  const ip = await dnsResolve('localhost');
  await expect(ip).toEqual('127.0.0.1');
}, 10000);

test('Resolve localhost v6', async () => {
  const ip = await dnsResolve('localhost', { ipv6: true });
  await expect(ip).toEqual('::1');
}, 10000);
