const http = require('http');
const rutas = require('./routers.js');
require ('dotenv').config();

const PUERTO = process.env.PORT;

const servidor = http.createServer((peticion, respuesta)=>{
    rutas(peticion,respuesta);
});

servidor.listen(PUERTO, ()=>{
    console.log('Servidor Corriendo en el puerto ', PUERTO);
})