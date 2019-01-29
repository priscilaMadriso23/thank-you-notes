const { splitTextMessage } = require('../utils/messageUtils');
const { thanks, getThanksHistory } = require('../contracts/ThankYouNoteContract');
const { call } = require('../utils/fetchHandler');
const config = require('../config/config.json');

exports.thanks = (req, res) => {
  const { body } = req;
  const { user_name, text, team_domain } = body;
  try {
    const { username, message } = splitTextMessage(text);
    const { hook } = config[team_domain];
    thanks(team_domain, user_name, username, message)
      .then(() => {
        const attachments = [{ title: 'Thank You Note', text: message }];
        call({
          endpoint: 'slackHooks',
          url: hook,
          body: { text: `<@${username}> just received 1 TYN :tyn: from <@${user_name}> !`, attachments },
        });
      });
    res.status(200).json({ text: `1 TYN :tyn: sent to <@${username}> !` });
  } catch (error) {
    res.status(200).json({ text: error.message });
  }
};

exports.getThanksHistory = (req, res) => {
  try {
    getThanksHistory()
      .then((list) => {
        res.status(200).json(list);
      });
  } catch (error) {
    res.status(200).json({ text: error.message });
  }
};
