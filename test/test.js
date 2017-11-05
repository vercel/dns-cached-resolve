#!/usr/bin/env node

const dnsResolve = require('../index.js');

const domains = ['s3.amazonaws.com', 'zeit.co', 'localhost'];

async function resolve(domain) {
  console.log(`dnsResolve("${domain}")`);
  for (let i = 0; i < 10; i++) {
    console.time('resolve');
    console.log('IP: ', await dnsResolve(domain));
    console.timeEnd('resolve');
  }
}

async function run() {
  for (const domain of domains) {
    await resolve(domain);
  }
}

run().catch(console.error);
