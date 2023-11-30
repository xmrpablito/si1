import { fechaActual, horaActual } from '../helpers/FechaHora.js';
import {
  Bitacora,
  Inventario
} from '../models/index.js';

const crearInventario = async(libro)=>{ 
  try {
    const inventario = await Inventario.create({
      libroId: libro.id
    })
  } catch (err) {
    throw new Error('Ha ocurrido un error en la creacion.')
  }
}

//insertar en la bitacora
const createBitacora = async(Model, {actividad,usuarioId})=>{
  try {
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
  crearInventario,
  createBitacora
}