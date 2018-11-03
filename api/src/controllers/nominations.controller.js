const _ = require('lodash');
const { getUserFromTextMessage } = require('../utils/messageUtils');
const nominateForm = require('../forms/nominate.form.json');

exports.nominate = async (req, res) => {
  const { body } = req;
  const { user_name, team_domain, text, trigger_id } = body;
  const nominee = getUserFromTextMessage(text);
  call({
    endpoint: 'slack',
    url: 'dialog.open',
    body: {
      trigger_id,
      dialog: nominateForm,
    }
  })
    .then((result) => {
      console.log('dialog.open', result);
      res.send('');
    }).catch((err) => {
      console.log('dialog.open call failed', err);
      res.sendStatus(500);
    });
};

exports.submit = (req, res) => {
  const body = JSON.parse(req.body.payload);
  console.log('form submit', body);
  // immediately respond with a empty 200 response to let
  // Slack know the command was received
  res.send('');
};
