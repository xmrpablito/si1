import {Router} from 'express';
import {deleteProveedor, getProveedor, getProveedores, postProveedor, putProveedor} from '../controllers/proveedorController.js';
import { check } from 'express-validator';
import { validarProveedor } from '../helpers/dbValidator.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { validarJwt } from '../middlewares/validarJwt.js';

const router = Router();

//publico - limite y offset - muestra todos los proveedores
router.get('/',getProveedores);

//publico - muestra un proveedor
router.get('/:id', [
  check('id').custom(validarProveedor),
  validarCampos
], getProveedor)

//privado - crea un proveedor
router.post('/',[
  validarJwt,
  check('nombre','El nombre es obligatorio').notEmpty().isString(),
  check('correo', 'Ingrese un correo valido.').isEmail().notEmpty(),
  check('telefono','Ingrese un numero de telefono valido.').isLength({min: 8, max: 10 }).notEmpty().isAlphanumeric(),
  check('direccion', 'Ingrese una direccion valida').isString().notEmpty(),
  validarCampos
], postProveedor);

//privado - actualizar 
router.put('/:id',[
  validarJwt,
  check('id').custom(validarProveedor),
  validarCampos
],putProveedor);

//privado - eliminar
router.delete('/:id',[
  validarJwt,
  check('id').custom(validarProveedor),
  validarCampos
],deleteProveedor)

export default router;
