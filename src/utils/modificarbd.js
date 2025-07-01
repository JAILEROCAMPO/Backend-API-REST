const pool = require('../config/db.js');
async function creartablas(){
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre TEXT,
        edad INTEGER,
        sexo TEXT,
        altura REAL
      );`)   
      await pool.query(`
      CREATE TABLE IF NOT EXISTS registro (
        id SERIAL PRIMARY KEY,
        correo TEXT UNIQUE,
        contrasena TEXT,
        nombre TEXT,
        documento BIGINT
      );`);  
      await pool.query(`
        CREATE TABLE IF NOT EXISTS chats(
        idChat SERIAL PRIMARY KEY,
        nombreChat TEXT,
        esGrupal boolean,
        creadoPor INTEGER REFERENCES registro(id),
        creadoen TIMESTAMP DEFAULT now()
        );`);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS participantes(
          idRelacion SERIAL PRIMARY KEY,
          chatID INTEGER REFERENCES chats(idChat),
          usuarioId INTEGER REFERENCES registro(id),
          unidoEn TIMESTAMP DEFAULT now()
        );`);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS mensajes(
        idMensaje SERIAL PRIMARY KEY,
        chatId INTEGER REFERENCES chats(idChat),
        remitenteId INTEGER REFERENCES registro(id),
        contenido TEXT,
        tipo TEXT,
        enviadoEn TIMESTAMP DEFAULT now(),
        leido boolean
        );`);
      console.log("Tabla modificada exitosamente ");
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
  creartablas
}