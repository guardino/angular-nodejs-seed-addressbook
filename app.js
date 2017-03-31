const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const request = require('request');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

var passport = require('passport');
const passportConfig = require('./passport-config');
const config = require('./predix-config');

const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const redisClient  = redis.createClient();

const appRoutes = require('./routes/app');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, PATCH, DELETE, OPTIONS');
    next();
});

passport = passportConfig.configurePassportStrategy();

app.use(session({  
  store: new RedisStore({
    url: config.redisStore.url,
    client: redisClient
  }),
  secret: config.redisStore.password,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
// Also use passport.session() middleware, to support persistent login sessions (recommended).
app.use(passport.session());

app.use('/', appRoutes);

app.get('/signin', passport.authenticate('predix', {'scope': ''}), function(req, res) {
    // The request will be redirected to Predix for authentication, so this
    // function will not be called.
});

app.get('/signin/callback', function(req, res, next) {
    passport.authenticate('predix', function(err, user, info) {
        if(err) { return next(err); }
        if(!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            res.cookie('token', user.ticket.access_token);
            redisClient.set('token', user.ticket.access_token, redis.print);
            // redisClient.get('token', redis.print)
            return res.redirect('/material');
        });
    })(req, res, next);
});

app.get('/logout', function(req, res) {
    if(req.session) {
        req.session.destroy();
    }
    req.logout();
    passportConfig.reset();
    res.redirect(config.uaaURL + '/logout?redirect=' + config.appURL);
})

app.get('/isauthenticated', function (req, res) {
    var token = req.query.token ? req.query.token : req.body.token;
    if(typeof token === 'undefined') {
        res.status = 401;
        return res.json('Can not find token.')
    }
    if(!config.clientId || !config.clientSecret) {
        res.status = 401;
        return res.json('Can not find client credentials.')
    }    
    
    const base64Credentials = Buffer.from(config.clientId + ':' + config.clientSecret).toString('base64');
    
    const headers = {
        'Content-Type'      :  'application/x-www-form-urlencoded',
        'Authorization'     :  'Basic ' + base64Credentials
    }

    const options = {
        url: config.uaaURL + '/check_token?token=' + token,
        method: 'POST',
        headers: headers
    }

    return request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return res.json({
                isAuthenticated : true,
                body : JSON.parse(body)
            })
        }
        return res.err(error);
    })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.render('index');
});


module.exports = app;
