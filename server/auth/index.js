import express from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';

// Passport Configuration
require('./local/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./saml-demo/passport').setup(User, config);
require('./saml-demo-azure-ad/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local').default);
router.use('/google', require('./google').default);
router.use('/saml-demo', require('./saml-demo').default);
router.use('/saml-demo-azure-ad', require('./saml-demo').default);

export default router;
