const _ = require('lodash');

const config = require('../config/config.json');

exports.getBotToken = (team_domain) => {
  return _.get(config, `${team_domain}.botToken`, '');
};
