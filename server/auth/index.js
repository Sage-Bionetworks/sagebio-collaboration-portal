import express from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';

// Passport Configuration
require('./local/passport').setup(User, config);
require('./google-oauth20/passport').setup(User, config);
require('./google-saml/passport').setup(User, config);
require('./phccp/passport').setup(User, config);
require('./azuread-openidconnect/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local').default);
router.use('/google-oauth20', require('./google-oauth20').default);
router.use('/google-saml', require('./google-saml').default);
router.use('/phccp', require('./phccp').default);
router.use('/azuread-openidconnect', require('./azuread-openidconnect').default);

export default router;
