import {Router} from 'express';
import { getUsuarios, postUsuarios,putUsuarios,deleteUsuarios, mostrarRoles, getToken, getUsuario } from '../controllers/userController.js';
import {check} from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos.js';
import {validarRol,validarUser} from '../helpers/dbValidator.js';
import { validarJwt } from '../middlewares/validarJwt.js';


const router = Router();

//mostrar roles
router.get('/roles', mostrarRoles);
//mostrar usuarios
router.get('/' ,getUsuarios);

//mostrar el usuario token
router.get('/token',[
    validarJwt,
],getToken);
router.get('/:id',[
    check('id').custom(validarUser),
    validarCampos
],getUsuario)
router.post('/',[
    validarJwt,
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('password','La contraseña es obligatorio.').isLength({min : 8}).notEmpty(),
    check('correo', 'Ingrese un correo valido.').isEmail().notEmpty(),
    check('telefono','Ingrese un numero de telefono valido.').isLength({min: 8, max: 10 }).notEmpty().isNumeric(),
    check('rolId').custom(validarRol).notEmpty(),
    validarCampos
], postUsuarios);
//privado - actualizar usuarios 
router.put('/:id',[
    validarJwt,
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('correo', 'Ingrese un correo valido.').isEmail().notEmpty(),
    check('telefono','Ingrese un numero de telefono valido.').isLength({min: 8, max: 10 }).notEmpty().isNumeric(),
    check('rolId').custom(validarRol).notEmpty(),
    validarCampos
],putUsuarios);

//privado - eliminar usuarios
router.delete('/:id',[
    validarJwt,
    check('id').custom(validarUser),
    validarCampos
],deleteUsuarios)
export default router;