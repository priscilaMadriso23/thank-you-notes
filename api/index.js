const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const thanks = require('./src/routes/thanks.route');
const recognitions = require('./src/routes/recognitions.route');
const nominations = require('./src/routes/nominations.route');

const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use('/thanks', thanks);
app.use('/recognitions', recognitions);
app.use('/nominate', nominations);

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

module.exports = app;
