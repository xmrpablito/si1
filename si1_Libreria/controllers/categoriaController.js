import {
  request,
  response
} from 'express';
import { Categoria } from '../models/index.js';

//mostrar todas las categorias
const getCategorias = async(req=request, res=response)=>{
  let {limit = 10,offset = 0} = req.query;
  limit = parseInt(limit);
  offset= parseInt(offset);
  try {
    const [categorias, total ]= await Promise.all([
      Categoria.findAll({
        where: {
          estado: true
        },
        offset,
        limit,
        attributes: ['id','nombre']
      }),
      Categoria.count({
        where:{
          estado: true
        }
      })
    ]) 
    res.status(200).json({
      total,
      categorias
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado.")
  }
}

//crea una categoria
const postCategoria = async(req=request, res=response)=>{
  const {nombre } = req.body;
  try {
    const categoriaDB = await Categoria.findOne({
      where:{
        nombre
      }
    });

    if(categoriaDB && categoriaDB.estado){
      return res.status(400).json(`La categoria ${nombre} ya esta en el sistema`);
    }

    if(categoriaDB && !categoriaDB.estado){
      await categoriaDB.update({
        estado: true
      },{
        actividad: 'Crear categoria',
        usuarioId: req.usuario.id
      })
      return res.status(400).json(`La categoria ${nombre} ya se encuentra disponible`);
    }

    await Categoria.create({
      nombre
    },{
      actividad: 'Crear categoria',
      usuarioId: req.usuario.id
    });

    res.status(200).json(`Se ha creado correctamente la categoria ${nombre}.`)

  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error.")
  }
}

//eliminar una categoria
const deleteCategoria = async(req=request, res= response)=>{
  const {id} = req.params;
  try {
    const categoria = await Categoria.findByPk(id);
    //estado:false para eliminar
    await categoria.update({
      estado: false
    },{
      actividad: 'Eliminar categoria',
      usuarioId: req.usuario.id
    })

    res.status(200).json(`Se ha eliminado la categoria ${categoria.nombre} correctamente.`)
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado.")
  }
}


export {
  getCategorias,
  deleteCategoria,
  postCategoria
}