import { DataTypes} from 'sequelize';
import db from '../config/db.js';

const TipoPago = db.define('tipo_pagos',{
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
},{
  createdAt: false,
  updatedAt: false
})  

TipoPago.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });


export default TipoPago;