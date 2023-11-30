import {DataTypes} from 'sequelize';
import db from '../config/db.js';
import {Categoria,Autor,Editorial} from './index.js';
import { 
    crearInventario, createBitacora
} from '../hooks/index.js';


const Libro = db.define('Libros',{
    titulo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    fecha_publicacion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    img:{
        type: DataTypes.STRING,
        allowNull: true 
    },
    estado:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    editorialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Editorial,
            key: 'id'
        }
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Categoria,
            key: 'id'
        }
    },
},{
    hooks:{
        afterCreate:[
            crearInventario,
            createBitacora
        ],
        afterUpdate:[
            createBitacora
        ]
    }
})
Libro.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });

//modelo de relacion muchos a muchos, libros y autores
const LibroAutor = db.define('libro_autor',{
    libroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Libro,
            key: 'id'
        },
        primaryKey: true
    },
    autorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Autor,
            key: 'id'
        },
        primaryKey: true
    }
},
{
    primaryKey: false,
    timestamps: false
});
LibroAutor.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });

export default Libro;
export {
    LibroAutor
}
