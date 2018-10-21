const express = require('express');
const { thanks } = require('../controllers/thanks.controller');

const router = express.Router();

/**
 * Sends a thank you note to an user
 * POST /thanks
 * body: {
 *  user_name,
 *  text
 * }
 */
router.post('/', thanks);

module.exports = router;
