'use strict';

const express = require('express');
const app = express();
const port = 3000;

const favicon = require('serve-favicon');
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('\x1b[36m:remote-addr :method :url \x1b[31m:status\x1b[37m  ---  :user-agent')); // log requests
app.use(bodyParser.urlencoded());
app.use(bodyParser.json()); // get information from HTML forms
//app.use(favicon(__dirname + '/public/images/favicon.ico')); // app icon
app.use(express.static('public')); // make public folder available to app

app.set('view engine', 'ejs'); // set up ejs for templating
 
require('./routes.js')(app); // load routes

app.listen(port); // launch
console.log('Listening on port \x1b[36m' + port + '\x1b[37m');