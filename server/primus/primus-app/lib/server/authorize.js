import config from '../../../../config/environment';
import jwt from 'jsonwebtoken';

/**
 * Authorizes users via their access token.
 */
module.exports = function authorize(req, authorized) {
    const token = req.query.access_token;
    var error;

    if (!token) {
        error = {
            statusCode: 401,
            message: 'Missing access token'
        };
        console.log('Primus:', error);
        return authorized(error);
    }

    var decoded;
    try {
        decoded = jwt.verify(token, config.secrets.session);
        console.log('Primus: decoded token', decoded);
    } catch (e) {
        error = {
            statusCode: 401,
            message: e.message
        };
        console.log('Primus:', error);
        return authorized(error);
    }

    authorized();
};

module.exports = function getUserId(token) {
    var error;

    if (!token) {
        error = {
            statusCode: 401,
            message: 'Missing access token'
        };
        console.log('Primus:', error);
        return undefined;
    }

    var decoded;
    try {
        decoded = jwt.verify(token, config.secrets.session);
        // console.log('Primus: decoded token', decoded);
    } catch (e) {
        error = {
            statusCode: 401,
            message: e.message
        };
        console.log('Primus:', error);
        return undefined;
    }

    // check if token has expired

    return decoded._id;
};
