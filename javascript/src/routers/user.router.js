'use strict';
const express = require('express');
const { isLoggedIn } = require('../functions/status');
const { follow } = require('./user.control');

const router = express.Router();

// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);

module.exports = router;
