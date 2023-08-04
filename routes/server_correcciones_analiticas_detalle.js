// --------------------------------------------------------------
// Servidor: Mantenimiento detalle Correcciones Analiticas
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_correcciones_especiales = require('../tablas/tabla_correcciones_especiales');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_lineas = require('../tablas/tabla_lineas');
const rutinas = require('../treu/rutinas_server.js');
const { response } = require('express');

/* GET home page. */
router.get('/correcciones_analiticas_detalle', function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var indice = search_params.get('indice');
    var hoja;
    var linea;
    var importe;
    var causa;

    if (opcion != null && opcion != undefined) {

        const acceso = require("./procedimientos_varios")
        var db = acceso.accesoDB(req.session.empresa);

        var tablaCorreccionesEspeciales = new tabla_correcciones_especiales.TablaCorreccionesEspeciales(db);
        var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
        var tablaLineas = new tabla_lineas.TablaLineas(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        var stat;
        async function prim() {
            if (opcion != 'alta') {
                stat = await tablaCorreccionesEspeciales.getByPrimaryIndex(indice);
            }
        }

        prim().then(async response => {

            if (stat == true) {
                indice = tablaCorreccionesEspeciales.getIndice();
                hoja = tablaCorreccionesEspeciales.getHoja();
                linea = tablaCorreccionesEspeciales.getLinea();
                importe = tablaCorreccionesEspeciales.getImporte();
                causa = tablaCorreccionesEspeciales.getCausa();
                campos = { indice, hoja, linea, importe, causa };
            }

            const fichero = "./frontend/static/css/index.css";

            var titulo_boton;
            var color_boton;

            if (opcion == 'alta') {

                tablaCorreccionesEspeciales.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
                tablaCorreccionesEspeciales.setOrdenBy('INDICE DESC');
                await tablaCorreccionesEspeciales.open().then(response => {

                    stat = tablaCorreccionesEspeciales.getFirst();

                    if (stat == false) {
                        indice = 1;
                    }
                    else {
                        indice = tablaCorreccionesEspeciales.getIndice() + 1;
                    }

                });

                disabled_clave = false;
                disabled_campos = false;
                hoja = 0;
                linea = 0;
                importe = 0;
                causa = "";
                linea_resultado = 0;
                linea_facturacion = 0;
                campos = { indice, hoja, linea, importe, causa };
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
            fs.readFile('./views/correcciones_analiticas_detalle.pug', async function read(err, data) {
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
                res.send(pug.render(content, { dis_campos, titulo_boton, color_boton, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
            });
        });
    }
});

router.post('/correcciones_analiticas_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaCorreccionesEspeciales = new tabla_correcciones_especiales.TablaCorreccionesEspeciales(db);
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);

    var opcion = req.body.opcion;
    var indice = req.body.INDICE;
    var hoja = req.body.HOJA;
    var linea = req.body.LINEA;
    var importe = req.body.IMPORTE;
    var causa = req.body.CAUSA;

    var estadistica = false;
    var de_totales = false;
    var linea_blanca = false;
    var linea_sumable = false;
    var linea_novisible = false;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    var obligatorio_causa = true;
    var permite_en_novisible = false;

    if (opcion == 'alta') {

        var stat;
        async function prim() {
            stat = await tablaLineas.getByPrimaryIndex(hoja, linea);
        }

        prim().then(async response => {

            if (stat == false) {

                descri_error += "-- Numero de Linea No Existe\r\n";
                errores = true;

            }
            else {

                estadistica = tablaLineas.getEstadistica();
                de_totales = tablaLineas.getDeTotales();
                linea_blanca = tablaLineas.getBlanca();
                linea_sumable = tablaLineas.getSumable();
                linea_novisible = tablaLineas.getInvisible();

            }

            var stat2;
            async function prim2() {
                stat2 = await tablaParametrosApp.getByPrimaryIndex();
            }

            prim2().then(async response => {

                //obligatorio_causa = tablaParametrosApp.getObligaDescAdicional();
                permite_en_novisible = tablaParametrosApp.getCargosLineaNoVisible();

                if (estadistica == true) {
                    descri_error += "-- Importes no pueden ir a lineas estadisticas\r\n";
                    errores = true;
                }
                if (linea_blanca == true) {
                    descri_error += "-- Importes no pueden ir a lineas blancas\r\n";
                    errores = true;
                }
                if (de_totales == true) {
                    descri_error += "-- Importes no pueden ir a lineas de Totales\r\n";
                    errores = true;
                }
                if (linea_sumable == false) {
                    descri_error += "-- Importes deben ir a lineas Sumables\r\n";
                    errores = true;
                }
                if (linea_novisible == true && permite_en_novisible == false) {
                    descri_error += "-- Importes deben ir a lineas Visibles\r\n";
                    errores = true;
                }
                if (obligatorio_causa == true && causa.length < 6) {
                    descri_error += "-- Debe especificar una causa de la correccion\r\n";
                    errores = true;
                }

                var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
                fs.writeSync(fiche, descri_error, 0);
                fs.closeSync(fiche);

                if (errores == false) {

                    tablaCorreccionesEspeciales.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
                    tablaCorreccionesEspeciales.setOrdenBy('INDICE DESC');
                    await tablaCorreccionesEspeciales.open().then(response => {

                        stat = tablaCorreccionesEspeciales.getFirst();

                        if (stat == false) {
                            indice = 1;
                        }
                        else {
                            indice = tablaCorreccionesEspeciales.getIndice() + 1;
                        }

                        tablaCorreccionesEspeciales.registroBlanco();
                        tablaCorreccionesEspeciales.setIndice(indice);
                        tablaCorreccionesEspeciales.setHoja(hoja);
                        tablaCorreccionesEspeciales.setLinea(linea);
                        tablaCorreccionesEspeciales.setImporte(importe);
                        tablaCorreccionesEspeciales.setCausa(causa);
                        tablaCorreccionesEspeciales.setGrabada(true);
                        tablaCorreccionesEspeciales.insertRow();

                    });
                }

                res.send('');

            });

        });

    }

    if (opcion == 'modificacion') {

        var stat;
        async function prim() {
            stat = await tablaLineas.getByPrimaryIndex(hoja, linea);
        }

        prim().then(async response => {

            if (stat == false) {

                descri_error += "-- Numero de Linea No Existe\r\n";
                errores = true;

            }
            else {

                estadistica = tablaLineas.getEstadistica();
                de_totales = tablaLineas.getDeTotales();
                linea_blanca = tablaLineas.getBlanca();
                linea_sumable = tablaLineas.getSumable();
                linea_novisible = tablaLineas.getInvisible();

            }

            var stat2;
            async function prim2() {
                stat2 = await tablaParametrosApp.getByPrimaryIndex();
            }

            prim2().then(async response => {

                //obligatorio_causa = tablaParametrosApp.getObligaDescAdicional();
                permite_en_novisible = tablaParametrosApp.getCargosLineaNoVisible();

                if (estadistica == true) {
                    descri_error += "-- Importes no pueden ir a lineas estadisticas\r\n";
                    errores = true;
                }
                if (linea_blanca == true) {
                    descri_error += "-- Importes no pueden ir a lineas blancas\r\n";
                    errores = true;
                }
                if (de_totales == true) {
                    descri_error += "-- Importes no pueden ir a lineas de Totales\r\n";
                    errores = true;
                }
                if (linea_sumable == false) {
                    descri_error += "-- Importes deben ir a lineas Sumables\r\n";
                    errores = true;
                }
                if (linea_novisible == true && permite_en_novisible == false) {
                    descri_error += "-- Importes deben ir a lineas Visibles\r\n";
                    errores = true;
                }
                if (obligatorio_causa == true && causa.length < 6) {
                    descri_error += "-- Debe especificar una causa de la correccion\r\n";
                    errores = true;
                }

                var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
                fs.writeSync(fiche, descri_error, 0);
                fs.closeSync(fiche);

                if (errores == false) {

                    tablaCorreccionesEspeciales.registroBlanco();
                    tablaCorreccionesEspeciales.setHoja(hoja);
                    tablaCorreccionesEspeciales.setLinea(linea);
                    tablaCorreccionesEspeciales.setImporte(importe);
                    tablaCorreccionesEspeciales.setCausa(causa);
                    tablaCorreccionesEspeciales.setGrabada(true);
                    tablaCorreccionesEspeciales.updateRow(indice);

                }

                res.send('');
            })

        });

    }
    
    if (opcion == 'baja') {

        tablaCorreccionesEspeciales.deleteByPrimaryIndex(indice);

        res.send('');

    }

});

module.exports = router;
