/**
 * Debug Extension module (based on github.com/visionmedia/debug)
 */

exports = module.exports = logger.logger = logger;
exports.load = load;
exports.logs = [];
exports.enable = enable;
exports.enabled = enabled;

// Example
// $ LOG=app node main.js  (only local)
// $ LOG=gray node main.js (only graylog2)
// $ LOG=app,gray node main.js
function logger(namespace, source) {
  var target = [exports.enabled(namespace), exports.enabled('gray')];

  var local = disabled;
  var web   = disabled;

  if (target[0]) {
    var debug = require('debug');
    local = debug(namespace);
  }

  if (target[1]) {
    var graylog2 = require('graylog2');
    var client = new graylog2.graylog({
      servers: [{'host': '192.168.0.190', port: 12202}],
      hostname: source,
      facility: namespace
    });

    web = {
      info: client.info.bind(client),
      warn: client.warning.bind(client),
      error: client.error.bind(client),
      debug: client.debug.bind(client)
    };
  }

  function graylog(msg, level) {
    if (typeof web === 'function') {
      return;
    }

    if (typeof level === 'undefined') {
      return web.info(msg);
    }

    web[level](msg);
  }

  function disabled() {
  }

  function enabled() {
    local(arguments[0]);
    graylog(arguments[0], arguments[1]);
  }

  var fn = (exports.enabled(namespace) || exports.enabled('gray')) ? enabled : disabled;

  return fn;
}

function enable(logs) {
  if (typeof logs !== undefined) {
    process.env.DEBUG = logs;
  }

  var split = (logs || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    logs = split[i].replace(/[\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*?');
    exports.logs.push(new RegExp('^' + logs + '$'));
  }
}

function enabled(log) {
  var i, len;
  for (i = 0, len = exports.logs.length; i < len; i++) {
    if (exports.logs[i].test(log)) {
      return true;
    }
  }
  return false;
}

function load() {
  return process.env.LOG;
}

exports.enable(load());
