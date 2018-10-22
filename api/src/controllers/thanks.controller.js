const { splitTextMessage } = require('../utils/messageUtils');
const { thanks } = require('../contracts/ThankYouNoteContract');

exports.thanks = async (req, res) => {
  const { body } = req;
  const { user_name, text } = body;
  try {
    const { username, message } = splitTextMessage(text);
    await thanks(user_name, username, message);
    res.status(200).json({ text: `Thank you note sent to <@${username}> !` });
  } catch (error) {
    res.status(200).json({ text: error.message });
  }
};
