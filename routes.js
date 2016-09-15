const http = require('http');

'use strict';
const https = require('https');

module.exports = function (app) {

    app.get('/', require('./routes/index.js'));
};