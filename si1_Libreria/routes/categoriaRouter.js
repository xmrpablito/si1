import {Router} from 'express';
import {
  deleteCategoria,
  getCategorias, 
  postCategoria
} from '../controllers/categoriaController.js';
import { check } from 'express-validator';
import { validarCategoria } from '../helpers/dbValidator.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { validarJwt } from '../middlewares/validarJwt.js';

const router = Router();

router.get('/',getCategorias);

router.post('/',[
  validarJwt,
  check('nombre', 'Tiene que ser un nombre valido').notEmpty().isString(),
  validarCampos
],postCategoria)

router.delete('/:id',[
  validarJwt,
  check('id').custom(validarCategoria),
  validarCampos
], deleteCategoria)


export default router;