const _ = require('lodash');
const { getUser } = require('../utils/messageUtils');

exports.recognitions = (req, res) => {
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
};
