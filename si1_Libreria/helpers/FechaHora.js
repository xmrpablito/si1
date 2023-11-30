import moment from 'moment';

const currentDate = new Date();

const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();

const fecha = moment(`${year}-${month}-${day}`,'YYYY-MM-DD');
const fechaActual = fecha.format('YYYY-MM-DD');

const hour = currentDate.getHours();
const minute = currentDate.getMinutes();
const second = currentDate.getSeconds();

const hora =moment( `${hour}:${minute}:${second}`,'HH:mm:ss');
const horaActual = hora.format('HH:mm:ss')

export {
    fechaActual,
    horaActual
}