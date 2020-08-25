# timezone

Generates a `shields.io` style badge based on a source datetime and timezone in your local timezone, as returned from a geo-ip lookup.

## Config

* Runs on port defined by `PORT` environment variable, default 3002.
* Respects `x-forwarded-for` header for reverse proxies.

## Routes

* `/tz` - generate badge
    * query parameter `d` - the date-time of the appointment/meeting
    * query parameter `tz` - the timezone locale (e.g. `America/Los_Angeles`)
    * query parameter `city` - if set, city information is included if known
* `/tz/status` - show uptime and number of badges generated
* `/tz/hdrs` - show client headers for debugging
