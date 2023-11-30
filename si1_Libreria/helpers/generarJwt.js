import jwt from "jsonwebtoken"


const generarJWT = ({id = ''})=>{
    return new Promise((resolve, reject) => {
        const payload = {id};
        jwt.sign(payload,process.env.SECRETORPRIVATEKEY,{
            expiresIn : '4h'
        }, (err, token) =>{
            if(err){
                console.log(err)
                reject('El jwt no se pudo generar')
            }else{            resolve(token)
            }
        })
    })
}


export {
    generarJWT
}