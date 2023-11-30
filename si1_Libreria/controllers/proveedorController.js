import {request,response} from 'express';
import { Proveedor } from '../models/index.js';
import { or } from 'sequelize';


const getProveedores = async(req=request, res=response)=>{
  let {limit = 10 , offset = 0 } = req.query;
  limit=parseInt(limit);
  offset=parseInt(offset)
  try {
    const [total, proveedores] = await Promise.all([
      Proveedor.count({where: {estado: true}}),
      Proveedor.findAll({
        where: {
          estado: true
        },
        limit,
        offset,
        attributes: ['id','nombre', 'correo', 'telefono', 'direccion'],
      })
    ])
    res.status(200).json({
      total,
      proveedores
    })
  } catch (err) {
    console.log(err);
    res.status(401).json('Ha ocurrido un error inesperado')   
  }
}
const getProveedor = async(req=request, res=response)=>{
  const {id} = req.params;
  try {
    const proveedor = await Proveedor.findByPk(id,{
      attributes: ['id','nombre', 'correo', 'telefono', 'direccion']
    });
    res.status(200).json({
      proveedor
    })
 } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado")
  }
}
const postProveedor = async(req=request, res=response)=>{
  const {nombre, correo, direccion, telefono} = req.body;
  const obj = {
    nombre, 
    correo,
    direccion,
    telefono
  };
  try {
    const proveedorDB = await Proveedor.findOne({
      where: or({
        nombre,
        correo
      })
    });
    if(proveedorDB && proveedorDB.estado){
      return res.status(200).json(`El proveedor ${nombre} ya se encuentra en el sistema`)
    }
    await Proveedor.create(obj,{
      actividad: 'Crear proveedor',
      usuarioId: req.usuario.id
    });
    res.status(200).json({
      msg: `El proveedor ${nombre} ha sido registrado exitosamente.`
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado")
  }
}
const putProveedor = async(req=request, res=response)=>{
  const {id} = req.params;
  const obj = req.body;
  try {
    const proveedor = await Proveedor.findByPk(id);

    //actualiza al proveedor
    await proveedor.update(obj,{
      actividad: 'Actualizar proveedor',
      usuarioId: req.usuario.id
    });

    res.status(200).json({
      msg: `El proveedor ${proveedor.nombre} ha sido actualizado correctamente`
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado.")
  }
}
const deleteProveedor = async(req=request, res=response)=>{
  const {id} = req.params;
  try {
    const proveedor = await Proveedor.findByPk(id);

  
    await proveedor.update({
      estado: false
    },{
      actividad: 'Eliminar proveedor',
      usuarioId: req.usuario.id
    })
    res.status(200).json("Se ha eliminado el proveedor correctamente")
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado.")
  }
}
export {
  getProveedores,
  getProveedor,
  postProveedor,
  putProveedor,
  deleteProveedor
}