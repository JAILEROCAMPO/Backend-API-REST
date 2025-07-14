require('dotenv').config();
const jwt = require('jsonwebtoken');

function crearToken(payload){
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
}

function verificarToken(token){
    return jwt.verify(token, process.env.JWT_SECRET);
} 
module.exports = {
    crearToken,
    verificarToken
}