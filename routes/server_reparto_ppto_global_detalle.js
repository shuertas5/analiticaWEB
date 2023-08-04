// --------------------------------------------------------------
// Servidor: Reparto Ppto Global Detalle
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const tabla_reparto_ppto_global = require('../tablas/tabla_reparto_ppto_global');
const rutinas = require('../treu/rutinas_server.js');

router.get('/reparto_ppto_global_detalle', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var repartos;

    var titulo;

    if (opcion != null && opcion != undefined) {

        const acceso = require("./procedimientos_varios")
        var db = acceso.accesoDB(req.session.empresa);

        var tablaRepartoPptoGlobal = new tabla_reparto_ppto_global.TablaRepartoPptoGlobal(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        await tablaRepartoPptoGlobal.getByPrimaryIndex().then(stat => {

            if (stat == true) {
                repartos = tablaRepartoPptoGlobal.getCifras();
                campos = { repartos };
            }

            const fichero = "./frontend/static/css/index.css";

            var titulo_boton;
            var color_boton;
            var color_boton2;

            if (opcion == 'alta') {
                disabled_clave = false;
                disabled_campos = false;
                repartos = rutinas.iniciarArray(13);
                campos = { repartos };
                titulo_boton = "Grabar";
                color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");
                color_boton2 = rutinas.getStyle(fichero, ".boton_formato");
            }

            if (opcion == 'consulta') {
                disabled_clave = true;
                disabled_campos = true;
                titulo_boton = "Grabar";
                color_boton = rutinas.getStyle(fichero, ".clase_boton_consulta");
                color_boton2 = rutinas.getStyle(fichero, ".boton_formato");
            }

            if (opcion == 'modificacion') {
                disabled_clave = true;
                disabled_campos = false;
                titulo_boton = "Grabar";
                color_boton = rutinas.getStyle(fichero, ".clase_boton_modificacion");
                color_boton2 = rutinas.getStyle(fichero, ".boton_formato");
            }

            if (opcion == 'baja') {
                disabled_clave = true;
                disabled_campos = true;
                titulo_boton = "Dar de Baja";
                color_boton = rutinas.getStyle(fichero, ".clase_boton_baja");
                color_boton2 = rutinas.getStyle(fichero, ".boton_formato");
            }

            var content;
            fs.readFile('./views/reparto_ppto_global_detalle.pug', async function read(err, data) {
                if (err) {
                    throw err;
                }
                var dis_campos;
                if (disabled_campos == true) {
                    dis_campos = 'disabled';
                }
                else {
                    dis_campos = '';
                }
                content = data;
                res.send(pug.render(content, { titulo_boton, color_boton, color_boton2, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
            });
        });
    }
});

router.post('/reparto_ppto_global_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaRepartoPptoGlobal = new tabla_reparto_ppto_global.TablaRepartoPptoGlobal(db);

    var opcion = req.body.opcion;
    var repartos = [];

    for (var i = 1; i <= 12; i++) {
        var masca = 'REPARTO' + i;
        repartos.push(parseFloat(req.body[masca]));
    }

    var temporal = "temporal";
    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    if (opcion == 'alta') {

        await tablaRepartoPptoGlobal.getByPrimaryIndex().then(async stat2 => {

            if (stat2 == true) {

                descri_error += "-- Reparto Global Ppto YA Existe \r\n";
                errores = true;

            }

        }).then(resi => {

            var suma = 0;
            for (var s = 1; s <= 12; s++) {
                suma += repartos[s];
            }

            if (suma > 1.0000001 || suma < 0.99999999) {

                descri_error += "-- El reparto no suma 1,00000 \r\n";
                errores = true;

            }

            var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
            fs.writeSync(fiche, descri_error, 0);
            fs.closeSync(fiche);

            if (errores == false) {

                tablaRepartoPptoGlobal.registroBlanco();
                tablaRepartoPptoGlobal.setUno(1);
                tablaRepartoPptoGlobal.setCifras(repartos);
                tablaRepartoPptoGlobal.insertRow();

            }

            res.send('');

        });
    }

    if (opcion == 'modificacion') {

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.closeSync(fiche);

        var suma = 0;
        for (var s = 1; s <= 12; s++) {
            suma += repartos[s];
        }

        if (suma > 1.0000001 || suma < 0.99999999) {

            descri_error += "-- El reparto no suma 1,00000 \r\n";
            errores = true;

        }

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);

        if (errores == false) {

            tablaRepartoPptoGlobal.registroBlanco();
            tablaRepartoPptoGlobal.setCifras(repartos);
            tablaRepartoPptoGlobal.updateRow();

        }

        res.send('');
    }

    if (opcion == 'baja') {

        tablaRepartoPptoGlobal.deleteByPrimaryIndex();

        res.send('');

    }

});

module.exports = router;
