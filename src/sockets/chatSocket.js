const pool = require('../config/db');
const servicio = require('../services/ChastServices.js');

const conexiones = new Map();

module.exports = function (wss, WebSocket) {
  wss.on('connection', (socket) => {
    console.log('Usuario conectado al WebSocket');

    socket.on('message', async (mensaje) => {
      const datos = JSON.parse(mensaje);

      try {
        if (datos.tipo === 'identificacion') {
          const usuarioId = datos.usuarioId;
          conexiones.set(usuarioId, socket);
          socket.usuarioId = usuarioId;
          console.log(`Usuario ${usuarioId} identificado`);
          console.log('Sockets actuales:', Array.from(conexiones.keys()));  // Ver qué sockets están activos
          return;
        }

        if (datos.tipo === 'mensaje') {
          const { chatId, remitenteid, contenido, formato } = datos;
          const validacion = await pool.query(
            'SELECT * FROM participantes WHERE chatID = $1 AND usuarioId = $2',
            [chatId, remitenteid]          );
          

          if (validacion.rowCount === 0) {
            console.log('El usuario no pertenece al chat');
            return;
          }

          await pool.query(
            'INSERT INTO mensajes (chatId, remitenteid, contenido, tipo, leido) VALUES ($1, $2, $3, $4, $5)',
            [chatId, remitenteid, contenido, formato, false]
          );

          const participantes = await pool.query(
            'SELECT usuarioId FROM participantes WHERE chatID = $1 AND usuarioId != $2',
            [chatId, remitenteid]
          );

          for (const fila of participantes.rows) {
            const socketDestino = conexiones.get(fila.usuarioid);
            console.log(`Intentando enviar mensaje a usuarioId: ${fila.usuarioid}, socket:`, socketDestino ? 'Activo' : 'No encontrado');
            if (socketDestino && socketDestino.readyState === WebSocket.OPEN) {
              socketDestino.send(
                JSON.stringify({
                  tipo: 'mensaje',
                  chatId,
                  remitenteid,
                  contenido,
                  tipoContenido: formato,
                  enviadoEn: new Date(),
                })
              );
            }
          }
        }
      } catch (error) {
        console.error('Error procesando mensaje:', error.message); 

      }
    });

    socket.on('close', () => {
      console.log(`Usuario ${socket.usuarioId} desconectado`);
      conexiones.delete(socket.usuarioId);
    });
  });
};
