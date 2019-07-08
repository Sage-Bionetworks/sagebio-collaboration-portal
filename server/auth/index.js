import express from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';
import Organization from '../api/organization/organization.model';

// Passport Configuration
require('./local/passport').setup(User, Organization, config);
require('./google-oauth20/passport').setup(User, Organization, config);
require('./google-saml/passport').setup(User, Organization, config);
require('./phccp/passport').setup(User, Organization, config);
require('./azuread-openidconnect/passport').setup(User, Organization, config);

var router = express.Router();

router.use('/local', require('./local').default);
router.use('/google-oauth20', require('./google-oauth20').default);
router.use('/google-saml', require('./google-saml').default);
router.use('/phccp', require('./phccp').default);
router.use('/azuread-openidconnect', require('./azuread-openidconnect').default);

export default router;
