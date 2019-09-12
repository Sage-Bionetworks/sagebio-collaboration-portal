import { Router } from 'express';
import * as auth from '../../auth/auth.service';
import * as controller from './entity-attachment.controller';

var router = Router();

router.get('/', controller.index);

module.exports = router;
