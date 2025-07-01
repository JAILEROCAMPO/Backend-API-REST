const pool = require('../config/db');

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
          console.log('vamos a ver',datos)
          const { chatId, remitenteId, contenido, formato } = datos;
          const validacion = await pool.query(
            'SELECT * FROM participantes WHERE chatID = $1 AND usuarioId = $2',
            [chatId, remitenteId]
          );
          

          if (validacion.rowCount === 0) {
            console.log('El usuario no pertenece al chat');
            return;
          }

          await pool.query(
            'INSERT INTO mensajes (chatId, remitenteId, contenido, tipo, leido) VALUES ($1, $2, $3, $4, $5)',
            [chatId, remitenteId, contenido, formato, false]
          );

          const participantes = await pool.query(
            'SELECT usuarioId FROM participantes WHERE chatID = $1 AND usuarioId != $2',
            [chatId, remitenteId]
          );
          console.log('participantes',participantes)

          for (const fila of participantes.rows) {
            const socketDestino = conexiones.get(fila.usuarioid);
            console.log(`Intentando enviar mensaje a usuarioId: ${fila.usuarioid}, socket:`, socketDestino ? 'Activo' : 'No encontrado');
            if (socketDestino && socketDestino.readyState === WebSocket.OPEN) {
              socketDestino.send(
                JSON.stringify({
                  tipo: 'mensaje',
                  chatId,
                  remitenteId,
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
        console.error('Error procesando mensaje:', error);

      }
    });

    socket.on('close', () => {
      console.log(`Usuario ${socket.usuarioId} desconectado`);
      conexiones.delete(socket.usuarioId);
    });
  });
};
