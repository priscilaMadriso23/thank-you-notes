const express = require('express');
const { recognitions } = require('../controllers/recognitions.controller');
const { tokenValidator } = require('../middleware/slackTokenValidator.middleware');

const router = express.Router();

/**
 * Gets the accumulated recognitions
 * POST /recognitions
 * body: {
 *  user_name,
 *  text
 * }
 */
router.post('/', tokenValidator, recognitions);

module.exports = router;
