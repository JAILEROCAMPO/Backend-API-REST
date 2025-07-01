const http = require('http');
const rutas = require('./routers.js');
const WebSocket = require('ws');
require ('dotenv').config();

const PUERTO = process.env.PORT;

const servidor = http.createServer((peticion, respuesta)=>{
    rutas(peticion,respuesta);
});

const wss = new WebSocket.Server({ server: servidor });

require('./src/sockets/chatSocket')(wss, WebSocket);

servidor.listen(PUERTO, () => {
  console.log('Servidor HTTP y WebSocket activo en puerto', PUERTO);
});



module.exports = {
    wss,
    WebSocket

}