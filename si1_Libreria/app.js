import server from './models/index.js';
import {config} from 'dotenv';

config({path: '.env'});

const app = new server();

app.listen;