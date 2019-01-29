const express = require('express');
const { nominate, submit } = require('../controllers/nominations.controller');
const { tokenValidator, formTokenValidator } = require('../middleware/slackTokenValidator.middleware');

const router = express.Router();

/**
 * Sends anominate form
 * POST /nominate
 * body: {
 *  user_name,
 *  text
 * }
 */
router.post('/', tokenValidator, nominate);

/**
 * Submit a recognition
 * POST /nominate/submit
 */
router.post('/submit', formTokenValidator, submit);

module.exports = router;
