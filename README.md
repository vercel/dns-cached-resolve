Caching DNS resolver
====================

## Example

```
async function run() {
  console.log('resolve("www.xstack.io")');
  for (let i = 0; i < 10; i++) {
    console.time('resolve');
    console.log('IP: ', await dnsResolve('www.xstack.io'));
    console.timeEnd('resolve');
  }
}
run().catch(console.error);
```

```
% node index.js
resolve("wwww.xstack.io")
IP:  54.153.55.116
resolve: 569.156ms
IP:  54.153.55.116
resolve: 0.256ms
IP:  54.153.55.116
resolve: 0.061ms
IP:  54.153.55.116
resolve: 0.036ms
```
