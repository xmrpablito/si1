import {DataTypes} from 'sequelize';
import db from '../config/db.js';
import {
    createBitacora,
} from '../hooks/index.js';


const Rol = db.define('roles',{
    nombre : {
        type: DataTypes.STRING(40),
        allowNull: false,
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
        ],
    }
}); 


Rol.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });

export default Rol;