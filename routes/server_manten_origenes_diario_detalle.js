// --------------------------------------------------------------
// Servidor: Mantenimiento detalle Origenes Diario
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const url = require('url');
const tabla_origenes_diario = require('../tablas/tabla_origenes_diario.js');
const tabla_origenes = require('../tablas/tabla_origenes_diario.js');
const rutinas = require('../treu/rutinas_server.js');

router.get('/manten_origenes_diario_detalle', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var clave_origen = search_params.get('clave_origen');
    var titulo;

    if (opcion != null && opcion != undefined) {

        const acceso = require("./procedimientos_varios")

        var db = acceso.accesoDB(req.session.empresa);

        var tablaOrigenesDiario = new tabla_origenes_diario.TablaOrigenesDiario(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        var stat;
        async function prim() {
            if (opcion != 'alta') {
                stat = await tablaOrigenesDiario.getByPrimaryIndex(clave_origen);
            }
        }

        prim().then(async response => {

            if (stat == true) {
                titulo = tablaOrigenesDiario.getTitulo();
                campos = { clave_origen, titulo };
            }

            const fichero = "./frontend/static/css/index.css";

            var titulo_boton;
            var color_boton;

            if (opcion == 'alta') {
                disabled_clave = false;
                disabled_campos = false;
                clave_origen = "";
                titulo = "";
                campos = { clave_origen, titulo };
                titulo_boton = "Grabar";
                color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");
            }

            if (opcion == 'consulta') {
                disabled_clave = true;
                disabled_campos = true;
                titulo_boton = "Grabar";
                color_boton = rutinas.getStyle(fichero, ".clase_boton_consulta");
            }

            if (opcion == 'modificacion') {
                disabled_clave = true;
                disabled_campos = false;
                titulo_boton = "Grabar";
                color_boton = rutinas.getStyle(fichero, ".clase_boton_modificacion");
            }

            if (opcion == 'baja') {
                disabled_clave = true;
                disabled_campos = true;
                titulo_boton = "Dar de Baja";
                color_boton = rutinas.getStyle(fichero, ".clase_boton_baja");
            }

            var content;
            fs.readFile('./views/manten_origenes_diario_detalle.pug', async function read(err, data) {
                if (err) {
                    throw err;
                }
                content = data;
                res.send(pug.render(content, { titulo_boton, color_boton, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
            });
        });
    }
});

router.post('/manten_origenes_diario_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaOrigenesDiario = new tabla_origenes_diario.TablaOrigenesDiario(db);

    var opcion = req.body.opcion;
    var clave_origen = req.body.CLAVE_ORIGEN;
    var titulo = req.body.TITULO_ORIGEN;

    var descri_error = "";
    var errores = false;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    if (opcion == 'alta') {

        var stat;
        async function prim() {
            stat = await tablaOrigenesDiario.getByPrimaryIndex(clave_origen);
        }

        prim().then(async response => {

            if (stat == true) {

                descri_error += "-- Clave de Origen de Diario Ya Existe\r\n";
                errores = true;

            }

            if (clave_origen == "") {

                descri_error += "-- Clave de Origen en Blanco No Valida\r\n";
                errores = true;

            }

            var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
            fs.writeSync(fiche, descri_error, 0);
            fs.closeSync(fiche);

            if (errores == false) {

                if (clave_origen !== '') {
                    tablaOrigenesDiario.registroBlanco();
                    tablaOrigenesDiario.setClaveOrigen(clave_origen);
                    tablaOrigenesDiario.setTitulo(titulo);
                    tablaOrigenesDiario.insertRow();
                }

            }

            res.send('');

        });

    }

    if (opcion == 'baja') {

        tablaOrigenesDiario.deleteByPrimaryIndex(clave_origen);

        res.send('');

    }

    if (opcion == 'modificacion') {

        tablaOrigenesDiario.registroBlanco();
        tablaOrigenesDiario.setTitulo(titulo);
        tablaOrigenesDiario.updateRow(clave_origen);

        res.send('');

    }

});

module.exports = router;
