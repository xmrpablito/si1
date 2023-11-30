import {request,response} from 'express';
import { Autor, Categoria, Editorial, Inventario, Libro, LibroAutor } from '../models/index.js';
import {postImageBlobStorage ,getFileUrlFromBlobStorage, deleteBlob} from '../config/azureBlobStorage.js';
import { v4 as uuidv4} from 'uuid';
import { Op } from 'sequelize';

//mostrar a los clientes
const getLibrosClientes = async(req=request, res=response)=>{
    let {limit = 10, offset = 0} = req.query;
    limit=parseInt(limit);
    offset=parseFloat(offset);
    try {
        const [libros, total] = await Promise.all([
            Libro.findAll({
                where: {
                    estado: true,
                },
                attributes: ['id','titulo','precio', 'img'],
                include:[
                    {
                        model: Inventario,
                        attributes: ['cantidad'],
                        where:{
                            cantidad: {
                                [Op.gt] : 0
                            }
                        }
                    }
                ],
                limit,
                offset,
            }),
            Libro.count({
                where: {
                    estado: true
                },
                include:[
                    {
                        model: Inventario,
                        attributes: ['cantidad'],
                        where:{
                            cantidad: {
                                [Op.gt] : -1
                            }
                        }
                    }
                ]
            })
        ]) 
        for(const libro of libros){
            const imageUrl = getFileUrlFromBlobStorage(libro.img);
            libro.img = imageUrl;
        }

        res.status(200).json({
            total,
            libros
        })
    } catch (err) {
        console.log(err);
        res.status(401).json("Ha ocurrido un error inesperado.")
    }
}

//muestra todos los libros - total - paginado
const getLibros = async(req=request, res=response)=>{
    let { limit = 10, offset = 0} = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    const [total, usuarios] = await Promise.all([
        Libro.count({where:{estado : true}}),
        Libro.findAll({
            limit,
            offset,
            attributes:['id','titulo','fecha_publicacion','precio'],
            include: [
                {
                    model: Categoria,
                    attributes: ['id', 'nombre']
                },{
                    model: Editorial,
                    attributes: ['id', 'nombre']
                },{
                    model: Inventario,
                    attributes: ['cantidad']
                }
            ],
            where: {estado: true}
        })
    ])
    return res.status(200).json({
        total,
        usuarios,
        msg: "Ok"
    })
}

