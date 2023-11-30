import {
  Libro,
} from '../models/index.js';

//para que el importe de la compra se haga automatico
const importeVenta = async(instancia = [])=>{
  try {
    for (const detalle_venta of instancia) {
      const libro = await Libro.findByPk(detalle_venta.libroId);
      detalle_venta.precio = libro.precio;
      const total = detalle_venta.precio * detalle_venta.cantidad;
      detalle_venta.importe = total - (total * detalle_venta.descuento)       
    }
  } catch (err) {
    console.log(err);
    throw new Error('Error al crear el detalle de venta')    
  }
}
//importe de la compra
const importeCompra = (instancia = [])=>{
  try {
    for(const detalle_compra of instancia){
      detalle_compra.importe = detalle_compra.precio * detalle_compra.cantidad;
    }
  } catch (err) {
    console.log(err);
    throw new Error('No se puede calcular el importe')
  }
}
export{
  importeVenta,
  importeCompra
}