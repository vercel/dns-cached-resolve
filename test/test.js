#!/usr/bin/env node

const domains = ['s3.amazonaws.com', 'zeit.co', 'localhost'];

async function resolve(dnsResolve, domain) {
  console.log(`dnsResolve("${domain}")`);
  for (let i = 0; i < 10; i++) {
    console.time('resolve');
    console.log('IP: ', await dnsResolve(domain));
    console.timeEnd('resolve');
  }
}

async function repeatedResolves() {
  console.log('Repeated');

  const dnsResolve = require('../index.js');
  for (const domain of domains) {
    await resolve(dnsResolve, domain);
  }
}

async function concurrentResolves() {
  console.log('Concurrent');

  const dnsResolve = require('../index.js');
  for (const domain of domains) {
    const arr = [domain, domain, domain, domain, domain];
    console.log(`dnsResolve("${domain}")`);
    const res = await Promise.all(arr.map(dnsResolve));
    const first = res[0];
    console.log(res.every((v) => v === first));
  }
}

async function run() {
  await repeatedResolves();
  await concurrentResolves();
}

run().catch(console.error);
