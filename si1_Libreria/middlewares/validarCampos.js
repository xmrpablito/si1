import {request,response} from 'express';
import { validationResult } from 'express-validator';


const validarCampos = (req = request , res = response, next)=>{
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            errores
        });
    }
    next();
}

export { validarCampos }