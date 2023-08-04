// ****************************************************
// Procedimientos Varios
// ****************************************************

const { Pool, Client } = require('pg');
const treu = require("../treu/treu_file.js");

function accesoDB(empresa) {

    var fichero;

    var empresas = [];

    fichero = new treu.TreuFile("./datos_texto/empresas_analiticas.ini");
    fichero.abrirFichero("r");

    fichero.setDelimitado(true);
    fichero.setComillas(true);
    fichero.setSeparador(',');

    while (true) {

        var stat = fichero.leerRegistro();
        if (stat == false) {
            break;
        }

        var num_empre = fichero.valorNumero(1)
        var nombre = fichero.valorSerie(2);
        var pin = fichero.valorSerie(3);
        var imagen = fichero.valorSerie(4);
        var correo_user = fichero.valorSerie(5);
        var driver = fichero.valorSerie(6);
        var cadena_conexion = fichero.valorSerie(7);
        var usuario = fichero.valorSerie(8);
        var password = fichero.valorSerie(9);
        var host = fichero.valorSerie(10);
        var base_datos = fichero.valorSerie(11);
        var admin_pas = fichero.valorSerie(12);

        empresas.push({ num_empre, nombre, pin, imagen, correo_user, driver, cadena_conexion, usuario, password, host, base_datos, admin_pas });
    }

    for (i = 0; i < empresas.length; i++) {

        if (empresas[i].num_empre == empresa) {

            var db = new Client({
                'user': empresas[i].usuario,
                'host': empresas[i].host,
                'database': empresas[i].base_datos,
                'password': empresas[i].password,
                'port': 5432,
            });

            if (global.db == undefined) {
                db.connect();
                global.db = db;
            }
            else {
                db = global.db;
            }

            return db;

        }
    }

}

module.exports = { accesoDB };
