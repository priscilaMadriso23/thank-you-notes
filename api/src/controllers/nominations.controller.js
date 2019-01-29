const _ = require('lodash');
const { getUserFromTextMessage, getEmailByReference } = require('../utils/messageUtils');
const { getBotToken } = require('../utils/tokenUtils');
const nominateForm = require('../forms/nominate.form.json');
const { call } = require('../utils/fetchHandler');
const { sendMail } = require('../utils/mailUtils');

exports.nominate = async (req, res) => {
  const { body } = req;
  const { user_name, team_domain, text, trigger_id } = body;
  try {
    const nominee = getUserFromTextMessage(text);
    nominateForm.state = nominee;
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

exports.submit = async (req, res) => {
  const { payload } = req.body;
  const { submission, user, state, team } = JSON.parse(payload);
  const { domain } = team;
  const userProfile = await getEmailByReference(user.id, domain);
  submission.nominee = await getEmailByReference(state, domain);
  sendMail(submission, userProfile);
  res.status(200).json({ text: 'Nomination sent, thanks!' });
};
