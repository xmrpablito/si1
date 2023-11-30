import {request,response} from 'express';
import {Rol, Usuario} from '../models/index.js';
import {or} from 'sequelize';

//mostrar todos los usuarios - totales - paginado
const getUsuarios = async(req = request,res= response)=>{
    let { limit = 10, offset = 0} = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    const [total , usuarios] = await Promise.all([
        Usuario.count({where: {estado: true}}),
        Usuario.findAll({limit: limit,
            offset: offset,
            attributes: ['id', 'nombre', 'correo','telefono'],
            include: {
                model: Rol,
                attributes: ['id', 'nombre']
            },
            where: {estado: true}})
    ]); 
    return res.status(200).json({
        total,
        usuarios
    });
}

//muestra el usuario por id
const getUsuario = async(req = request,res= response)=>{
    const {id} = req.params

    try {
        const usuarioDB = await Usuario.findByPk(id,{
            attributes: ['id','nombre','correo','telefono'],
            include: {
                model: Rol,
                attributes: ['id', 'nombre']
            }
        });
        res.status(200).json({
            usuario: usuarioDB,
            msg: 'Se ha mostrado el usuario correctamente'
        })
        
    } catch (error) {
        console.log('Ha ocurrido un error inesperado', error);
        res.status(401).json({
            msg: 'Ha ocurrido un error inesperado'
        })
    }
    

}

//decifra los datos del toke
const getToken = async(req = request, res = response)=>{
    const {usuario} = req;
    res.status(200).json({
        usuario,
        msg: 'Se ha decifrado el token correctamente'
    })
}
//crear usuario - privado(aun no implementado)
const postUsuarios = async (req = request,res= response)=>{
    const {nombre, correo, password, telefono, rolId} = req.body;
    const data = {
        nombre,
        correo,
        password,
        telefono,
        rolId
    }
    try {
        const usuarioDB = await Usuario.findOne({
            where: or({
                nombre,
                correo
            })
        });
        if(usuarioDB && usuarioDB.estado){
            return res.status(400).json({
                msg: `El usuario ${nombre} de correo ${correo} ya existe en el sistema`
            })
        };
        await Usuario.create(data,{
            actividad: 'Crear Usuario',
            usuarioId: req.usuario.id
        })
        return res.status(200).json(`El usuario ${nombre} ha sido registrado con exito`)
    } catch (error) {
        console.log('ha ocurrido un error inesperado',error);
        res.status(401).json({
            msg: 'Ha ocurrido un error'
        })
    }
}

//actualizar usuario - privado(aun no implementado)
const putUsuarios = async(req = request, res = response)=>{
    const {id} = req.params;
    const {nombre, correo, telefono,rolId} = req.body;
    //actualizo los objetos
    const obj = {
        nombre,
        correo,
        telefono,
        rolId
    }
    try {
        const user = await Usuario.findByPk(id);
        //verificamos si el email no esta ocuapdo
        const userDB = await Usuario.findOne({
            where: or({
                correo,
                nombre
            })
        })       
        if(userDB){
            return res.status(400).json({
                msg: `El usuario  ${nombre} de ${correo} estan siendo ya usados`
            })
        }
        
        //
        //actualizamos el usuario
        await user.update(obj,{
            actividad: 'Actualizar Usuario',
            usuarioId: req.usuario.id
        })

        res.status(200).json({
            msg: `El usuario ${user.nombre} ha sido actualizado correctamente`
        })
    } catch (err) {
        console.log(err);
        res.status(401).json("Ha ocurrido un error.")
    }
}

//eliminar usuario - privado(aun no implementado)
const deleteUsuarios = async(req = request, res = response)=>{
    const {id} = req.params;
    try {
        const user = await Usuario.findByPk(id)
        user.update({
            estado: false
        },{
            actividad: 'Eliminar Usuario',
            usuarioId: req.usuario.id
        }),
        res.status(200).json({
            msg: `El usuario ${user.nombre} ha sido eliminado`
        });
    } catch (err) {
        console.log("Ha ocurrido un error inesperado", err);
        return res.status(400).json({
            msg: "Ha ocurrido inesperado, intente otra vez"
        })
    } 
}
//mostrar todos los roles
const mostrarRoles = async(req, res= response)=>{
    const roles = await Rol.findAll({
        attributes: ['id','nombre']
    });
    res.status(200).json({
        roles
    })  
}
export {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios,
    mostrarRoles,
    getToken,
    getUsuario
}
