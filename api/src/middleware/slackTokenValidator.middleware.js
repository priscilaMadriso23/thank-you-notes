const _ = require('lodash');

const isValidToken = (token) => {
  const list = _.split(process.env.TOKEN, ',');
  return _.includes(list, token);
};

exports.tokenValidator = (req, res, next) => {
  const { body, headers } = req;
  const token = _.get(body, 'token', _.get(headers, 'token'));
  if (token && isValidToken(token)) {
    next();
  } else {
    res.status(401).jsonp({ success: false, message: 'Unauthorized' });
  }
};

exports.formTokenValidator = (req, res, next) => {
  const { body } = req;
  const { payload } = body;
  const { token } = JSON.parse(payload);
  if (token && isValidToken(token)) {
    next();
  } else {
    res.status(401).jsonp({ success: false, message: 'Unauthorized' });
  }
};
