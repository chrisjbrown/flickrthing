
// server.js
/* eslint-disable */
/**
 *
 * Node.js FlickrSDK Example
 *
 * This example gives you a sample of how the FlickrSDK can be
 * used on a Node.JS server to add authenticated calls to your application
 *
 * You can run the example by running `node examples/node.js` and then browsing
 * to http://localhost:8080/
 *
 */

var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var querystring = require('querystring');
var FlickrSDK = require('flickr-sdk');
var morgan = require('morgan')

// Initialize the FlickrSDK
var flickrSDK = new FlickrSDK({
	apiKey: '53ca24d7bb85eeff2cdab4714e695057', // your api key
	apiSecret: '550ed99b35ab95e5' // your api secret
});

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8090; // used to create, sign, and verify tokens

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route to show a login message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(request, response) {
  flickrSDK
	.request()
	.authentication()
	// Flickr will redirect to this URL when the user authorizes
	.prepareRequestToken('http://localhost:8090/authed')
	.then(function (data) {
		// save to token secret
		// response with a basic HTML page with login link for the user
		response.redirect(data.authorizationURL);
	}, function (resp) {
		response.end(resp);
	});
});

apiRoutes.get('/getPhotos', function(request, response) {
  var queryParams = request.url.split('?');
	// parse the token and verifier from the query string returned by Flickr
	var paramObj = querystring.parse(queryParams[1]);

	if (!paramObj['token']) {
		// return unauthorized
		return response.status(403).send({
        success: false,
        message: 'No token provided.' 
    });
	}
	flickrSDK
	// make the request with the access token and secret
	.request(paramObj['token'])
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
		response.end(err.message);
	});
});

app.get('/authed', function(request, response) {
  var queryParams = request.url.split('?');
	// parse the token and verifier from the query string returned by Flickr
	var paramObj = querystring.parse(queryParams[1]);

	if (!paramObj['oauth_token'] || !paramObj['oauth_verifier']) {
		// auth failed
		return response.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
	}

	flickrSDK
	.request()
	.authentication()
	.authenticateUser(paramObj['oauth_token'], oauthTokenSecret, paramObj['oauth_verifier'])
	.then(function (data) {

    console.log('auth data', data);
		
    console.log('return token');
    return response.send({
      success: true,
      message: 'Token received'
    });
	});
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
