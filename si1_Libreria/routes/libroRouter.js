import {Router} from 'express';
import {check} from 'express-validator';
import {deleteLibro, getLibro, getLibros, getLibrosClientes, postLibro, putLibro} from '../controllers/libroController.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { validarLibro } from '../helpers/dbValidator.js';
import { validarAutores, validarEditorial } from '../middlewares/validarDB.js';
import { validarJwt } from '../middlewares/validarJwt.js';
import { isArrayBody } from '../middlewares/jsonParsers.js';

const router = Router();

//publico - clientes - paginado
router.get('/cliente', getLibrosClientes)

//publico - cantidad - paginado 
router.get('/',getLibros);

//publico libro por id
router.get('/:id',[
    check('id').custom(validarLibro),
    validarCampos
],getLibro)

//privado - para crear libros
router.post('/',[
    validarJwt,
    check('titulo','Ponga un nombre valido').notEmpty().isString(),
    check('precio','Ponga un numero razonable').notEmpty().isDecimal({decimal_digits: 2}),
    check('categoriaId', 'Debe ser una categoria valida').notEmpty().isNumeric(),
    check('fecha_publicacion', 'Ponga una fecha valida').notEmpty().isDate({format: 'YYYY-MM-DD'}),
    check('autores').notEmpty().custom(isArrayBody),
    check('editorial','Ingrese una editorial valida').notEmpty().isString(),
    check('img','ingrese una imagen valida.').notEmpty().isBase64(),
    validarAutores,
    validarEditorial,
    validarCampos
],postLibro);
//privado- para actualizar libros
router.put('/:id',[
    validarJwt,
    check('id').custom(validarLibro),
    check('titulo','Ponga un nombre valido').notEmpty().isString(),
    check('precio','Ponga un numero razonable').notEmpty().isDecimal({decimal_digits: 2}),
    check('categoriaId', 'Debe ser una categoria valida').notEmpty().isNumeric(),
    check('fecha_publicacion', 'Ponga una fecha valida').notEmpty().isDate({format: 'YYYY-MM-DD'}),
    check('autores','Ingrese autores validos.').notEmpty().isArray({min: 1}),
    check('editorial','Ingrese una editorial valida').notEmpty().isString(),
    check('img','ingrese una imagen valida.').notEmpty().isBase64(),
    validarAutores,
    validarEditorial,
    validarCampos
],putLibro);
//privado para eliminar libros
router.delete('/:id',[
    validarJwt,
    check('id').custom(validarLibro),
    validarCampos
],deleteLibro);

export default router;
