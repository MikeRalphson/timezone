const geoip = require('geoip-lite');

if (process.argv[2]) {
  console.log(geoip.lookup(process.argv[2]));
}
else {
  console.warn('Usage: test.js {IP-address}');
}
