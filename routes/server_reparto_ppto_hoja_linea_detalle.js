// --------------------------------------------------------------
// Servidor: Reparto Ppto Hoja Linea Detalle
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_reparto_ppto_lineas = require('../tablas/tabla_reparto_ppto_lineas');
const rutinas = require('../treu/rutinas_server.js');

router.get('/reparto_ppto_hoja_linea_detalle', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var hoja = search_params.get('hoja');
    var linea = search_params.get('linea');
    var repartos;

    var titulo_hoja;

    if (opcion != null && opcion != undefined) {

        const acceso = require("./procedimientos_varios")
        var db = acceso.accesoDB(req.session.empresa);

        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaRepartoPptoLineas = new tabla_reparto_ppto_lineas.TablaRepartoPptoLineas(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        await tablaRepartoPptoLineas.getByPrimaryIndex(hoja, linea).then(stat => {

            if (stat == true) {
                repartos = tablaRepartoPptoLineas.getCifras();
                campos = { hoja, linea, repartos };
            }

            const fichero = "./frontend/static/css/index.css";

            var titulo_boton;
            var color_boton;
            var color_boton2;

            if (opcion == 'alta') {
                disabled_clave = false;
                disabled_campos = false;
                hoja = 0;
                linea = 0;
                repartos = rutinas.iniciarArray(13);
                campos = { hoja, linea, repartos };
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
            fs.readFile('./views/reparto_ppto_hoja_linea_detalle.pug', async function read(err, data) {
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
                res.send(pug.render(content, { hoja, linea, titulo_boton, color_boton, color_boton2, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
            });
        });

    }
});

router.post('/reparto_ppto_hoja_linea_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaRepartoPptoLineas = new tabla_reparto_ppto_lineas.TablaRepartoPptoLineas(db);

    var opcion = req.body.opcion;
    var hoja = req.body.NUMI_HOJA;
    var linea = req.body.NUMI_LINEA;
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

        var stat;
        async function prim() {
            stat = await tablaLineas.getByPrimaryIndex(hoja, linea);
        }

        prim().then(async response => {

            if (stat == false) {

                descri_error += "-- Numero de Hoja-Linea NO Existe \r\n";
                errores = true;

            }

            await tablaRepartoPptoLineas.getByPrimaryIndex(hoja, linea).then(async stat2 => {

                if (stat2 == true) {

                    descri_error += "-- Linea de Reparto YA Existe \r\n";
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

                    tablaRepartoPptoLineas.registroBlanco();
                    tablaRepartoPptoLineas.setHoja(hoja);
                    tablaRepartoPptoLineas.setLinea(linea);
                    tablaRepartoPptoLineas.setCifras(repartos);
                    tablaRepartoPptoLineas.insertRow();

                }

                res.send('');

            });

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

            tablaRepartoPptoLineas.registroBlanco();
            tablaRepartoPptoLineas.setHoja(hoja);
            tablaRepartoPptoLineas.setLinea(linea);
            tablaRepartoPptoLineas.setCifras(repartos);
            tablaRepartoPptoLineas.updateRow(hoja, linea);

        }

        res.send('');
    }

    if (opcion == 'baja') {

        tablaRepartoPptoLineas.deleteByPrimaryIndex(hoja, linea);

        res.send('');

    }

});

module.exports = router;
