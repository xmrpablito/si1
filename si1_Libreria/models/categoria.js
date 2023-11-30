import {DataTypes} from 'sequelize';
import db from '../config/db.js';
import {
    createBitacora,
} from '../hooks/index.js';
const Categoria = db.define('categorias',{
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    estado:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    timestamps: false,
    hooks: {
        afterUpdate:[
            createBitacora
        ],
        afterCreate:[
            createBitacora
        ]
    }
});

Categoria.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });

export default Categoria;