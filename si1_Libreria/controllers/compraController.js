import {request,response} from 'express';
import { DetalleCompra, Libro, NotaCompra, Proveedor, Usuario, Rol } from '../models/index.js';
import { fechaActual, horaActual } from '../helpers/FechaHora.js';



//te da todas las compras - paginacion - totales - publico
const getCompras = async(req=request, res=response)=>{
  let {limit = 10, offset = 0} = req.query;
  limit = parseInt(limit);
  offset = parseInt(offset);
  try {
    //consigo cuantas compras en total hay y como vendran cada una
    const [total, compras] = await Promise.all([
      NotaCompra.count(),
      NotaCompra.findAll({
        offset,
        limit,
        attributes: ['id','fecha','hora','total'],
        include: [
          {
            model: Proveedor,
            attributes: ['id','nombre']
          },
          {
            model: Usuario,
            attributes: ['id','nombre']
          }
        ]
      })
    ]);
    res.status(200).json({
      total,
      compras
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error");   
  }
}

//te da una compra especifica por su id - publico
const getCompra = async(req=request, res=response)=>{
  const {id} = req.params;
  try {
    const notaCompra = await NotaCompra.findByPk(id, {
      attributes: ['id','fecha', 'hora', 'total'],
      include: [
        {
          model: Usuario,
          attributes: ['id','nombre']
        },{
          model: Proveedor,
          attributes: ['id','nombre', 'telefono', 'correo']
        },
        {
          model: Libro,
          attributes: ['titulo', 'id'],
          through: {
            attributes: ['cantidad', 'precio', 'importe']
          }
        }
      ]
    });

    const detalle = await DetalleCompra.findAll({
      where: {
        NotaCompraId: id
      }
    })
    console.log(detalle);
    res.status(200).json({
      notaCompra
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado");
  }
}

//crea una nota de venta - publico
const postCompra = async(req=request, res=response)=>{
  const {proveedor, detalles = []} = req.body;
  const {usuario} = req;
  try {
    //verifico si el usuario es administrador
    const usuarioRol = usuario.role.nombre;
    if(usuarioRol !== "Administrador" && usuarioRol !== "Empleado"){
      return res.status(400).json(`El usuario ${usuario.nombre} no es administrador`);
    }
    //verifico al proveedor en la DB
    const proveedorDB = await Proveedor.findOne({
      where: {
        nombre: proveedor
      }
    });
    if(!proveedorDB){
      return res.status(400).json(`El proveedor ${proveedor} no se encuentra en el sistema`)
    }
    //meto datos en obj para subir a la db la compra
    const obj= {
      fecha: fechaActual,
      hora: horaActual,
      proveedorId: proveedorDB.id,
      compradorId: usuario.id
    }
    //verifico si la venta no es null
    if(detalles.length === 0){
      return res.status(401).json('No hay productos que se puedan comprar.')
    }
    //creo la nota de compra
    const notaCompra = await NotaCompra.create(obj,{
      actividad: 'Crear compra',
      usuarioId: req.usuario.id
    });
    //meto id de la nota de compra a los detalles
    detalles.forEach(detalle => {
      detalle.NotaCompraId= notaCompra.id
    });
    const detalleCompra = await DetalleCompra.bulkCreate(detalles);
    res.status(200).json({
      msg:"Se ha realizado la compra con exito",
      notaCompra,
      detalleCompra
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado")
  }
}
const deleteCompra = async(req=request, res=response)=>{
  const {usuario} = req;
  const {id} = req.params;
  try {
    const compra = await NotaCompra.findByPk(id);
    //verifico si elimina algun admin
    const admin = usuario.role.nombre;
    if(admin !== "Administrador"){
      return res.status(400).json("El usuario no es administrador para borrar la compra")
    }
    //elimino la nota de compra 
    await compra.destroy({
      actividad: 'Eliminar compra',
      usuarioId: req.usuario.id
    });
    res.status(200).json("Se ha eliminado correctamente la compra.")
  } catch (err) {
    console.log(err);
    res.status(400).json("Ha ocurrido un error")    
  }
}
export {
  getCompras,
  getCompra,
  postCompra,
  deleteCompra
}