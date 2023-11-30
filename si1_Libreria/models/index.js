import Rol from './rol.js';
import Usuario,{iniciarSesion, cerrarSesion} from './usuario.js';
import Autor from './autor.js';
import Categoria from './categoria.js';
import Editorial from './editorial.js';
import Libro,{ LibroAutor}from './libros.js';
import TipoPago from './tipoPago.js';
import NotaVenta, {DetalleVenta} from './venta.js';
import Proveedor from './proveedor.js';
import NotaCompra,{DetalleCompra} from './compra.js';
import Inventario from './inventario.js';
import Bitacora from './bitacora.js';
import Server from './server.js';



//relacion de 1 a muchos, Rol -> usuario
Rol.hasMany(Usuario, {
    foreignKey: {
        name: 'rolId',
        allowNull: false
    }
})
Usuario.belongsTo(Rol, {
    foreignKey: {
        name: 'rolId',
        allowNull: false
    }
});
//relacion de 1 a muchos, Editorial -> Libro
Editorial.hasMany(Libro, {
    foreignKey: {
        name: 'editorialId',
        allowNull: false
    }
})
Libro.belongsTo(Editorial, {
    foreignKey: {
        name: 'editorialId',
        allowNull: false
    }
});
//relacion de 1 a muchos, usuario-Cliente -> nota_venta
Usuario.hasMany(NotaVenta, {
    foreignKey: {
        name: 'clienteId',
        allowNull: false
    },
    as: 'cliente'
});
NotaVenta.belongsTo(Usuario,{
    foreignKey:{
        name: 'clienteId',
        allowNull: false
    },
    as: 'cliente'
});
//relacion de 1 a muchos, usuario-vendedor -> nota_venta
Usuario.hasMany(NotaVenta, {
    foreignKey: {
        name: 'vendedorId',
        allowNull: false
    },
    as: 'vendedor'
});
NotaVenta.belongsTo(Usuario,{
    foreignKey:{
        name: 'vendedorId',
        allowNull: false
    },
    as: 'vendedor'
});
//relacion de 1 a 1, libro  -> inventario
Libro.hasOne(Inventario, {
    foreignKey: {
        name: 'libroId',
        allowNull: false
    }
});
Inventario.belongsTo(Libro,{
    foreignKey:{
        name: 'libroId',
        allowNull: false
    }
});
//relacion 1 a 1 , tipo_pagos -> nota_venta
TipoPago.hasOne(NotaVenta,{
    foreignKey:{
        name: 'tipoPagoId',
        allowNull: false
    }
});
NotaVenta.belongsTo(TipoPago,{
    foreignKey:{
        name: 'tipoPagoId',
        allowNull: false
    }
});
//relacion de 1 a muchos, categoria -> Libro
Categoria.hasMany(Libro, {
    foreignKey: {
        name: 'categoriaId',
        allowNull: false
    }
})
Libro.belongsTo(Categoria, {
    foreignKey: {
        name: 'categoriaId',
        allowNull: false
    }
});
//relacion de 1 a muchos, proveedor -> nota_compra
Proveedor.hasMany(NotaCompra, {
    foreignKey: {
        name: 'proveedorId',
        allowNull: false
    }
})
NotaCompra.belongsTo(Proveedor, {
    foreignKey: {
        name: 'proveedorId',
        allowNull: false
    }
});

//relacion 1 a muchos, usuario(comprador) -> nota_compra
Usuario.hasMany(NotaCompra, {
    foreignKey: {
        name: 'compradorId',
        allowNull: false
    }
})
NotaCompra.belongsTo(Usuario, {
    foreignKey: {
        name: 'compradorId',
        allowNull: false
    }
});
//relacion de unos a muchos, usuario -> nota_compra
Usuario.hasMany(Bitacora,{
    foreignKey:{
        name: 'usuarioId',
        allowNull: false
    }
});
Bitacora.belongsTo(Usuario,{
    foreignKey:{
        name: 'usuarioId',
        allowNull: false
    }
})
//relacion de muchos a muchos -> autor y categoria
Libro.belongsToMany(Autor, { through: LibroAutor ,foreignKey:{
    name: 'libroId',
    allowNull: false
}});
Autor.belongsToMany(Libro, { through: LibroAutor , foreignKey:{
    name: 'autorId',
    allowNull: false
}});
//relacion de muchos a muchos -> libros y nota_venta
Libro.belongsToMany(NotaVenta, { through: DetalleVenta ,foreignKey:{
    name: 'libroId',
    allowNull: false
}});
NotaVenta.belongsToMany(Libro, { through: DetalleVenta , foreignKey:{
    name: 'notaVentaId',
    allowNull: false
}});
//relacion de muchos a muchos -> libros y nota_compra
Libro.belongsToMany(NotaCompra, { through: DetalleCompra ,foreignKey:{
    name: 'libroId',
    allowNull: false
}});
NotaCompra.belongsToMany(Libro, { through: DetalleCompra , foreignKey:{
    name: 'NotaCompraId',
    allowNull: false
}});

export {
    Rol,
    Usuario,
    iniciarSesion,
    cerrarSesion,
    Autor,
    Categoria,
    Editorial,
    Libro,
    LibroAutor,
    TipoPago,
    NotaVenta,
    DetalleVenta,
    Proveedor,
    NotaCompra,
    DetalleCompra,
    Inventario,
    Bitacora
}
export default Server;