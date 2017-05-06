/* eslint-disable */
var express = require('express');

// get an instance of the router for api routes
var photoRoutes = express.Router();

photoRoutes.get('/getPhotos', function(request, response) {
  var queryParams = request.url.split('?');
	// parse the token and verifier from the query string returned by Flickr
	var paramObj = querystring.parse(queryParams[1]);

	if (!paramObj['token'] || !oauthHash[paramObj['token']]) {
		// return unauthorized
		return response.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
	}
	flickrSDK
	// make the request with the access token and secret
	.request(paramObj['token'], oauthHash[paramObj['token']])
	.people('me')
	.media()
	.get()
	.then(function (responseData) {
		if (responseData.body && responseData.body.photos) {
			return response.send({
        data: responseData.body.photos
      });
		} else {
      return response.send({
        data: {
					error: 'i dunno happened'
				}
      });
    }
	}, function (err) {
    console.log('error', err);
    if (err.code === 98) {
      // token invalid, clear token
      delete oauthHash[paramObj['oauth_token']];
    }
		response.end(err.message);
	});
});

module.exports = {
  photoRoutes: photoRoutes
};
