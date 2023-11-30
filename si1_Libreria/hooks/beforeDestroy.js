import {
  DetalleCompra,
  DetalleVenta,
  Inventario
} from '../models/index.js';

//cuando se elimina una venta
const sumarInventarioVenta =async(notaventa)=>{
  try {
    const detalles = await DetalleVenta.findAll({
      where: {
        notaVentaId: notaventa.id
      }
    });
    for(const detalle of detalles){
      //busco el inventario del libro de la venta eliminada
      const invetarioLibro = await Inventario.findByPk(detalle.libroId);
      //sumo las cantidades en los libros que fueron eliminado en la compra
      await invetarioLibro.increment('cantidad',{
        by: detalle.cantidad
      })
    }
  } catch (err) {
    console.log(err);
    throw new Error('Ha ocurrido un error al eliminar el detalle de venta')
  }
}
//destruir venta 
const eliminarDetallesVenta = async(notaVenta)=>{
  try {
    await DetalleVenta.destroy({
      where:{
        notaVentaId: notaVenta.id
      }
    })
    console.log('eliminando...');
  } catch (err) {
    throw new Error('Ha ocurrido un error')
  }
}
//cuando se elimina una compra
const restarInventarioCompra = async(notaCompra)=>{
  try {
    const detalles = await DetalleCompra.findAll({
      where:{
        NotaCompraId: notaCompra.id
      }
    });
    console.log(detalles);
    //itero  los detalles
    for(const detalle of detalles){
      const inventarioLibro = await Inventario.findByPk(detalle.libroId)
      //verifico si sobrara stock
      const cantidad = inventarioLibro.cantidad - detalle.cantidad;
      if(cantidad < 0){
        throw new Error('Ha ocurrido un error al eliminar el detalle de una venta, insuficiente stock')
      } 
      console.log(cantidad);
      await inventarioLibro.decrement('cantidad',{
        by: detalle.cantidad
      })
      console.log(inventarioLibro.cantidad);

    }
  } catch (err) {
    throw new Error('ha ocurrido un error al eliminar la compra');
  }
}
//eliminar las compras
const eliminarDetallesCompra = async(notaCompra)=>{
  try {
    await DetalleCompra.destroy({
      where: {
        NotaCompraId: notaCompra.id
      }
    })
  } catch (err) {
    throw new Error('Ha ocurrido un error')
  }
}
const createBitacoraDestroy = async(options)=>{
  try {
    console.log(actividad, usuarioId);
    await Bitacora.create({
      actividad,
      usuarioId,
      fecha: fechaActual,
      hora: horaActual
    })
  } catch (err) {
    throw new Error('Ha ocurrido un error inesperado')
  }
}
export {
  sumarInventarioVenta,
  eliminarDetallesVenta,
  restarInventarioCompra,
  eliminarDetallesCompra,
  createBitacoraDestroy
}