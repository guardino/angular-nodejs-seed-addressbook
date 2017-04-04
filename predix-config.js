/*
This module reads config settings from localConfig.json when running locally,
  or from the VCAPS environment variables when running in Cloud Foundry.
*/

var settings = {};

// checking NODE_ENV to load cloud properties from VCAPS
// or development properties from config.json.
// These properties are not needed for fetching mock data.
// Only needed if you want to connect to real Predix services.
var node_env = process.env.node_env || 'development';
if(node_env === 'development') {
  // use localConfig file
	var devConfig = require('./localConfig.json').development;
	// console.log(devConfig);
	settings.clientSecret = devConfig.clientSecret;
	settings.clientId = devConfig.clientId;
	settings.uaaURL = devConfig.uaaURL;
	settings.tokenURL = devConfig.uaaURL;
	settings.appURL = devConfig.appURL;
	settings.callbackURL = devConfig.appURL + '/signin/callback';
	settings.redisStore = devConfig.redisStore;
	settings.redisStore.host = devConfig.redisStore.host;
	settings.redisStore.port = devConfig.redisStore.port;

} else {
	// read VCAP_SERVICES
	const vcapsServices = JSON.parse(process.env.VCAP_SERVICES);
	const uaaService = vcapsServices[process.env.uaa_service_label];
	const redisService = vcapsServices[process.env.redis_service_label];

	if(uaaService) {
    	settings.uaaURL = uaaService[0].credentials.uri;
		settings.tokenURL = uaaService[0].credentials.uri;
	}

	if(redisService) {
		settings.redisStore = redisService[0].credentials;
		settings.redisStore.host = redisService[0].credentials.host;
		settings.redisStore.password = redisService[0].credentials.password;
		settings.redisStore.port = redisService[0].credentials.port;
	}

	// read VCAP_APPLICATION
	var vcapsApplication = JSON.parse(process.env.VCAP_APPLICATION);
		settings.appURL = 'https://' + vcapsApplication.uris[0];
		settings.callbackURL = settings.appURL + '/signin/callback';
		settings.clientSecret = process.env.clientSecret;
		settings.clientId = process.env.clientId;
}
console.log('config settings: ' + JSON.stringify(settings));

// This vcap object is used by the proxy module.
settings.buildVcapObjectFromLocalConfig = function(config) {
	'use strict';
	// console.log('local config: ' + JSON.stringify(config));
	var vcapObj = {};
	if (config.uaaURL) {
		vcapObj['predix-uaa'] = [{
			credentials: {
				uri: config.uaaURL
			}
		}];
	}
	return vcapObj;
};

module.exports = settings;