const pool = require('../config/db.js');
const Funciones = require('../utils/FuncionesApoyo.js');
const bcrypt = require('bcryptjs');
const  tokens = require('../utils/jwt.js');

async function RegistrarUsuarioAuth(peticion){
    const datos = await Funciones.recolectarDatos(peticion);
    const {correo, nombre, contraseña, documento} = datos;
    const query = 'SELECT * FROM registro WHERE correo = $1 AND documento = $2';
    const query2 = 'INSERT INTO registro (correo, nombre, contraseña, documento) values ($1, $2, $3, $4)';
    const contraseñaHash = await bcrypt.hash(contraseña, 10);
    const values = [correo, nombre, contraseñaHash, documento];
    
    existenDatos = await pool.query(query, [correo, documento]);
    if(existenDatos.rows.length > 0){
        return{
            mensaje: 'Correo o documento ya en uso',
            correo: correo,
            documento: documento
        }
    }
    await pool.query(query2, values);
    return {
        mensaje: 'Usuario registrado Exitosamente',
        correo: correo
    }
    
}

async function loginAuth(peticion){
    const datos = await Funciones.recolectarDatos(peticion);
    const {correo, contraseña} = datos;
    const query = 'SELECT * FROM registro WHERE correo=$1';
    const existe = await pool.query(query,[correo]);

    if(!correo || !contraseña){
        return{
            mensaje: 'Faltan Campos Obligatorios'
        }
    }


    if(existe.rows.length === 0){
        return{ 
            mensaje: 'Credenciales incorrectas'
        }
    }
    const usuario = existe.rows[0];
    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
    if(!coincide){
        return{mensaje: 'Contraseña incorrecta'}
    }

    const payload = {
        id: usuario.id,
        correo: usuario.correo
    }

    const token = tokens.crearToken(payload);
    
    return{
        mensaje: 'Sesion Iniciada',
        token: token,
        usuario: {
            nombre: usuario.nombre,
            correo: usuario.correo
        }
    };
    
}


async function verificarToken(peticion){
    const datos = await Funciones.recolectarDatos(peticion)
    const {token} = datos;
    try {
        return await tokens.verificarToken(token);
    } catch (error) {
        return {
            mensaje: "Token invalido o expirado"
        }
    }
}


module.exports = {
    RegistrarUsuarioAuth,
    loginAuth,
    verificarToken
}