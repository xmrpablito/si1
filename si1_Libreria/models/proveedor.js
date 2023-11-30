import {DataTypes} from 'sequelize';
import db from '../config/db.js';
import { createBitacora } from '../hooks/afterCreate.js';

const Proveedor = db.define('proveedores',{
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.CHAR(10),
    allowNull: false
  },
  estado:{
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
},{
  hooks: {
    beforeCreate: [
      createBitacora
    ],
    afterUpdate:[
      createBitacora
    ]
  }
})

export default Proveedor;