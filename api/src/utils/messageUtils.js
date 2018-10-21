const _ = require('lodash');

const users = [];

const exists = (user_name) => {
  const result = _.filter(users, { user_name });
  return !_.isEmpty(result);
}

const register = (user_name) => {
  if (!exists(user_name)) {
    users.push({
      user_name,
      thanks: [],
      nominations: [],
      thanksSent: 0,
      nominationsSent: 0
    });
  }
}

exports.getUser = (user_name) => {
  if (!exists(user_name)) {
    register(user_name);
  }
  return _.first(_.filter(users, { user_name }));
}

exports.splitTextMessage = (text) => {
  const split = _.split(text, ' ');
  let username = _.get(split, '[0]');
  const message = _.get(split, '[1]');
  if (!username || !text) {
    throw new Error('Invalid user or text');
  }
  username = _.replace(username, '@', '');
  return { username, message };
}
