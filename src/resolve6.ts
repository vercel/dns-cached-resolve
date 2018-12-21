import dns, { RecordWithTtl } from 'dns';

export default function resolve6(
  host: string,
  resolver: typeof dns
): Promise<RecordWithTtl[]> {
  return new Promise((resolve, reject) => {
    resolver.resolve6(host, { ttl: true }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}
