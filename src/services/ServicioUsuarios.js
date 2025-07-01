const pool = require('../config/db.js')
const Funciones = require ('../utils/FuncionesApoyo.js')

async function obtenerUsuarios(){
    const respuesta = await pool.query('SELECT * FROM usuarios ORDER BY id');
    return respuesta.rows;
}

async function registrarUsuario(peticion){
    const datos = await Funciones.recolectarDatos(peticion);
    const {nombre, edad, sexo, altura} = datos;
    const query = 'INSERT INTO usuarios (nombre, edad, sexo, altura) VALUES ($1, $2, $3, $4)';
    const values = [nombre, edad, sexo, altura];
    await pool.query(query, values);
    return {
        mensaje: 'Usuario Registrado exitosamente',
        usuario: nombre
    }
}

async function actualizarUsuario(peticion){
    const datos = await Funciones.recolectarDatos(peticion);
    const {nombre, edad, sexo, altura, id} = datos
    const query = 'UPDATE usuarios SET nombre = $1, edad = $2, sexo = $3, altura =$4 WHERE id = $5';
    const values = [nombre, edad, sexo, altura, id];
    await pool.query(query, values);
    return{
        mensaje: 'Usuario creado exitosamente',
        usuario: nombre
    }
}

async function borrarUsuario(peticion){
    const datos = await Funciones.recolectarDatos(peticion);
    const {id} = datos;
    const query = 'DELETE FROM usuarios WHERE id=$1';
    const values = [id];
    await pool.query(query,values);
    return{
        mensaje: 'Usuario eliminado exitosamente'
    }
}


async function obtenerUsuariosLogueados(peticion) {
    const resultado = await pool.query('SELECT * FROM registro');
    return resultado.rows
}





module.exports = {
    obtenerUsuarios,
    registrarUsuario,
    actualizarUsuario,
    borrarUsuario,
    obtenerUsuariosLogueados
}