//muestra un libro por id
const getLibro = async(req=request, res=response)=>{
    const {id} = req.params;
    try {
        const libroBD = await Libro.findByPk(id, {
            attributes: ['id', 'titulo', 'fecha_publicacion','precio', 'img'],
            include: [
                {
                    model: Categoria,
                    attributes: ['id', 'nombre']
                },{
                    model: Editorial,
                    attributes: ['id', 'nombre']
                },{
                    model: Autor,
                    attributes: ['id','nombre'],
                    through: {
                        attributes: []
                    }
                },{
                    model: Inventario,
                    attributes: ['cantidad']
                }
            ]
        })
        //busca la imagen
        const imageUrl = getFileUrlFromBlobStorage(libroBD.img);
        console.log(imageUrl);

        libroBD.img = imageUrl;

        //pregunto la imagen
        res.status(200).json({
            libro: libroBD,
            msg: 'Se ha mostrado con exito el libro solicitado'
        })
    } catch (err) {
        console.log('Ha ocurrido un error inesperado',err);
        res.status(401).json({
            msg: 'Ha ocurrido un error inesperado'
        })
    }
}
//crea datos de un libro
const postLibro = async(req=request, res=response)=>{
    const {titulo,precio,fecha_publicacion,categoriaId} = req.body;
    const data = {
        titulo,
        precio,
        fecha_publicacion,
        categoriaId,
        editorialId: req.editorial
    }
    const autores = req.autores;
    const {img} = req.files;
    try {
        const libroDB = await Libro.findOne({where: {titulo}})
        //si el libro su estado es false
        if(libroDB && libroDB.estado){
            return res.status(400).json("El libro se encuentra en el sistema")
        }
        if(libroDB && !libroDB.estado){
            await libro.update({estado: true},{
                actividad: 'Crear libro',
                usuarioId: req.usuario.id
            })
            return res.status(200).json("El libro se ha reincorporado");
        }
        const cortarNombre = img.name.split('.');
        const extension = cortarNombre[cortarNombre.length - 1]
        //validar extensiones 
        const validarExtensiones = ['png','jpg','jpeg'];
        if(!validarExtensiones.includes(extension)){
            return res.status(400).json("La extension no es permitida")
        }
        //el uuid que ira en la db como img
        const imgName =  uuidv4()+'.' +extension;
        data.img = imgName;
        const imgPath = img.tempFilePath;
        //creo un nuevo libro en la db
        const libro = await Libro.create(data,{
            actividad: 'Crear libro',
            usuarioId: req.usuario.id
        });
        //crea un arreglo de objetos del libro y sus autores
        const autoresLibro = autores.map(autor =>({
            autorId: autor,
            libroId: libro.id
        }));
        await LibroAutor.bulkCreate(autoresLibro);
        //lo subo a mi blob storage en azure
        const resp = await postImageBlobStorage( imgName, imgPath);
        console.log(resp);
        return res.status(200).json(`Se ha creado correctamente el libro ${data.titulo}`)
    } catch (err) {
        console.log(err);
        res.status(401).json("ha ocurrido un error")
    }
}   
const putLibro = async(req=request, res=response)=>{
    const {id} = req.params;
    const {titulo,precio,categoriaId,fecha_publicacion} = req.body;
    const {img} = req.files;
    const data = {
        titulo,
        precio,
        categoriaId,
        fecha_publicacion,
        editorialId: req.editorial
    }
    const {autores} = req;
    try {
        
        //elimino la imagen y incorporo la nueva imagen
        const[libro, autoresLibro] = await Promise.all([
            Libro.findByPk(id),
            LibroAutor.findAll({
                where:{
                    libroId: id
                }
            })
        ])
        const eliminar = await deleteBlob(libro.img);
        console.log(eliminar);
        if(!eliminar){
            return res.status(401).json("Ocurrio un error inesperado")
        }
        const cortarNombre = img.name.split('.');
        const extension = cortarNombre[cortarNombre.length - 1]
        //validar extensiones 
        const validarExtensiones = ['png','jpg','jpeg'];
        if(!validarExtensiones.includes(extension)){
            return res.status(400).json("La extension no es permitida")
        }
        const imgName = uuidv4()+'.' +extension;
        data.img = imgName;
        const imgPath = img.tempFilePath;

        //actualizo el libro
        await libro.update(data,{
            actividad: 'Actualizar libro',
            usuarioId: req.usuario.id
        });
        //actualizo los autores
        autoresLibro.forEach((autorLibro, index) => {
            autorLibro.autorId = autores[index];
        });
        // Guardar los cambios realizados en cada registro
        await Promise.all(autoresLibro.map(autorLibro => autorLibro.save()));
        //guardar imagen
        const resp = await postImageBlobStorage( imgName, imgPath);
        console.log(resp);
        return res.status(200).json({
            msg: `Se ha actualizado correctamente el libro ${libro.titulo}`
        })
    } catch (err) {
        console.log(err);
        res.status(401).json("Ha ocurrido un error inesperado")
    }
}
const deleteLibro = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const libro = await Libro.findByPk(id);
        await libro.update({
            estado: false
        },{
            actividad: 'Eliminar libro',
            usuarioId: req.usuario.id
        })
        res.status(200).json({
            msg: 'Se ha eliminado el libro correctamente'
        });
    } catch (err) {
        console.log('Ha ocurrido un error inesperado', err);
        res.status(401).json({
            msg: 'Ha ocurrido un error inesperado'
        });
    }
};
export {
    getLibros,
    getLibro,
    postLibro,
    putLibro,
    deleteLibro,
    getLibrosClientes
}