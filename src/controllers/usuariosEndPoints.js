const servicios = require('../services/ServicioUsuarios.js');

async function usuariosEndPoints(peticion, respuesta){
    const {url, method} = peticion;
    const mensaje = {mensaje: 'No se encontro la ruta url en Usuarios'};
    
    respuesta.setHeader('Content-Type', 'application/json');
    respuesta.setHeader('Access-Control-Allow-Origin', '*');
    respuesta.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if(method === 'OPTIONS'){
        respuesta.statusCode = 200;
        respuesta.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        respuesta.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        respuesta.end(JSON.stringify({mensaje: 'Permitido'}));
        return;
    }
    

    if( method === 'GET'){

        switch (url){
            case('/usuarios/'):
                try {
                    const usuarios = await servicios.obtenerUsuarios();
                    respuesta.statusCode = 200;
                    respuesta.end(JSON.stringify(usuarios));
                } catch (error) {
                    respuesta.statusCode = 500;
                    respuesta.end(JSON.stringify({mensaje: 'Error al obtener usuarios'}));
                    console.error(error);
                }
                break;
            default:
                respuesta.statusCode = 404;
                respuesta.end(JSON.stringify(mensaje))
                break;
        }

    }else if( method === 'POST'){

        switch(url){
            case('/usuarios/registrarUsuario'):
            try {
                const mensajeRespuesta = await servicios.registrarUsuario(peticion);
                respuesta.statusCode = 200;
                respuesta.end(JSON.stringify(mensajeRespuesta))
            } catch (error) {
                respuesta.statusCode = 500;
                respuesta.end(JSON.stringify({mensaje: 'Error al consultar la base de datos'}));
                console.error(error);
            }
            break;
            default:
                respuesta.statusCode = 404;
                respuesta.end(JSON.stringify(mensaje))
                break;
        }

    }else if( method === 'PUT'){

        switch(url){
            case('/usuarios/actualizarUsuario'):
            try {
                const mensajeRespuesta = await servicios.actualizarUsuario(peticion);
                respuesta.statusCode = 200;
                respuesta.end(JSON.stringify(mensajeRespuesta));
            } catch (error) {
                respuesta.statusCode = 500;
                respuesta.end(JSON.stringify({Mensaje: 'Error al actualizar el usuario'}));
            }
            break;
            default:
                respuesta.statusCode = 404;
                respuesta.end(JSON.stringify(mensaje))
                break;
        }

    }else if(method === 'DELETE'){

        switch(url){
            case('/usuarios/borrarUsuario'):
            try {
                const mensajeRespuesta = await servicios.borrarUsuario(peticion);
                respuesta.statusCode = 200;
                respuesta.end(JSON.stringify(mensajeRespuesta));
            } catch (error) {
                respuesta.statusCode = 500;
                respuesta.end(JSON.stringify({mensaje: 'Error al eliminar usuario'}))
            }
            break;
            default:
                respuesta.statusCode = 404;
                respuesta.end(JSON.stringify(mensaje))
                break;
        }

    }else{
        respuesta.statusCode = 404;
        respuesta.end(JSON.stringify({mensaje: 'Error al hacer la consulta o method no disponible'}));
    }
};

module.exports = usuariosEndPoints;

