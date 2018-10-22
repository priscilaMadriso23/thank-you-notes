const _ = require('lodash');

/**
 * Split the text into two strings
 * https://api.slack.com/slash-commands
 */
exports.splitTextMessage = (text) => {
  const split = _.split(text, ' ');
  let username = _.get(split, '[0]', '');
  const message = _.get(split, '[1]');
  if (_.isEmpty(username) || !_.startsWith(username, '@')) {
    throw new Error('Please specify an user');
  }
  if (!message) {
    throw new Error('Please include a short message');
  }
  username = _.replace(username, '@', '');
  return { username, message };
};
