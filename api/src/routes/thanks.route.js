const express = require('express');
const { thanks, getThanksHistory } = require('../controllers/thanks.controller');
const { tokenValidator } = require('../middleware/slackTokenValidator.middleware');

const router = express.Router();

/**
 * Sends a thank you note to an user
 * POST /thanks
 * body: {
 *  user_name,
 *  text
 * }
 */
router.post('/', tokenValidator, thanks);

/**
 * Returns a thank you note list
 * GET /thanks
 */
router.get('/', tokenValidator, getThanksHistory);

module.exports = router;
