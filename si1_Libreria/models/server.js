import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {Server as SocketIo} from 'socket.io';
import http from 'http';

import {
    userRouter, 
    authRouter,
    libroRouter,
    ventaRouter, 
    proveedorRouter,
    compraRouter,
    bitacoraRouter,
    categoriaRouter,
    rolRouter
} from '../routes/index.js';
import {buscarLibro} from '../sockets/fetchBook.js';
import db from '../config/db.js';

class server {
    constructor(){
        this.app = express();
        this.server = http.createServer(this.app)
        this.io = new SocketIo(this.server,{
            cors: {
                origin: '*'
            }
        })
        this.PORT = process.env.PORT
        this.path ={
            user: '/api/usuario',
            auth: '/api/auth',
            libros: '/api/libro',
            ventas: '/api/venta',
            compras: '/api/compra',
            proveedor: '/api/proveedor',
            bitacora: '/api/bitacora',
            categoria: '/api/categoria',
            rol: '/api/rol'
        }
        //middlewares
        this.middlewares();
        //activar el server
        this.listen();
        //sockets
        this.sockets();
        //las rutas del servidor
        this.routes();
        //conectar la base de datos
        this.db();
    }
    //rutas
    routes(){
        //CRUD de usuarios(crear usuario, leer usuario, actualizar usuario, borrar usuario)
        this.app.use(this.path.user, userRouter);
        //autenticacion de usuarios
        this.app.use(this.path.auth, authRouter);
        //CRUD libros
        this.app.use(this.path.libros, libroRouter);
        //ventas de libros
        this.app.use(this.path.ventas, ventaRouter);
        //proveedores de libros
        this.app.use(this.path.proveedor, proveedorRouter);
        //compra de libros
        this.app.use(this.path.compras, compraRouter);
        //bitacora
        this.app.use(this.path.bitacora, bitacoraRouter);
        //categoria
        this.app.use(this.path.categoria, categoriaRouter);
        //roles
        this.app.use(this.path.rol, rolRouter)
    }

    //sockets
    sockets(){
        this.io.on('connection', socket =>{
            console.log('cliente conectado');
            buscarLibro(socket);
        })
    }
    //middlewares
    middlewares(){
        //habilitar para subir archivos 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
        //habilitar la carpeta publica 
        this.app.use(express.static('public'));
        
        //habilitar para los pedidos API
        this.app.use(cors({
            origin: '*'
        }));

        // habilitar los formularios 
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(express.json());
    }
    //conectar db
    async db(){
        try {
            await db.authenticate();
            db.sync();
            console.log('coneccion correcta a la base de datos')
        } catch (error) {
            console.log('Ha ocurrido un error inesperado', error);            
        }
    }
    //iniciar server
    listen(){
        this.server.listen(this.PORT,  ()=>{
            console.log(`El servidor esta en el ${this.PORT}`)
        })
    }
}

export default server;
