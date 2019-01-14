const _ = require('lodash');
const { call } = require('./fetchHandler');
const { getBotToken } = require('../utils/tokenUtils');
const config = require('../config/config.json');
/**
 * Split the text into two strings
 * https://api.slack.com/slash-commands
 */
exports.splitTextMessage = (text) => {
  const split = _.split(text, ' ');
  let username = _.get(split, '[0]', '');
  let message = _.get(split, '[1]');
  if (_.isEmpty(username) || !_.startsWith(username, '@')) {
    throw new Error('Please specify a user');
  }
  if (!message) {
    throw new Error('Please include a short message');
  }
  username = _.replace(username, '@', '');
  message = _.join(_.slice(split, 1), ' ');
  return { username, message };
};

/**
 * Gets the user from text
 * https://api.slack.com/slash-commands
 */
exports.getUserFromTextMessage = (text) => {
  let username = _.trim(text);
  if (_.isEmpty(username) || !_.startsWith(username, '@')) {
    throw new Error('Please specify a user');
  }
  username = _.replace(username, '@', '');
  return username;
};

const getUserList = (team_domain) => {
  return call({
    endpoint: 'slack',
    url: `api/users.list?token=${config[team_domain].oauthToken}`,
  });
};

exports.getEmailByReference = async (reference, team_domain) => {
  return getUserList(team_domain)
    .then((response) => {
      return _.filter(response.members, (user) => {
        return user.id === reference || user.name === reference;
      });
    });
};
