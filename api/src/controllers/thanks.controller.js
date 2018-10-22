const { splitTextMessage } = require('../utils/messageUtils');
const { thanks } = require('../contracts/ThankYouNoteContract');
const { call } = require('../utils/fetchHandler');

exports.thanks = (req, res) => {
  const { body } = req;
  const { user_name, text, team_domain } = body;
  try {
    const { username, message } = splitTextMessage(text);
    thanks(team_domain, user_name, username, message)
      .then(() => {
        call({
          endpoint: team_domain,
          body: { text: `<@${username}> just received 1 TYN !` },
        });
      });
    res.status(200).json({ text: `1 TYN sent to <@${username}> !` });
  } catch (error) {
    res.status(200).json({ text: error.message });
  }
};
