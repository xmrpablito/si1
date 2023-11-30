import {DataTypes} from 'sequelize';
import db from '../config/db.js';

const Autor = db.define('autores',{
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
},{
    timestamps: false
});
Autor.sync()
    .then(() => {
        console.log('Modelo actualizado exitosamente');
    })
    .catch((error) => {
        console.error('Error al actualizar el modelo:', error);
    });

export default Autor;