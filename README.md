# Node Box SDK [![Build Status](https://travis-ci.org/adityamukho/node-box-sdk.svg?branch=master)](https://travis-ci.org/adityamukho/node-box-sdk) [![Code Climate](https://codeclimate.com/github/adityamukho/node-box-sdk.png)](https://codeclimate.com/github/adityamukho/node-box-sdk) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![Npm Downloads](https://nodei.co/npm/box-sdk.png?downloads=true&stars=true)](https://www.npmjs.org/package/box-sdk)

Node.js client for the [Box.com Content API](https://developers.box.com/docs/).

**This is now a beta release. Tests include the bundled integration tests, and a CLI application (under construction) that relies on this SDK.**

## Supported Features
* All File Ops
* All Folder Ops
* Events - Long Polling

The SDK aims to abstract away the intricacies of authentication, refreshing tokens, etc. as far as possible. Hence, you will not find explicit methods to perform low-level operations.

All legitimate public methods map to the high level functionality described in the [Content API docs](https://developers.box.com/docs/).

## Getting Started
Install the module with: `npm install box-sdk`

### Running _Standalone_

```javascript
var box_sdk = require('box-sdk');

//Default host: localhost
var box = box_sdk.Box({
  client_id: 'client id',
  client_secret: 'client secret',
  port: 9999,
  host: 'somehost', //default localhost
  log-level: 'debug' //default info
});
var connection = box.getConnection('some.email@example.com');

//Navigate user to the auth URL
console.log(connection.getAuthURL());

connection.ready(function () {
  connection.getFolderItems(0, {limit: 1}, function (err, result) {
    if (err) {
      console.error(JSON.stringify(err.context_info));
    }
    console.dir(result);
  });
});
```

### Running with Passport authentication under Express
**Note:** For a complete express example, look under `test/helpers/express`.
```javascript
var express = require('express'),
  passport = require('passport'),
  BoxStrategy = require('passport-box').Strategy,
  box_sdk = require('../../..');

...

var box = box_sdk.Box();

...

passport.use(new BoxStrategy({
  clientID: BOX_CLIENT_ID,
  clientSecret: BOX_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:" + PORT + "/auth/box/callback"
}, box.authenticate()));

...

var app = express();

...

app.get('/auth/box', passport.authenticate('box'), function (req, res) {});

app.get('/auth/box/callback',
  passport.authenticate('box', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    res.redirect('/');
  });
```

### Long Polling
```javascript
var connection = box.getConnection('some.email@example.com');

//Navigate user to the auth URL
console.log(connection.getAuthURL());

connection.ready(function () {
  connection.startLongPolling();

  //Monologue subscription filter to catch all polling events
  connection.on('polling.event.#', function (data) {
    console.log('Received event: %s', data.event_type);

    //Handle event
    ...
  });
  connection.on('polling.end', function() {
    //Continue with post-polling ops
    ...
  });
  connection.on('polling.error', function (err) {
    console.error(err);
  });

  //Conquer the universe, etc
  ...

  //In some block later...
  //connection.stopLongPolling();
};
```

### Testing
Before running your tests locally, copy `test/env.json.example` to `test/env.json` and fill in correct values for the environment variables to be imported during testing.

The `casperjs` and `phantomjs` executables must be available in the enviroment path. Usually it is enough to run:
```bash
$ (sudo) npm install -g phantomjs
$ (sudo) npm install -g casperjs
```

Run all tests with:
```bash
$ grunt mochaTest
```

The files under `test/integration` are completely self-contained, and hence can be run independently. For example:
```bash
$ grunt mochaTest --target=./test/integration/api/content/folders-test.js
```

## Documentation
API documentation is generated by running:
```bash
$ grunt jsdoc
```
The generated documentation is available in the `dist/docs` folder. An up-to-date online version is hosted at http://adityamukho.github.io/node-box-sdk/ .

## Examples
Complete tutorials will soon be added to the documentation. In the meantime, have a look at the included test cases to get an idea of how the SDK is used.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014-2015 Aditya Mukhopadhyay

Licensed under the MIT license.
