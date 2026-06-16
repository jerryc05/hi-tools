// import os from 'node:os';
// import dns from 'node:dns/promises';
// import { execFile } from 'node:child_process';
// import { promisify } from 'node:util';
// import { Command } from 'commander';
// import pLimit from 'p-limit';

// const execFileAsync = promisify(execFile);

// type NetIf = {
//   name: string;
//   address: string;
//   netmask: string;
//   cidr?: string | null;
// };

// type Device = {
//   iface: string;
//   ip: string;
//   mac?: string;
//   hostname?: string;
//   maybePhone: boolean;
//   phoneScore: number;
//   reasons: string[];
//   guessedModel?: string;
// };

// const PHONE_NAME_KEYWORDS = [
//   'iphone',
//   'ipad',
//   'ios',
//   'android',
//   'galaxy',
//   'pixel',
//   'redmi',
//   'xiaomi',
//   'huawei',
//   'honor',
//   'oppo',
//   'vivo',
//   'oneplus',
//   'realme',
//   'moto',
//   'motorola',
//   'mi-',
//   'samsung',
// ];

// function ipToInt(ip: string): number {
//   return ip
//     .split('.')
//     .map(Number)
//     .reduce((acc, oct) => ((acc << 8) + oct) >>> 0, 0);
// }

// function intToIp(n: number): string {
//   return [24, 16, 8, 0]
//     .map((shift) => (n >>> shift) & 255)
//     .join('.');
// }

// function listIPv4Interfaces(): NetIf[] {
//   const interfaces = os.networkInterfaces();
//   const result: NetIf[] = [];

//   for (const [name, addrs] of Object.entries(interfaces)) {
//     for (const addr of addrs ?? []) {
//       if (
//         addr.family === 'IPv4' &&
//         !addr.internal &&
//         addr.address &&
//         addr.netmask
//       ) {
//         result.push({
//           name,
//           address: addr.address,
//           netmask: addr.netmask,
//           cidr: addr.cidr,
//         });
//       }
//     }
//   }

//   return result;
// }

// function hostsInSubnet(
//   address: string,
//   netmask: string,
//   maxHosts: number
// ): string[] {
//   const ip = ipToInt(address);
//   const mask = ipToInt(netmask);
//   const network = ip & mask;
//   const broadcast = network | (~mask >>> 0);

//   const total = broadcast - network - 1;

//   if (total <= 0) {
//     return [];
//   }

//   if (total > maxHosts) {
//     console.warn(
//       `跳过过大的网段 ${intToIp(network)}/${netmask}，host 数约 ${total}，可用 --max-hosts 调大限制`
//     );
//     return [];
//   }

//   const ips: string[] = [];

//   for (let n = network + 1; n < broadcast; n++) {
//     const ipStr = intToIp(n >>> 0);

//     if (ipStr !== address) {
//       ips.push(ipStr);
//     }
//   }

//   return ips;
// }

// async function ping(ip: string, timeoutMs: number): Promise<boolean> {
//   const platform = process.platform;

//   let args: string[];

//   if (platform === 'win32') {
//     args = ['-n', '1', '-w', String(timeoutMs), ip];
//   } else if (platform === 'darwin') {
//     args = ['-c', '1', '-W', String(Math.ceil(timeoutMs / 1000)), ip];
//   } else {
//     args = ['-c', '1', '-W', String(Math.ceil(timeoutMs / 1000)), ip];
//   }

//   try {
//     await execFileAsync('ping', args, {
//       timeout: timeoutMs + 1000,
//     });
//     return true;
//   } catch {
//     return false;
//   }
// }

// async function warmArpTable(
//   ips: string[],
//   concurrency: number,
//   timeoutMs: number
// ): Promise<void> {
//   const limit = pLimit(concurrency);

//   await Promise.all(
//     ips.map((ip) =>
//       limit(async () => {
//         await ping(ip, timeoutMs);
//       })
//     )
//   );
// }

// async function readArpTable(): Promise<Array<{ ip: string; mac: string }>> {
//   const platform = process.platform;

