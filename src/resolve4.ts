import dns, { RecordWithTtl } from 'dns';

export default function resolve4(
  host: string,
  resolver: typeof dns
): Promise<RecordWithTtl[]> {
  return new Promise((resolve, reject) => {
    resolver.resolve4(host, { ttl: true }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}
