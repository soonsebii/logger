# logger
Debug extension module (This is based on @visionmedia's [debug](https://github.com/visionmedia/debug))
- debug
- graylog2

## Installation
```sh
$ npm install https://github.com/soonsebii/logger.git
```

## Example
```js
var logger = require('logger');
var debug = logger('main');

debug('Hello world', 'info');
```

```sh
$ LOG=main node example.js       // only console
$ LOG=gray node example.js       // only server
$ LOG=gray,main node example.js  // mixed
```

## Todo
- [ ] config - graylog2

## License
MIT
