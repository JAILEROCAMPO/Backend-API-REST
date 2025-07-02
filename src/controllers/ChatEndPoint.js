const servcicio = require('../services/ChastServices.js');

async function chats(peticion, respuesta){
    const {url, method} = peticion;

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

    if(method=== 'POST'){
        switch(url){
            case('/chat/iniciarChat'):
                try {
                    const resultado = await servcicio.crearChat(peticion);
                    respuesta.statusCode = 200;
                    respuesta.end(JSON.stringify(resultado));
                } catch (error) {
                    console.log(error);
                    respuesta.statusCode = 500;
                    respuesta.end(JSON.stringify({mensaje: 'Error al hacer la consulta en la base de datos'}));
                }
            break;
            case('/chat/participante'):
                try {
                    const resultado = await servcicio.participantesChat(peticion);
                    respuesta.statusCode = 200;
                    respuesta.end(JSON.stringify(resultado))
                } catch (error) {
                    console.log(error)
                    respuesta.statusCode = 500;
                    respuesta.end(JSON.stringify({mensaje: 'Error al hacer la consulta en la base de datos'}));
                }
            break;
            case('/chat/mensajes'):
                try {
                    const resultado = await servcicio.obtenerMensajes(peticion);
                    respuesta.statusCode = 200;
                    respuesta.end(JSON.stringify(resultado));
                } catch (error) {
                    console.log(error)
                    .statusCode = 500;
                    respuesta.end(JSON.stringify({mensaje: 'Error al hacer la consulta en la base de datos'}));
                }
            break;
            default:
                respuesta.statusCode = 404;
                respuesta.end(JSON.stringify({mensaje: 'No se encontro la ruta en Chats'}));
                break
        }
    }else if(method === 'GET'){
        switch(url){
            case('/chat/obtenerinfo'):
                try {
                    const resultado = await servcicio.obtenerInfo(peticion);
                    respuesta.statusCode = 200;
                    respuesta.end(JSON.stringify(resultado));
                } catch (error) {
                    console.log(error)
                    respuesta.statusCode = 500;
                    respuesta.end(JSON.stringify({mensaje: 'Error al hacer la consulta en la base de datos'}));
                }
            break;
            default:
                respuesta.statusCode = 404;
                respuesta.end(JSON.stringify({mensaje: 'No se encontro la ruta en Chats'}));
            break
        }
    }
    
}

module.exports = chats