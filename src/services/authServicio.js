const pool = require('../config/db.js');
const Funciones = require('../utils/FuncionesApoyo.js');
const bcrypt = require('bcryptjs');
const  tokens = require('../utils/jwt.js');

async function RegistrarUsuarioAuth(peticion){
    const datos = await Funciones.recolectarDatos(peticion);
    const {correo, nombre, contrasena, documento} = datos;
    const query = 'SELECT * FROM registro WHERE correo = $1 AND documento = $2';
    const query2 = 'INSERT INTO registro (correo, nombre, contrasena, documento) values ($1, $2, $3, $4)';
    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const values = [correo, nombre, contrasenaHash, documento];
    
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
    const {correo, contrasena} = datos;
    const query = 'SELECT * FROM registro WHERE correo=$1';
    const existe = await pool.query(query,[correo]);

    if(!correo || !contrasena){
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
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if(!coincide){
        return{mensaje: 'Contrasena incorrecta'}
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
            correo: usuario.correo,
            id: usuario.id
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