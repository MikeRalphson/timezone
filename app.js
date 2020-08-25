const crypto = require('crypto');

const koa = require('koa');
const Router = require('@koa/router');
const geoip = require('geoip-lite');
const moment = require('moment-timezone');
const shields = require('badge-maker').makeBadge;

const app = new koa();
const router = new Router();

const stats = { badges: 0, startTime: new Date() };

function md5(s) {
  const md5sum = crypto.createHash('md5');
  md5sum.update(s);
  return md5sum.digest('hex');
}

router.get('/tz', (ctx, next) => {
  let clientIP = ctx.request.headers['x-forwarded-for'] || ctx.request.ip;
  const date = ctx.request.query.d ? ctx.request.query.d : new Date().toLocaleString();
  const timezone = ctx.request.query.tz || 'Europe/London';
  const source = moment.tz(date,timezone);
  let geo = geoip.lookup(clientIP);
  if (!geo) geo = geoip.lookup('2a00:23c6:3605:9000:7fd7:9e60:5cb4:ccea');
  const target = moment.tz(source,geo.timezone);
  // TODO set colour based on hour of day
  let colour = 'green';
  const hour = target.hour();
  if (hour >= 18 || hour < 9) colour = 'yellow';
  if (hour >= 22 || hour < 7) colour = 'red';
  let tzStr = geo.timezone;
  if (ctx.request.query.city && geo.city) {
    tzStr += ` (${geo.city})`;
  }
  if (ctx.request.query.ip) {
    tzStr += ` (${clientIP})`;
  }
  const format = { label: '🕓 '+tzStr, message: target.toString(), color: colour };
  ctx.set('Content-Type','image/svg+xml');
  const etag = '"'+md5(JSON.stringify({ source, timezone: geo.timezone }))+'"';
  ctx.set('ETag',etag);
  ctx.set('Cache-Control','no-cache');
  ctx.body = shields(format);
  stats.badges++;
});

router.get('/tz/status', (ctx, next) => {
  ctx.body = stats;
});

router.get('/tz/hdrs', (ctx, next) => {
  ctx.body = ctx.request.headers;
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(process.env.PORT || 3002);
