function recolectarDatos(peticion){
    return new Promise(( resolve, reject)=>{
        let datos = '';

        peticion.on('data', fragmentos=>{
            datos += fragmentos;
        });
        peticion.on('end', async ()=>{
            try {
                const datosParseados = JSON.parse(datos);
                resolve(datosParseados);
            } catch (error) {
                reject(new Error('Error al parsear los datos ' + error.message));
            }
        });
        peticion.on('error', (err)=>{
            reject(err);
        });
    });
}

module.exports = {
    recolectarDatos
}