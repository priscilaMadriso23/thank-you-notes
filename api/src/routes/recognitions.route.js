const express = require('express');
const { recognitions } = require('../controllers/recognitions.controller');

const router = express.Router();

/**
 * Gets the accumulated recognitions
 * POST /recognitions
 * body: {
 *  user_name,
 *  text
 * }
 */
router.post('/', recognitions);

module.exports = router;
