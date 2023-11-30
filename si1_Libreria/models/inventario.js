import {DataTypes} from 'sequelize';

import db from '../config/db.js';
import Libro from './libros.js';

const Inventario = db.define('inventario',{
  libroId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Libro,
      key: 'id'
    },
    primaryKey: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
},{
  primaryKey: false,
  createdAt: false
})

export default Inventario;