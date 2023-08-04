// --------------------------------------------------------------
// Servidor: Introducir Valores a Presupuesto Detalle
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_valores_ppto = require('../tablas/tabla_valores_ppto');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_lineas = require('../tablas/tabla_lineas');
const rutinas = require('../treu/rutinas_server.js');
const { response } = require('express');

/* GET home page. */
router.get('/introducir_valores_presupuesto_detalle', function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var hoja = search_params.get('hoja');
    var linea = search_params.get('linea');
    var titulo;
    var importe;

    var hoja_intro = hoja;

    if (opcion != null && opcion != undefined) {

        const acceso = require("./procedimientos_varios")
        var db = acceso.accesoDB(req.session.empresa);

        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaValoresPresupuesto = new tabla_valores_ppto.TablaValoresPresupuesto(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        var stat;
        async function prim() {
            stat = await tablaValoresPresupuesto.getByPrimaryIndex(hoja, linea);
        }

        prim().then(async response => {

            if (stat == true) {

                importe = tablaValoresPresupuesto.getPresupuesto();

                await tablaLineas.getByPrimaryIndex(hoja, linea).then(st => {

                    if (st == true) {
                        titulo = tablaLineas.getTitulo();
                    }
                    else {
                        titulo = "";
                    }

                });

                campos = { hoja, linea, titulo, importe };
            }
            else {
                
                await tablaLineas.getByPrimaryIndex(hoja, linea).then(st => {

                    if (st == true) {
                        titulo = tablaLineas.getTitulo();
                    }
                    else {
                        titulo = "";
                    }

                });

                importe=0.0

                campos = { hoja, linea, titulo, importe };
            }

            const fichero = "./frontend/static/css/index.css";

            var titulo_boton;
            var color_boton;

            disabled_clave = true;
            disabled_campos = false;
            titulo_boton = "Grabar";
            color_boton = rutinas.getStyle(fichero, ".clase_boton_modificacion");

            var content;
            fs.readFile('./views/introducir_valores_presupuesto_detalle.pug', async function read(err, data) {
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
                res.send(pug.render(content, { hoja_intro, dis_campos, titulo_boton, color_boton, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
            });
        });
    }
});

router.post('/introducir_valores_presupuesto_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaValoresPresupuesto = new tabla_valores_ppto.TablaValoresPresupuesto(db);

    var opcion = req.body.opcion;
    var hoja_intro = req.body.hoja_intro;
    var hoja = req.body.HOJA;
    var linea = req.body.LINEA;
    var importe = req.body.IMPORTE;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    await tablaValoresPresupuesto.getByPrimaryIndex(hoja, linea).then(stat => {

        if (stat == true) {
            tablaValoresPresupuesto.registroBlanco();
            tablaValoresPresupuesto.setPresupuesto(importe);
            tablaValoresPresupuesto.setGrabada(true);
            tablaValoresPresupuesto.updateRow(hoja, linea);
        }
        else {
            tablaValoresPresupuesto.registroBlanco();
            tablaValoresPresupuesto.setHoja(hoja);
            tablaValoresPresupuesto.setLinea(linea);
            tablaValoresPresupuesto.setPresupuesto(importe);
            tablaValoresPresupuesto.setGrabada(true);
            tablaValoresPresupuesto.insertRow();
        }
    })

    res.send('');

});

module.exports = router;
