import { DataTypes} from 'sequelize';

import db from '../config/db.js';
import Usuario from './usuario.js';


const Bitacora = db.define('Bitacora',{
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: Usuario,
      key: 'id'
    },
  },
  actividad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  }
},{
  timestamps: false
});

export default Bitacora;