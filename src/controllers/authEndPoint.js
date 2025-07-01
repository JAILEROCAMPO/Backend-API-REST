const servicio = require('../services/authServicio.js');

async function authEndPoint(peticion, respuesta){
    const {url, method} = peticion;
    const mensaje = {mensaje: 'No se encontro la ruta url'};
    respuesta.setHeader('Content-Type', 'application/json');
    respuesta.setHeader('Access-Control-Allow-Origin', '*');
    respuesta.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if(method === 'OPTIONS'){
        respuesta.statusCode = 200;
        respuesta.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        respuesta.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        respuesta.end(JSON.stringify({mensaje: 'Permitido'}));
        return;
    }
    

    if(method === 'POST'){
        switch(url){
            case('/auth/Registro'):
                try {
                    const mensajeRespuesta = await servicio.RegistrarUsuarioAuth(peticion);
                    respuesta.statusCode = 200;
                    respuesta.end(JSON.stringify(mensajeRespuesta));
                } catch (error) {
                    console.error(error);
                    respuesta.statusCode = 500;
                    respuesta.end(JSON.stringify({mensaje: 'Error en el servidor'}))
                }
            break;
            case('/auth/Login'):
                try {
                    const mensajeRespuesta = await servicio.loginAuth(peticion);
                    respuesta.statusCode = 200;
                    respuesta.end(JSON.stringify(mensajeRespuesta));
                } catch (error) {
                    console.error(error);
                    respuesta.statusCode = 500;
                    respuesta.end(JSON.stringify({mensaje: 'Error en el servidor'}))
                }
            break;
            case('/auth/token'):
                const mensajeRespuesta = await servicio.verificarToken(peticion);
                respuesta.statusCode = 200;
                respuesta.end(JSON.stringify({mensajeRespuesta}));
                break;
            default:
                respuesta.statusCode = 404;
                respuesta.end(JSON.stringify({mensaje: 'No se encontro la ruta URL en Auth'}));
            break;
        }
    }else{
        respuesta.statusCode = 404;
        respuesta.end(JSON.stringify({mensaje: 'Ruta o metodo no encontrado'}));
    }
}

module.exports = authEndPoint;