const _ = require('lodash');
const { getUserFromTextMessage } = require('../utils/messageUtils');
const { getBotToken } = require('../utils/tokenUtils');
const nominateForm = require('../forms/nominate.form.json');
const { call } = require('../utils/fetchHandler');
const { sendMail }= require('../utils/mailUtils');

exports.nominate = async (req, res) => {
  const { body } = req;
  const { user_name, team_domain, text, trigger_id } = body;
  const nominee = getUserFromTextMessage(text);
  const botToken = getBotToken(team_domain);
  call({
    endpoint: 'slack',
    url: 'api/dialog.open',
    headers: {
      Authorization: `Bearer ${botToken}`,
    },
    body: {
      trigger_id,
      dialog: JSON.stringify(nominateForm),
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
  const { submission } = req.body;
  sendMail(submission.category,submission.project,submission.situation,submission.impact,submission.behavior,submission.nominee,'Test');
  res.send('');
};
