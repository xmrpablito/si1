import {request, response} from 'express';

import {
  NotaVenta,
  DetalleVenta,
  Usuario,
  TipoPago,
  Libro,
  Rol,
} from '../models/index.js';
import { 
  fechaActual, 
  horaActual 
} from '../helpers/FechaHora.js';


//muestra todas las ventas
const getVentas = async(req= request, res=response)=>{
  let { limit = 10, offset = 0} = req.query;
  limit=parseInt(limit);
  offset=parseInt(offset)  
  try {
    const [total, ventas] = await Promise.all([
      NotaVenta.count(),
      NotaVenta.findAll({
        limit,
        offset,
        attributes: ['id', 'fecha','hora','total'],
        include: [
          {
            model: TipoPago,
            attributes: ['id', 'nombre']
          },
          {
            model: Usuario,
            as: 'cliente',
            attributes: ['id', 'nombre']
          },
          {
            model: Usuario,
            as: 'vendedor',
            attributes: ['id', 'nombre']
          }
        ]
      })
    ]);
    res.status(200).json({
      total,
      ventas,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: 'Ha ocurrido un error inesperado'
    })
  }
}
//muestra una sola venta
const getVenta = async(req=request, res= response)=>{
  const {id} = req.params;
  try {
    const notaVenta =  await NotaVenta.findByPk(id, {
      attributes: ['id', 'fecha','hora', 'total'],
      include: [
        {
          model: Usuario,
          as: 'vendedor',
          attributes: ['nombre']
        },
        {
          model: Usuario,
          as: 'cliente',
          attributes: ['nombre', 'correo','telefono']
        },
        {
          model: Libro,
          attributes: ['id','titulo','precio'],
          through: {
            attributes: ['cantidad','descuento','importe']
          }
        }
      ]
    });
    const detalle = await DetalleVenta.findAll({
      where: {
        notaVentaId:id 
      }
    })
    console.log(detalle);
    res.status(200).json({
      notaVenta
    })

  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: 'Ha ocurrido un error'
    })    
  }
  
}
//crea una nuevaa venta
const postVenta =async(req=request,res= response)=>{
  const {detalles = [], cliente, pagoId} = req.body;
  const vendedor = req.usuario;
  try {
    const rol = vendedor.role.dataValues.nombre;
    if(rol !== "Administrador" && rol !== "Empleado"){
      return res.status(401).json({
        msg: "el usuario no es vendedor"
      })
    }
    const clienteDB = await Usuario.findOne({
      where: {
        nombre: cliente,
        estado: true
      }, 
      include: [
        {
          model: Rol,
          where: {
            nombre: 'Cliente'
          }
        }
      ]
    });
    if(!clienteDB){
      return res.status(401).json('El cliente no esta en el sistema')
    };
    const obj = {
      vendedorId: vendedor.id,
      clienteId: clienteDB.id,
      fecha: fechaActual,
      hora: horaActual,
      tipoPagoId: pagoId
    };
    if(detalles.length === 0){
      return res.status(401).json('No hay prodcutos que se puedan vender.')
    }
    const notaVenta = await NotaVenta.create(obj,{
      actividad: 'Crear Venta',
      usuarioId: req.usuario.id
    });
    detalles.forEach((objeto) => {
      objeto.notaVentaId = notaVenta.id;
    });
    const detalleVenta = await DetalleVenta.bulkCreate(detalles);

    res.status(200).json({
      notaVenta,
      detalleVenta,
      msg: "Se ha realizado con exito la funcion"
    })
    
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "Ha ocurrido un error inesperado"
    })
  }
}

//elimina una venta y sus detalles,
const deleteVenta = async(req=request,res=response)=>{
  const {usuario} = req;
  const {id} = req.params;
  try {
    const destruirVenta = await NotaVenta.findByPk(id);
    //verifico si el usuario es administrador
    console.log(usuario.id);
    const administrador = usuario.role.nombre;
    if(administrador !== "Administrador"){
      return res.status(401).json("el usuario no es administrador")
    }
    //elimino la nota de venta
    await destruirVenta.destroy({
      actividad: 'Eliminar Venta',
      usuarioId: usuario.id
    })
    
    res.status(200).json("Se ha eliminado correctamente la venta.")
  } catch (err) {
    console.log(err);
    res.status(400).json("Ha ocurrido un error")    
  }
}
const tiposPagos = async(req, res= response)=>{
  try {
    const pagosDB = await TipoPago.findAll();
    res.status(200).json({
      pagosDB
    })
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: 'Ha ocurrido un error inesperado'
    })
  }
}
export {
  getVentas,
  getVenta,
  postVenta,
  tiposPagos,
  deleteVenta
}