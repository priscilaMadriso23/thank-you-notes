'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const users = [];

const exists = (user_name) => {
  const result = _.filter(users, { user_name });
  return !_.isEmpty(result);
}

const register = (user_name) => {
  if (!exists(user_name)) {
    users.push({
      user_name,
      thanks: [],
      nominations: [],
      thanksSent: 0,
      nominationsSent: 0
    });
  }
}

const getUser = (user_name) => {
  if (!exists(user_name)) {
    register(user_name);
  }
  return _.first(_.filter(users, { user_name }));
}

const splitTextMessage = (text) => {
  const split = _.split(text, ' ');
  let username = _.get(split, '[0]');
  const message = _.get(split, '[1]');
  if (!username || !text) {
    throw new Error('Invalid user or text');
  }
  username = _.replace(username, '@', '');
  return { username, message };
}

app.get('/', (req, res) => {
  res.status(200).json(users);
});

app.post('/recognitions', (req, res) => {
  const { body } = req;
  const { user_name } = body;
  const user = getUser(user_name);
  const status = {
    thanksSent: user.thanksSent,
    thanksReceived: _.size(user.thanks),
    nominationsSent: user.nominationsSent,
    nominationsReceived: _.size(user.nominations),
  }
  const text = `Thanks Sent: ${status.thanksSent}
  Thanks Received: ${status.thanksReceived}
  Nominations Sent: ${status.nominationsSent}
  Nominations Received: ${status.nominationsReceived}`;
  res.status(200).json({ text });
});

app.post('/nominate', (req, res) => {
  thanks.push({ body: req.body });
  res.status(200).json({ text: "Thank you note sent!" });
});

app.post('/thanks', (req, res) => {
  const { body } = req;
  const { user_name, text } = body;
  try {
    const thanksFrom = getUser(user_name);
    const { username, message } = splitTextMessage(text);
    const thanksTo = getUser(username);
    thanksFrom.thanksSent++;
    thanksTo.thanks.push({ user_name, message });
    res.status(200).json({ text: `Thank you note sent to <@${username}> !` });
  } catch (error) {
    res.status(200).json({ text: error.message });
  }
});

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});

