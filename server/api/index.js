/* eslint-disable */
var express = require('express');
var photoRoutes = require('./photos');

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.get('/photos', photoRoutes);

module.exports = {
  apiRoutes: apiRoutes
};
