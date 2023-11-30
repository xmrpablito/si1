import {Router} from 'express';

import {getCompra, getCompras, postCompra, deleteCompra} from '../controllers/compraController.js'
import { validarCompra} from '../helpers/dbValidator.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { check } from 'express-validator';
import { validarJwt } from '../middlewares/validarJwt.js';
import { validarDetalleCompra } from '../helpers/objectValidator.js';

const router = Router();

//muestra todas las compras - paginacion - total - publico
router.get('/', getCompras);

//muestra una compra por su id - publico
router.get('/:id',[
  check('id').custom(validarCompra),
  validarCampos
], getCompra)

//crea una nota de compra - privado
router.post('/',[
  validarJwt,
  check('proveedor','Ponga un nombre valiido').notEmpty().isString(),
  check('detalles','no tiene que estar vacio').isArray({min: 1}).notEmpty(),
  check('detalles.*','Los datos del arreglo detalle deben ser objetos').isObject().bail().custom(validarDetalleCompra),
  validarCampos
] ,postCompra)

router.delete('/:id',[
  validarJwt,
  check('id').custom(validarCompra),
  validarCampos
],deleteCompra)

export default router;