//   if (platform === 'linux') {
//     try {
//       const { stdout } = await execFileAsync('ip', ['neigh', 'show']);
//       return parseIpNeigh(stdout);
//     } catch {
//       const { stdout } = await execFileAsync('arp', ['-a']);
//       return parseArpA(stdout);
//     }
//   }

//   const { stdout } = await execFileAsync('arp', ['-a']);
//   return parseArpA(stdout);
// }

// function normalizeMac(mac: string): string {
//   return mac.trim().replace(/-/g, ':').toLowerCase();
// }

// function isValidMac(mac: string): boolean {
//   return (
//     /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/.test(mac) &&
//     mac !== '00:00:00:00:00:00' &&
//     mac !== 'ff:ff:ff:ff:ff:ff'
//   );
// }

// function parseIpNeigh(text: string): Array<{ ip: string; mac: string }> {
//   const rows: Array<{ ip: string; mac: string }> = [];

//   for (const line of text.split(/\r?\n/)) {
//     const ipMatch = line.match(/^(\d+\.\d+\.\d+\.\d+)\s/);
//     const macMatch = line.match(/\blladdr\s+([0-9a-fA-F:]{17})\b/);

//     if (!ipMatch || !macMatch) {
//       continue;
//     }

//     const mac = normalizeMac(macMatch[1]);

//     if (isValidMac(mac)) {
//       rows.push({
//         ip: ipMatch[1],
//         mac,
//       });
//     }
//   }

//   return rows;
// }

// function parseArpA(text: string): Array<{ ip: string; mac: string }> {
//   const rows: Array<{ ip: string; mac: string }> = [];

//   for (const line of text.split(/\r?\n/)) {
//     const ipMatch = line.match(/(\d+\.\d+\.\d+\.\d+)/);
//     const macMatch = line.match(/([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}/);

//     if (!ipMatch || !macMatch) {
//       continue;
//     }

//     const mac = normalizeMac(macMatch[0]);

//     if (isValidMac(mac)) {
//       rows.push({
//         ip: ipMatch[1],
//         mac,
//       });
//     }
//   }

//   return rows;
// }

// async function reverseHostname(ip: string): Promise<string | undefined> {
//   try {
//     const names = await dns.reverse(ip);
//     return names?.[0];
//   } catch {
//     return undefined;
//   }
// }

// function guessModelFromHostname(hostname?: string): string | undefined {
//   if (!hostname) {
//     return undefined;
//   }

//   return hostname
//     .replace(/\.local\.?$/i, '')
//     .replace(/\.(lan|home|arpa)\.?$/i, '')
//     .replace(/[-_]+/g, ' ')
//     .trim();
// }

// function classifyByName(hostname?: string): {
//   maybePhone: boolean;
//   phoneScore: number;
//   reasons: string[];
//   guessedModel?: string;
// } {
//   const name = hostname?.toLowerCase() ?? '';

//   if (!name) {
//     return {
//       maybePhone: false,
//       phoneScore: 0,
//       reasons: [],
//     };
//   }

//   const matchedKeywords = PHONE_NAME_KEYWORDS.filter((keyword) =>
//     name.includes(keyword)
//   );

//   if (matchedKeywords.length === 0) {
//     return {
//       maybePhone: false,
//       phoneScore: 0,
//       reasons: [],
//     };
//   }

//   return {
//     maybePhone: true,
//     phoneScore: 80,
//     reasons: [`hostname 命中手机关键词：${matchedKeywords.join(', ')}`],
//     guessedModel: guessModelFromHostname(hostname),
//   };
// }

// async function scanInterface(
//   iface: NetIf,
//   options: {
//     maxHosts: number;
//     concurrency: number;
//     timeoutMs: number;
//     hostname: boolean;
//   }
// ): Promise<Device[]> {
//   const ips = hostsInSubnet(iface.address, iface.netmask, options.maxHosts);

//   console.error(
//     `扫描网口 ${iface.name} ${iface.address}/${iface.netmask}，目标 ${ips.length} 个 IP...`
//   );

//   await warmArpTable(ips, options.concurrency, options.timeoutMs);

