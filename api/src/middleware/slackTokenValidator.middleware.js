exports.tokenValidator = (req, res, next) => {
  const { body } = req;
  const { token } = body;
  if (token && (token === process.env.TOKEN)) {
    next();
  } else {
    res.status(401).jsonp({ success: false, message: 'Unauthorized' });
  }
};
