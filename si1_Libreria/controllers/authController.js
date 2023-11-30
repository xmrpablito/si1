import {request,response} from 'express';
import { Usuario, cerrarSesion, iniciarSesion } from '../models/index.js';
import { generarJWT } from '../helpers/generarJwt.js';
import { fechaActual, horaActual } from '../helpers/FechaHora.js';

const login = async(req = request, res = response)=>{
    const {correo,password} = req.body;
    try {
        const user = await Usuario.findOne({where: {correo}});
        if(!user){
            return res.status(400).json({
                msg: "El usuario no existe"
            })
        }
        
        if(!user.estado){
            return res.status(400).json({
                autenticado: false,
                msg: "El usuario no esta en el sistema"
            })
        }
        //verificar contraseña
        const validarPassword = user.verificarPassword(password);
        if(!validarPassword){
            return res.status(401).json({
                msg: "La contraseña es incorrecta, intente de nuevo"
            })
        }
        //genera jwt
        const token = await generarJWT({
            id: user.id,
            rolId: user.rolId
        })
        const DatoTiempo = {
            hora: horaActual,
            fecha: fechaActual,
            usuarioId: user.id
        }
        iniciarSesion.create(DatoTiempo);
        return res.status(200).json({
            msg: "ok Login",
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Algo salio mal'
        })
    }
}
const unlogin = async(req = request, res = response)=>{
    const {usuario} = req;
    try {
        await cerrarSesion.create({
            fecha : fechaActual,
            hora: horaActual,
            usuarioId: usuario.id,
        })
        res.status(200).json({
            usuario,
            msg: 'Se ha cerrado sesion correctamente'
        })
    } catch (error) {
        console.log('Ha ocurrido un error inesperado',error);
        res.status(400).json({
            msg: 'Ha ocurrido un error inesperado'
        })
    }
}
export {
    login,
    unlogin
}