import {Router} from 'express';
import { check } from 'express-validator';

import {
  deleteRol,
  getRoles, postRol, putRol
} from '../controllers/rolController.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { validarRol } from '../helpers/dbValidator.js';
import { validarJwt } from '../middlewares/validarJwt.js';

const router = Router();

//muestra todos los roles
router.get('/', getRoles);

//crea un rol
router.post('/',[
  validarJwt,
  check('nombre','ingrese un nombre valido').notEmpty().isString(),
  validarCampos
], postRol);

//actualiza el rol
router.put('/:id',[
  validarJwt,
  check('id').custom(validarRol),
  check('nombre','ingrese un nombre valido.').notEmpty().isString(),
  validarCampos
],putRol)

//eliminar rol
router.delete('/:id',[
  validarJwt,
  check('id').custom(validarRol),
  validarCampos
],deleteRol)

export default router;