var moment = require('moment');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
const crypto = require('crypto');
var q = require('q');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var ActiveDirectory = require('activedirectory');
var User = require('./UserModel');
var logger = require(__base + 'Models/logger');

var _this = this;
var UtilityModel = {


    Authenticate: function (userid, password) {
        var username = 'sgsl\\' + userid;
        logger.info('Username: ' + username);

        var deferred = q.defer();

        var config = {
            url: 'ldap://sgsl.int',
            baseDN: 'dc=sgsl,dc=int',
            username: username,
            password: password
        };

        var ad = new ActiveDirectory(config);
        //logger.info(JSON.stringify(config));

        ad.authenticate(username, password, function (err, auth) {

            if (err) {
                logger.info('checking for manual authentication..');
                var isManuallyAuthenticated = false;
                var decryptedPwd;
                models.User.findOne({
                    where: ({
                        userId: userid
                    })
                })
                    .then(function (user) {
                        decryptedPwd = User.UserModel.decryptStringWithRsaPrivateKey(user.Password);
                        
                        if (decryptedPwd == password) {
                            logger.info('Manual authentication success');
                            isManuallyAuthenticated = true;
                        }
                        else {
                            logger.info('Authentication failed manually');
                            isManuallyAuthenticated = false;
                        }
                        if (isManuallyAuthenticated) {
                            deferred.resolve(true);
                        }
                        else {
                            logger.info('Authentication failed with ERROR: ' + JSON.stringify(err));
                            err.Message = 'Authentication failed!';
                            deferred.reject(err);
                        }
                    })
                    .catch(function (err2) {
                        logger.info('Manual authentication failure: ' + err2);
                        isManuallyAuthenticated = false;
                        deferred.reject(err2);
                    });
            }
            else {
                logger.info('Authenticated!');
                deferred.resolve(auth)
            }
        }
        )
        return deferred.promise;
    },

   

    IsUserMemberOf: function (username, groupName) {
        var config = {
            url: 'ldap://sgsl.int',
            baseDN: 'dc=sgsl,dc=int',
            username: username,
            password: password
        }

        var ad = new ActiveDirectory(config);

        ad.isUserMemberOf(username, groupName, function (err, isMember) {
            if (err) {
                logger.info('ERROR: ' + JSON.stringify(err));
                return;
            }

            logger.info(username + ' isMemberOf ' + groupName + ': ' + isMember);
        })
    },

    IsGroupExist: function (groupName) {
        var config = {
            url: 'ldap://sgsl.int',
            baseDN: 'dc=sgsl,dc=int',
            username: username,
            password: password
        }

        var ad = new ActiveDirectory(config);

        ad.groupExists(groupName, function (err, exists) {
            if (err) {
                logger.info('ERROR: ' + JSON.stringify(err));
                return;
            }

            logger.info(groupName + ' exists: ' + exists);
        })
    },

    IsUserExist: function (username) {
        var config = {
            url: 'ldap://sgsl.int',
            baseDN: 'dc=sgsl,dc=int',
            username: username,
            password: password
        }

        var ad = new ActiveDirectory(config);

        ad.userExists(username, function (err, exists) {
            if (err) {
                logger.info('ERROR: ' + JSON.stringify(err));
                return;
            }

            logger.info(username + ' exists: ' + exists);
        })
    },

    GetUsersForGroup: function (groupName) {
        var config = {
            url: 'ldap://sgsl.int',
            baseDN: 'dc=sgsl,dc=int',
            username: username,
            password: password
        }

        var ad = new ActiveDirectory(config);

        ad.getUsersForGroup(groupName, function (err, users) {
            if (err) {
                logger.info('ERROR: ' + JSON.stringify(err));
                return;
            }

            if (!users) logger.info('Group: ' + groupName + ' not found.');
            else {
                logger.info(JSON.stringify(users));
            }
        })
    },

    create_password: function (passwd, method, salt) {
        var hmac;
        method || (method = "sha1");
        salt || (salt = crypto.randomBytes(6).toString('base64'));
        hmac = crypto.createHmac(method, salt);
        hmac.end(passwd);
        return {
            hash: hmac.read().toString('hex'),
            salt: salt,
            method: method
        };
    },
    check_password: function (hashed, passwd) {
        var hash, hashp, method, salt, _ref;
        _ref = hashed.split("$"); method = _ref[0]; salt = _ref[1]; hashp = _ref[2];
        hash = this.create_password(passwd, method, salt).hash;
        logger.info('hash ' + hash);
        return { status: (hash != hashp) };
    },

    generateToken: function (user, expireAt) {
       // logger.info(expireAt);
        var cert = fs.readFileSync('./certificate/server.key');
        var token = jwt.sign({
            auth: 'magic', agent: user.userAgent, iss: user.userId,
            //exp: expireAt // Note: in seconds!
        }, cert, { algorithm: 'RS256', expiresIn: expireAt });  // secret is defined in the environment variable JWT_SECRET
        //logger.info(token);
        //logger.info('test');
        return token;
    },
    ValidateToken: function (token) {
        var deferred = q.defer();
       // logger.info('reading the file');
        var cert = fs.readFileSync('./certificate/server.crt');
        jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, decoded) {
            logger.info(err);
            if (!decoded || decoded.auth !== 'magic') {
                logger.info('InvalidToken');
                deferred.reject({ error: 400, msg: 'Not Valid Token or Token is expired' })
            } else {
                models.UserSession.findAll({ where: { userId: decoded.iss, SessionTokenId: token, LogoutDate: null } })
                .then(function (user) {
                  //  logger.info('User Session ' + user);
                    if (user != null && user != undefined && user.length > 0) deferred.resolve('success');
                    else deferred.reject({ error: 400, msg: 'Token is expired. please re-login' });
                }).catch(function (userSessionError) {
                    logger.info('User SessionError ' + userSessionError);
                    deferred.reject({ error: 500, msg: userSessionError });
                });
            }
        });
        return deferred.promise;
    },

    encryptStringWithRsaPublicKey: function (toEncrypt) {
        var publicKey = fs.readFileSync('./certificate/server.crt', "utf8");
        var buffer = new Buffer(toEncrypt);
        var encrypted = crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString("base64");
    },
   
}
module.exports.UtilityModel = UtilityModel;