const _ = require('lodash');
const { getUserFromTextMessage } = require('../utils/messageUtils');
const { getBotToken } = require('../utils/tokenUtils');
const nominateForm = require('../forms/nominate.form.json');
const { call } = require('../utils/fetchHandler');
const { sendMail } = require('../utils/mailUtils');

exports.nominate = async (req, res) => {
  const { body } = req;
  const { user_name, team_domain, text, trigger_id } = body;
  try {
    const nominee = getUserFromTextMessage(text);
    console.log('nominee', nominee);
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
        state: nominee,
      },
    })
      .then((result) => {
        res.send('');
      }).catch((err) => {
        console.log('dialog.open call failed', err);
        res.sendStatus(500);
      });
  } catch (error) {
    res.status(200).json({ text: error.message });
  }
};

exports.submit = (req, res) => {
  const { payload } = req.body;
  console.log(req.body);
  const { submission, user } = JSON.parse(payload);
  sendMail(submission, user);
  res.send('');
};
