import {request, response} from 'express';
import { Bitacora } from '../models/index.js';


//mostrar bitacora; usuarios - hora -fecha - id - actividad
const getBitacoras = async(req= request, res=response)=>{
  let {limit = 10 , offset = 0} = req.query;
  limit = parseInt(limit);
  offset = parseInt(offset)
  try {
    const [bitacoras, total] = await Promise.all([
      Bitacora.findAll({
        offset,
        limit,
        order: [['id','DESC']]
      }),
      Bitacora.count()     
    ])
    res.status(200).json({
      total,
      bitacoras   
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado.")
  }
}


export {
  getBitacoras
}