var passport = require('passport');
const PredixStrategy = require('passport-predix-oauth').Strategy;
const OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy;
const config = require('./predix-config');
const request = require('request');
var predixStrategy;

function configurePassportStrategy(predixConfig) {
  'use strict';

  var refreshStrategy = new OAuth2RefreshTokenStrategy({
    refreshWindow: 10, // Time in seconds to perform a token refresh before it expires
    userProperty: 'ticket', // Active user property name to store OAuth tokens
    authenticationURL: '/', // URL to redirect unathorized users to
    callbackParameter: 'callback' //URL query parameter name to pass a return URL
  });

  passport.use('main', refreshStrategy);

	passport.serializeUser(function(user, done) {
		// console.log("From USER-->"+JSON.stringify(user));
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	predixStrategy = new PredixStrategy({
		clientID: config.clientId,
		clientSecret: config.clientSecret,
		callbackURL: config.callbackURL,
		uaaURL: config.uaaURL
	},
	function(accessToken, refreshToken, user, done) {
			request({
				method: 'post',
				url: config.uaaURL + '/check_token',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Basic ' + Buffer.from(config.clientId + ':' + config.clientSecret).toString('base64')
				},
				form: {
					'token': accessToken
				}
			}, function(error, response, body) {
				user.ticket = user.ticket? user.ticket : {};
				user.ticket.access_token = accessToken;
				user.ticket.refresh_token = refreshToken;

				var userinfo = JSON.parse(body);

				if (error || userinfo.error !== undefined) {
					// return an error, don't forget this step
				} else {
					// Merge existing parsed user data with UAA userinfo data
					// into a existing user
					for (var key in userinfo) {
						if (userinfo.hasOwnProperty(key)) {
							user[key] = userinfo[key];
						}
					}
				}
				// console.log("User" + JSON.stringify(user))
				done(null, user);
		});
	}
);

	passport.use(predixStrategy);
	//Register the OAuth strategy to perform OAuth2 refresh token workflow
	refreshStrategy.useOAuth2Strategy(predixStrategy);

  return passport;
}

function reset() {
  'use strict';
  predixStrategy.reset();
}

module.exports = {
  configurePassportStrategy: configurePassportStrategy,
  reset: reset
};