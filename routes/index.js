'use strict'

const express = require('express');
const { UserMediaController, MercadoPagoController } = require("../controllers");

//dependencia para responder como rest
const api = express.Router();

// api.get('/authImageKit', UserMediaController.authImageKit);
// api.post('/mercadoPago', MercadoPagoController.isPayed);

module.exports = api;