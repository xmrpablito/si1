import jwt from 'jsonwebtoken';
import {request,response} from 'express';
import {Rol, Usuario} from '../models/index.js';

const validarJwt = async(req = request, res= response, next)=>{
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            error: true,
            msg: 'el token no existe'
        })
    }
    try {
        const {id} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //llamo al usuario para verificar si va todo bien
        const user = await Usuario.findByPk(id,{
            attributes: ['id', 'nombre', 'correo', 'telefono','estado'],
            include: {
                model: Rol,
                attributes: ['id','nombre']
            }
        });

        //verifico si existe el usuario
        if(!user){
            return res.status(401).json({
                err: true,
                msg: "El usuario no existen en DB"
            })
        }
        //verifico si esta activo
        if(!user.estado){
            return res.status(401).json({
                err: true,
                msg: "El usuario no esta activo, Estado: false"
            })
        }
        req.usuario = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            msg: 'token no valido'
        })
    }
}
export {
    validarJwt
}