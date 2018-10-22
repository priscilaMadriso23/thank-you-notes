const _ = require('lodash');
const { balanceOf } = require('../contracts/ThankYouNoteContract');

exports.recognitions = async (req, res) => {
  const { body } = req;
  const { user_name } = body;
  const status = await balanceOf(user_name);
  const text = `Thanks Sent: ${status.sent}
  Thanks Received: ${status.received}`;
  res.status(200).json({ text });
};
