var express = require('express');
var models = require(__base + "Models/UserModel");
var authrouter = express.Router();
var logger = require(__base + 'Models/logger');
var request = require('request');
var jwt = require('jsonwebtoken');
//require('request-debug')(request);

authrouter.post('/Login', function (req, res) {
    try {
        logger.info('called authentication')

        var accessTokenUrl = req.body.site + req.body.tokenPath;
        var params = {
            code: req.body.code,
            client_id: req.body.client_id,
            redirect_uri: req.body.redirect_uri,
            grant_type: req.body.grant_type
        };
        logger.info(params);
        logger.info(accessTokenUrl);
        request.post({ url: accessTokenUrl, form: params }, function (err, response, body) {
            console.log(response);

            if (response.statusCode !== 200) {
                console.log('failes' + body);
                return res.status(500).send({ message: body });
            } else {
                // var buf = new Buffer(JSON.parse(body).access_token, 'base64');
                // console.log(buf.toString());
                var decodedata = jwt.decode(JSON.parse(body).access_token, { complete: true });
                //console.log('payload' + decodedata.payload)

                console.log(' mail' + decodedata.payload.email)
                models.UserModel.ADFSUserLogin(decodedata.payload.email).then(function (users) {
                    var responsedata = {};
                    responsedata.AccesTokenData = JSON.parse(body).access_token;
                    responsedata.UserInfo = users;
                    res.status(200).json(responsedata);
                })
                    .catch(function (err) {
                        res.status(500).json(err);
                    })
                //validateAccessToken(JSON.parse(body).access_token);
                //return res.status(200).send(JSON.parse(body));
                // console.log('in else')
                // return res.status(200).send(JSON.parse(body));
            }

        })
    }
    catch (Ex) {
        return res.status(500).send({ message: Ex });
    }
});


// authrouter.post('/Login', function (req, res) {
//     logger.info('User Login Method');
//     models.UserModel.UserLogin({ userId: req.body.userId, password: req.body.password }).then(function (users) {
//         res.status(200).json(users);
//     })
//         .catch(function (err) {
//             res.status(500).json(err);
//         })
// });

authrouter.post('/Logout', function (req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    logger.info({ userId: req.body.userId, token: token });
    models.UserModel.UserLogout({ userId: req.body.userId, token: token }).then(function (users) {
        res.status(200).json(users);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

authrouter.get('/', function (req, res) {
    logger.info('at routes');
    var query = req.query;
    logger.info('Getting menu list for user: ' + query.userId);
    models.UserModel.GetMenuList(query.userId).then(function (menus) {
        logger.info(JSON.stringify(menus));
        res.status(200).json(menus);
    })
        .catch(function (err) {
            logger.info('Error: ' + err);
            res.status(500).json(err);
        })
});

authrouter.get('/rights/', function (req, res) {
    logger.info('At auth route for getting rights list');
    var query = req.query;
    logger.info('Getting rights list for user: ' + query.userId);
    models.UserModel.GetRightsList(query.userId).then(function (rights) {
        logger.info(JSON.stringify(rights));
        res.status(200).json(rights);
    })
        .catch(function (err) {
            logger.info('Error: ' + err);
            res.status(500).json(err);
        })
});
module.exports = authrouter;