//   const arpRows = await readArpTable();
//   const ipSet = new Set([...ips, iface.address]);

//   const rows = arpRows.filter((row) => ipSet.has(row.ip));

//   const unique = new Map<string, { ip: string; mac: string }>();

//   for (const row of rows) {
//     unique.set(`${row.ip}-${row.mac}`, row);
//   }

//   const limit = pLimit(32);

//   const devices = await Promise.all(
//     [...unique.values()].map((row) =>
//       limit(async (): Promise<Device> => {
//         const hostname = options.hostname
//           ? await reverseHostname(row.ip)
//           : undefined;

//         const cls = classifyByName(hostname);

//         return {
//           iface: iface.name,
//           ip: row.ip,
//           mac: row.mac,
//           hostname,
//           ...cls,
//         };
//       })
//     )
//   );

//   return devices.sort((a, b) => ipToInt(a.ip) - ipToInt(b.ip));
// }

// function printTable(devices: Device[], onlyPhones: boolean): void {
//   const filtered = onlyPhones
//     ? devices.filter((device) => device.maybePhone)
//     : devices;

//   const rows = filtered.map((device) => ({
//     iface: device.iface,
//     ip: device.ip,
//     mac: device.mac ?? '',
//     hostname: device.hostname ?? '',
//     phone: device.maybePhone ? `yes(${device.phoneScore})` : `no(${device.phoneScore})`,
//     model: device.guessedModel ?? '',
//     reason: device.reasons.join('; '),
//   }));

//   console.table(rows);
// }

// async function main(): Promise<void> {
//   const program = new Command();

//   program
//     .option('--iface <name>', '只扫描指定网口名')
//     .option('--max-hosts <n>', '单个网口最大扫描 host 数，防止误扫大网段', '1024')
//     .option('--concurrency <n>', '并发 ping 数', '128')
//     .option('--timeout-ms <n>', '单个 ping 超时毫秒数', '700')
//     .option('--no-hostname', '不做反向 DNS hostname 查询')
//     .option('--phones-only', '只输出疑似手机')
//     .option('--json', 'JSON 输出')
//     .parse(process.argv);

//   const opts = program.opts<{
//     iface?: string;
//     maxHosts: string;
//     concurrency: string;
//     timeoutMs: string;
//     hostname: boolean;
//     phonesOnly?: boolean;
//     json?: boolean;
//   }>();

//   let ifaces = listIPv4Interfaces();

//   if (opts.iface) {
//     ifaces = ifaces.filter((iface) => iface.name === opts.iface);
//   }

//   if (ifaces.length === 0) {
//     console.error('没有找到可扫描的 IPv4 网口');
//     process.exit(1);
//   }

//   console.error('发现网口：');

//   for (const iface of ifaces) {
//     console.error(
//       `- ${iface.name}: ${iface.address} netmask=${iface.netmask} cidr=${iface.cidr ?? ''}`
//     );
//   }

//   const allDevices: Device[] = [];

//   for (const iface of ifaces) {
//     const devices = await scanInterface(iface, {
//       maxHosts: Number(opts.maxHosts),
//       concurrency: Number(opts.concurrency),
//       timeoutMs: Number(opts.timeoutMs),
//       hostname: opts.hostname,
//     });

//     allDevices.push(...devices);
//   }

//   const dedup = new Map<string, Device>();

//   for (const device of allDevices) {
//     dedup.set(`${device.ip}-${device.mac ?? ''}-${device.iface}`, device);
//   }

//   const result = [...dedup.values()].sort((a, b) => {
//     const ifaceCompare = a.iface.localeCompare(b.iface);

//     if (ifaceCompare !== 0) {
//       return ifaceCompare;
//     }

//     return ipToInt(a.ip) - ipToInt(b.ip);
//   });

//   const finalResult = opts.phonesOnly
//     ? result.filter((device) => device.maybePhone)
//     : result;

//   if (opts.json) {
//     console.log(JSON.stringify(finalResult, null, 2));
//   } else {
//     printTable(result, Boolean(opts.phonesOnly));
//   }
// }

// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });
