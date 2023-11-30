import {
  request,
  response
} from 'express';
import { Rol } from '../models/index.js';

//mostrar roles - publico
const getRoles = async(req=request, res=response)=>{
  let {limit = 10, offset = 0} = req.query;
  try {
    const [roles, total] = await Promise.all([
      Rol.findAll({
        where:{
          estado: true
        },
        limit,
        offset,
        attributes: ['id','nombre']
      }),
      Rol.count({
        where: {
          estado: true
        }
      })
    ]) 

    res.status(200).json({
      total,
      roles
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado")
  }
}

//crear un rol
const postRol = async(req=request, res=response)=>{
  const {nombre} = req.body;
  try {
    const rolDB = await Rol.findOne({
      where: {
        nombre
      }
    });

    //verifico si existe y esta habilitado
    if(rolDB && rolDB.estado){
      return res.status(400).json(`El rol ${nombre} ya esta en el sistema`);
    }
    //verifico si el estado es falso
    if(rolDB && !rolDB.estado){
      await rolDB.update({
        estado: true
      },{
        actividad: 'Crear Rol',
        usuarioId: req.usuario.id
      })
      return res.status(400).json(`El rol ${nombre} ya se encuentra disponible`)
    }

    //creo si pasa todo lo atras
    await Rol.create({
      nombre
    },{
      actividad: 'Crear Rol',
      usuarioId: req.usuario.id
    });

    res.status(200).json(`Se ha creado el rol ${nombre} correctamente`)

  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado.")
  }
}

const putRol = async(req=request, res=response)=>{
  const {id} = req.params;
  const {nombre} = req.body;
  try {
    const rolDB = await Rol.findOne({
      where: {
        nombre
      }
    });
    
    //verifico si existe y esta habilitado
    if(rolDB && rolDB.estado){
      return res.status(400).json(`El rol ${nombre} ya esta en el sistema`);
    }
    //busco el rol por el id
    const rol = await Rol.findByPk(id);

    //actualizo el rol
    await rol.update({
      nombre
    },{
      actividad: 'Actualizar Rol',
      usuarioId: req.usuario.id
    })

    res.status(200).json(`Se ha actualizado correctame el rol ${nombre}`)
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado.")
  }
}

const deleteRol = async(req=request, res=response)=>{
  const {id} = req.params;
  try {
    const rol = await Rol.findByPk(id);

    if(rol && !rol.estado){
      return res.status(401).json(`El rol ${rol.nombre} esta eliminado.`)
    }

    await rol.update({
      estado: false
    },{
      actividad: 'Eliminar Rol',
      usuarioId: req.usuario.id
    })

    res.status(200).json(`El rol ${rol.nombre} ha sido eliminado.`)
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado.")
  }
}

export {
  getRoles,
  postRol,
  putRol,
  deleteRol
}