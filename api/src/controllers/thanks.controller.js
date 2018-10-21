const { getUser, splitTextMessage } = require('../utils/messageUtils');

exports.thanks = (req, res) => {
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
};
