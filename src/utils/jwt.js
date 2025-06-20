require('dotenv').config();
const jwt = require('jsonwebtoken');
function Token(payload){
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
}

module.exports = Token;