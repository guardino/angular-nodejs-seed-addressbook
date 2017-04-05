var express = require('express');
var session = require('express-session');
var router = express.Router();

const config = require('../predix-config');

const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const redisClient  = redis.createClient(config.redisStore);

redisClient.on('error', function(err){
    console.log('Error '+ err);
})

const defaultKey = 'defaultview';
const dataviewField = 'dataview';

/**
 * return an array of selected views like ["id", "name"]
 * 
 * if guest do not have their own dataview, using default one 
 * which is determined by admin thru /adminview api.
 */
router.get('/userview', function (req, res, next) {
    var username = req.query.username ? req.query.username.toString() : '';
    if(username == '') {
        return res.json({
            error: 'Not providing username'
        });
    }
    var UserView = '';
    if(
        redisClient.exists(username, dataviewField, function(err, reply){
            if(reply == 0)
                return false;
        })
    ){
        redisClient.hget(username, dataviewField, function(err, value) {
            if(err) {
                return res.json({ error: err })
            }
            res.json({
                dataview: value ? value.split(',') : ''
            })
        })
    } else {
        console.log('dataviewfield not exists')
        redisClient.hget(defaultKey, dataviewField, function(err, value) {
            if(err) {
                return res.json({ error: err })
            }
            res.json({
                dataview: value ? value.split(',') : ''
            })
        })
    }
    return res;
});

router.post('/userview', function(req, res, next) {
    var username = req.query.username ? req.query.username.toString() : '';
    var body = req.body.toString();
    console.log(body);
    if(username == '') {
        return res.json({
            error: 'Not providing username'
        });
    }
    var DefaultView = '';
    redisClient.hset(username, dataviewField, body);
    return res.json({ message : 'User' + username + ' view updated' });
})

router.get('/defaultview', function(req, res, next) {
    redisClient.hget(defaultKey, dataviewField, function(err, value) {
        if(err) { return res.json({ error: err }) }
        res.json({
            dataview: value ? value.split(',') : ''
        })
    });
    return res;
})

router.post('/defaultview', function(req, res, next) {
    var username = req.query.username ? req.query.username.toString() : '';
    var body = req.body.toString();
    if(username == '') {
        return res.json({
            error: 'Not providing username'
        });
    }
    redisClient.hset(defaultKey, dataviewField, body);
    return res.json({ message : 'Default view updated' });
})

module.exports = router;
