const authController = require('./src/controllers/authEndPoint.js');
const usuarioController = require('./src/controllers/usuariosEndPoints');
const chatController = require('./src/controllers/ChatEndPoint.js');
const modificarDB = require('./src/utils/modificarbd.js')

async function rutas(peticion, respuesta){
    const url = peticion.url;
    
    if(url.startsWith('/auth')){

        await authController(peticion, respuesta);

    }else if (url.startsWith('/usuarios')){

        await usuarioController(peticion, respuesta);
    }else if (url.startsWith('/chat')){


        await chatController(peticion, respuesta);
    }else{
        modificarDB.creartablas();
        respuesta.statusCode = 404;
        respuesta.end(JSON.stringify({
            mensaje: 'No se ecuentra la ruta'
        }));
    }
}

module.exports = rutas;