import {DataTypes} from 'sequelize';
import Rol from './rol.js';
import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import { createBitacora } from '../hooks/afterCreate.js';


const Usuario = db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo :{
        type: DataTypes.STRING,
        allowNull: false
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: { 
        type: DataTypes.CHAR(10),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Rol,
            key: 'id'
        }
    }
}, {
    hooks: {
        beforeCreate : async function(usuario) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            },
        beforeUpdate: function(usuario, options){
            console.log(options);
        },
        afterCreate:[
            createBitacora
        ],
        afterUpdate:[
            createBitacora
        ]        
    },
});

Usuario.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

Usuario.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });

//modelo para iniciar sesion
const iniciarSesion = db.define('iniciarSesion', {
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    usuarioId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    }
},{
    timestamps: false
});

iniciarSesion.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });


//modelo para cerrar sesion
const cerrarSesion = db.define('cerrarSesion',{
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    usuarioId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    }
},{
    timestamps: false
});

cerrarSesion.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });


export default Usuario;
export{ 
    iniciarSesion,
    cerrarSesion
}