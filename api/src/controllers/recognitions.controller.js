const _ = require('lodash');
const { balanceOf } = require('../contracts/ThankYouNoteContract');

exports.recognitions = async (req, res) => {
  const { body } = req;
  const { user_name } = body;
  const status = await balanceOf(user_name);
  const fields = [
    {
      title: 'TYN Sent',
      value: status.sent,
      short: true,
    },
    {
      title: 'TYN Received',
      value: status.received,
      short: true,
    },
  ];
  const attachments = [{ fields }];
  res.status(200).json({ attachments });
};
