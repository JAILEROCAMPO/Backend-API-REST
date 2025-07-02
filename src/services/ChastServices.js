const pool = require('../config/db.js');
const Funciones = require('../utils/FuncionesApoyo.js');



async function crearChat(peticion) {
    const datos = await Funciones.recolectarDatos(peticion);
    const {nombreChat, esGrupal, creadoPor} = datos;
    const query = 'INSERT INTO chats (nombreChat, esGrupal, creadoPor) VALUES ($1, $2, $3)';
    const values = [nombreChat, esGrupal, creadoPor];
    await pool.query(query, values);
    return {
        mensaje: 'chat incializado'
    }
};


async function participantesChat(peticion) {
    const datos = await Funciones.recolectarDatos(peticion);
    const {chatID, usuarioId} = datos;
    const query = 'INSERT INTO participantes (chatId, usuarioId) VALUES ($1, $2)';
    const values = [chatID, usuarioid];
    await pool.query(query, values);
    
    return{
        mensaje: 'participante añadido'
    }
};

async function obtenerMensajes(peticion){
    const datos = await Funciones.recolectarDatos(peticion)
    const {chatId} = datos;
    const query = 'SELECT * FROM mensajes WHERE chatId = $1';
    const values = [chatId];
    const mensajes = await pool.query(query, values);

    return mensajes.rows;
}

async function obtenerInfo(peticion) {

    // Ejecutar todas las consultas en paralelo
    const [registro, chats, participantes, mensajes] = await Promise.all([
      pool.query('SELECT * FROM registro'),
      pool.query('SELECT * FROM chats'),
      pool.query('SELECT * FROM participantes'),
      pool.query('SELECT * FROM mensajes')
    ]);

    // Enviar como JSON agrupado
    return({
      registro: registro.rows,
      chats: chats.rows,
      participantes: participantes.rows,
      mensajes: mensajes.rows
    });


}

module.exports = {
    crearChat,
    participantesChat,
    obtenerInfo,
    obtenerMensajes
};