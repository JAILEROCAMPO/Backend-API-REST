const pool = require('../config/db.js');
const Funciones = require('../utils/FuncionesApoyo.js');


async function verificarSiHayChat(peticion) {
    const datos = await Funciones.recolectarDatos(peticion);
    console.log(datos);
    const {esGrupal} = datos;
    const query = 'SELECT chatID FROM participantes WHERE usuarioId IN ($1, $2)GROUP BY chatID HAVING COUNT(DISTINCT usuarioId) = 2';
    const values = [usuarioid1, usuarioid2]; 
    const respuesta = await pool.query(query, values);
    console.log('verificar si hay chat services', respuesta.rows[0])

    if(respuesta.rows.length > 0){
        const chatId = respuesta.rows[0].chatid;
        console.log('entra a la condicional o no');
        return await obtenerMensajes(chatId);
        
    }else{
        console.log('entra a la condicional else o no');
        const Idchat = await crearChat(datos);
        console.log('id chat', Idchat);
        return Idchat;
    }
}

async function crearChat(datos) {
    console.log('entra a crear chat');
    const {nombreChat, esGrupal, creadoPor} = datos;
    const query = 'INSERT INTO chats (nombreChat, esGrupal, creadoPor) VALUES ($1, $2, $3) RETURNING idChat';
    const values = [nombreChat, esGrupal, creadoPor];
    const resultado = await pool.query(query, values);
    const idChat = resultado.rows[0].idchat;
    console.log('entras a crearchat', idChat);   
    return await participantesChat(datos, idChat);
    
}; 
async function participantesChat(datos, chatID) {
    let usuarios = [];

    if (datos.usuarioid1 && datos.usuarioid2) {
        usuarios = [datos.usuarioid1, datos.usuarioid2];
    }


    if (Array.isArray(datos.usuariosGrupo)) {
        usuarios = datos.usuariosGrupo;
    }

    if (usuarios.length === 0) {
        throw new Error('No hay usuarios para insertar en participantes');
    }

    const values = [];
    const placeholders = [];

    usuarios.forEach((usuarioId, index) => {
        values.push(chatID, usuarioId);
        placeholders.push(`($${index * 2 + 1}, $${index * 2 + 2})`);
    });

    const query = `INSERT INTO participantes (chatId, usuarioId) VALUES ${placeholders.join(', ')}`;
    await pool.query(query, values);

    console.log(`Participantes insertados en chat ${chatID}:`, usuarios);

    return [
        { bienvenida: 'Tu aventura acaba de comenzar', chatID }
    ];
}


async function obtenerMensajes(chatId){
    const query = 'SELECT * FROM mensajes WHERE chatId = $1';
    const values = [chatId];
    const mensajes = await pool.query(query, values);

    return {
        mensajes: mensajes.rows,
        idchat: chatId
    }
}

async function obtenergrupos(peticion) {
    const query = 'SELECT * FROM chats WHERE esGrupal = true;'
    const grupos = await pool.query(query);

    return grupos.rows;
    
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
    verificarSiHayChat,
    obtenerInfo,
    obtenerMensajes,
    crearChat,
    obtenergrupos
};