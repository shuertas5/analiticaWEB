// --------------------------------------------------------------
// Servidor: Pantalla de Entrada
// --------------------------------------------------------------

var express = require('express');
const session = require('express-session');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const TablaSQL = require('../tablas/TablaSQL');
const rutinas = require('../treu/rutinas_server.js');

/* GET home page. */
router.get('/index', async function (req, res, next) {

    var rows = [];
    var empresas = [];

    var fecha = new Date();

    var fichero;

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
        rows.push([num_empre, nombre, pin])
    }

    fichero.cerrarFichero();

    var content;
    fs.readFile('./views/index.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { fecha, rows: rows }));
    });

});

router.post('/index', async function (req, res, next) {

    var numero_empre = req.body.numero;
    var contrasena = req.body.contrasena;

    var empresas = [];

    var fichero;

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

    fichero.cerrarFichero();

    var descri_error = '';
    var errores = false;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    for (i = 0; i < empresas.length; i++) {

        if (empresas[i].num_empre == numero_empre) {

            if (contrasena != empresas[i].pin) {

                descri_error += "-- Contraseña Incorrecta\r\n";
                errores = true;

                var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
                fs.writeSync(fiche, descri_error, 0);
                fs.closeSync(fiche);

                res.send('');

            }
            else {

                if (global.db != undefined) {
                    global.db.end();
                    global.db = undefined;
                }

                req.session.empresa = numero_empre;

                res.sendFile(path.resolve(__dirname, '../frontend', 'index0.html'));

            }

        }
    }

});

module.exports = router;
