import {Router} from 'express';
import { login, unlogin } from '../controllers/authController.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos.js'
import { validarJwt } from '../middlewares/validarJwt.js';

const router = Router();


router.post('/login', [
    check('correo','Ingrese un correo valido').isEmail().notEmpty(),
    check('password','El password es invalido').notEmpty().isLength({min: 8}),
    validarCampos
],login)

router.post('/logout',[
    validarJwt
],unlogin)

export default router;
