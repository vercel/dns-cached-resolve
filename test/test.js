#!/usr/bin/env node

const dnsResolve = require('../index.js');

const domain = 's3.amazonaws.com';
async function run() {
  console.log(`dnsResolve("${domain}")`);
  for (let i = 0; i < 10; i++) {
    console.time('resolve');
    console.log('IP: ', await dnsResolve(domain));
    console.timeEnd('resolve');
  }
}
run().catch(console.error);
