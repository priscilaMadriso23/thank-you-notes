'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const thanks = require('./src/routes/thanks.route');
const recognitions = require('./src/routes/recognitions.route');

const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use('/thanks', thanks);
app.use('/recognitions', recognitions);

app.get('/', (req, res) => {
  res.status(200).json({ success: true });
});

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});

module.exports = app;
