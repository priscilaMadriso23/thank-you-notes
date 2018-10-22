const _ = require('lodash');

const isValidToken = (token) => {
  const list = _.split(process.env.TOKEN, ',');
  return _.includes(list,token);
}

exports.tokenValidator = (req, res, next) => {
  const { body } = req;
  const { token } = body;
  if (token && isValidToken(token)) {
    next();
  } else {
    res.status(401).jsonp({ success: false, message: 'Unauthorized' });
  }
};
