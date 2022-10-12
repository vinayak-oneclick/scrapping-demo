const { login, getInfo, terms, privacy } = require('../controller/rc.controller');
const express = require('express');
const route = express.Router();

route.get('/login', login);
route.post('/info/:vehiclenumber&:captcha&:windowHandle', getInfo);
route.get('/terms', terms);
route.get('/privacy', privacy);

module.exports = route;
