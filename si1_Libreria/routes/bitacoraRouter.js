import {Router} from 'express';

import { getBitacoras } from '../controllers/bitacoraController.js';
const router = Router();

router.get('/', getBitacoras);


export default router;