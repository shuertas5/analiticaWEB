// --------------------------------------------------------------
// Servidor: Mantenimiento detalle Tipos Hojas Analiticas
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const url = require('url');
const tabla_tipos_hojas = require('../tablas/tabla_tipos_hojas.js');
const rutinas = require('../treu/rutinas_server.js');

router.get('/manten_tipos_hojas_detalle', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var tipo = search_params.get('tipo');
    var titulo;

    if (opcion != null && opcion != undefined) {

        const acceso = require("./procedimientos_varios")

        var db = acceso.accesoDB(req.session.empresa);

        var tablaTiposHojas = new tabla_tipos_hojas.TablaTiposHojas(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        var stat;
        async function prim() {
            if (opcion != 'alta') {
                stat = await tablaTiposHojas.getByPrimaryIndex(tipo);
            }
        }

        prim().then(async response => {

            if (stat == true) {
                titulo = tablaTiposHojas.getTitulo();
                campos = { tipo, titulo };
            }

            const fichero = "./frontend/static/css/index.css";

            var titulo_boton;
            var color_boton;

            if (opcion == 'alta') {
                disabled_clave = false;
                disabled_campos = false;
                tipo = "";
                titulo = "";
                campos = { tipo, titulo };
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
            fs.readFile('./views/manten_tipos_hojas_detalle.pug', async function read(err, data) {
                if (err) {
                    throw err;
                }
                content = data;
                res.send(pug.render(content, { titulo_boton, color_boton, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
            });
        });
    }
});

router.post('/manten_tipos_hojas_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaTiposHojas = new tabla_tipos_hojas.TablaTiposHojas(db);

    var opcion = req.body.opcion;
    var tipo = req.body.CLAVE_TIPO;
    var titulo = req.body.TITULO_TIPO;

    var descri_error = "";
    var errores = false;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    if (opcion == 'alta') {

        var stat;
        async function prim() {
            stat = await tablaTiposHojas.getByPrimaryIndex(tipo);
        }

        prim().then(async response => {

            if (stat == true) {

                descri_error += "-- Clave de Tipo de Hoja Ya Existe\r\n";
                errores = true;

            }

            if (tipo == "") {

                descri_error += "-- Clave de Tipo de Hoja Blanca No Valida\r\n";
                errores = true;

            }

            var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
            fs.writeSync(fiche, descri_error, 0);
            fs.closeSync(fiche);

            if (errores == false) {

                if (tipo !== '') {
                    tablaTiposHojas.registroBlanco();
                    tablaTiposHojas.setTipo(tipo);
                    tablaTiposHojas.setTitulo(titulo);
                    tablaTiposHojas.insertRow();
                }

            }

            res.send('');

        });

    }

    if (opcion == 'baja') {

        tablaTiposHojas.deleteByPrimaryIndex(tipo);

        res.send('');

    }

    if (opcion == 'modificacion') {

        tablaTiposHojas.registroBlanco();
        tablaTiposHojas.setTitulo(titulo);
        tablaTiposHojas.updateRow(tipo);

        res.send('');

    }

});

module.exports = router;
