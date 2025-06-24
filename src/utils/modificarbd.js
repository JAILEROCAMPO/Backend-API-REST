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
      console.log("Tabla modificada exitosamente ¿")
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
  creartablas
}