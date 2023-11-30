import {Libro} from '../models/index.js';
const buscarLibro = (socket ) =>{
    socket.on('fetchBook', async(title)=>{
      // Realizar la consulta a la base de datos utilizando el título proporcionado
      const book = await Libro.findOne({
        where: {titulo: title},
        attributes: ['id', 'precio']
      })
      // Emitir los datos del libro al cliente
      socket.emit('bookData', book)
    })
}


export {
  buscarLibro
}