// --------------------------------------------------------------
// Servidor: Introducir Valores a Adicionales Detalle
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_adicionales_costes = require('../tablas/tabla_adicionales_costes');
const tabla_adicionales_estadisticos = require('../tablas/tabla_adicionales_estadisticos');
const tabla_adicionales_correcciones = require('../tablas/tabla_adicionales_correcciones');
const tabla_acumulados_estadisticos = require('../tablas/tabla_acumulados_estadisticos');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_lineas = require('../tablas/tabla_lineas');
const rutinas = require('../treu/rutinas_server.js');
const { response } = require('express');

/* GET home page. */
router.get('/introducir_valores_adicionales_detalle', function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var indice = search_params.get('indice');
    var tipo_adicional = search_params.get('tipo_adicional');
    var hoja;
    var linea;
    var importe;
    var causa;

    if (opcion != null && opcion != undefined) {

        const acceso = require("./procedimientos_varios")
        var db = acceso.accesoDB(req.session.empresa);

        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaAdicionalesCostes = new tabla_adicionales_costes.TablaAdicionalesCostes(db);
        var tablaAdicionalesEstadisticos = new tabla_adicionales_estadisticos.TablaAdicionalesEstadisticos(db);
        var tablaAdicionalesCorrecciones = new tabla_adicionales_correcciones.TablaAdicionalesCorrecciones(db);
        var tablaAcumuladosEstadisticos = new tabla_acumulados_estadisticos.TablaAcumuladosEstadisticos(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        var stat;
        async function prim() {
            if (tipo_adicional == 'costes') {
                stat = await tablaAdicionalesCostes.getByPrimaryIndex(indice);
            }
            else if (tipo_adicional == 'estadisticos') {
                stat = await tablaAdicionalesEstadisticos.getByPrimaryIndex(indice);
            }
            else if (tipo_adicional == 'correcciones') {
                stat = await tablaAdicionalesCorrecciones.getByPrimaryIndex(indice);
            }
            else if (tipo_adicional == 'acum_estadisticos') {
                stat = await tablaAcumuladosEstadisticos.getByPrimaryIndex(indice);
            }
        }

        prim().then(async response => {

            if (stat == true) {
                if (tipo_adicional == 'costes') {
                    titulo = tablaAdicionalesCostes.getTitulo();
                    hoja = tablaAdicionalesCostes.getHoja();
                    linea = tablaAdicionalesCostes.getLinea();
                    blanca = tablaAdicionalesCostes.getBlanca();
                    orden = tablaAdicionalesCostes.getOrden();
                    importe = tablaAdicionalesCostes.getImporte();
                }
                else if (tipo_adicional == 'estadisticos') {
                    titulo = tablaAdicionalesEstadisticos.getTitulo();
                    hoja = tablaAdicionalesEstadisticos.getHoja();
                    linea = tablaAdicionalesEstadisticos.getLinea();
                    blanca = tablaAdicionalesEstadisticos.getBlanca();
                    orden = tablaAdicionalesEstadisticos.getOrden();
                    importe = tablaAdicionalesEstadisticos.getImporte();
                }
                else if (tipo_adicional == 'correcciones') {
                    titulo = tablaAdicionalesCorrecciones.getTitulo();
                    hoja = tablaAdicionalesCorrecciones.getHoja();
                    linea = tablaAdicionalesCorrecciones.getLinea();
                    blanca = tablaAdicionalesCorrecciones.getBlanca();
                    orden = tablaAdicionalesCorrecciones.getOrden();
                    importe = tablaAdicionalesCorrecciones.getImporte();
                }
                else if (tipo_adicional == 'acum_estadisticos') {
                    titulo = tablaAcumuladosEstadisticos.getTitulo();
                    hoja = tablaAcumuladosEstadisticos.getHoja();
                    linea = tablaAcumuladosEstadisticos.getLinea();
                    blanca = tablaAcumuladosEstadisticos.getBlanca();
                    orden = tablaAcumuladosEstadisticos.getOrden();
                    importe = tablaAcumuladosEstadisticos.getImporte();
                }

                var titu_linea;
                await tablaLineas.getByPrimaryIndex(hoja, linea).then(st => {
                    if (st == true) {
                        titu_linea = tablaLineas.getTitulo();
                    }
                    else {
                        titu_linea = "";
                    }
                });

                campos = { indice, hoja, linea, titulo, blanca, orden, importe, titu_linea };
            }

            const fichero = "./frontend/static/css/index.css";

            var titulo_boton;
            var color_boton;

            disabled_clave = true;
            disabled_campos = false;
            titulo_boton = "Grabar";
            color_boton = rutinas.getStyle(fichero, ".clase_boton_modificacion");

            var content;
            fs.readFile('./views/introducir_valores_adicionales_detalle.pug', async function read(err, data) {
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
                res.send(pug.render(content, { tipo_adicional, dis_campos, titulo_boton, color_boton, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
            });
        });
    }
});

router.post('/introducir_valores_adicionales_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaAdicionalesCostes = new tabla_adicionales_costes.TablaAdicionalesCostes(db);
    var tablaAdicionalesEstadisticos = new tabla_adicionales_estadisticos.TablaAdicionalesEstadisticos(db);
    var tablaAdicionalesCorrecciones = new tabla_adicionales_correcciones.TablaAdicionalesCorrecciones(db);
    var tablaAcumuladosEstadisticos = new tabla_acumulados_estadisticos.TablaAcumuladosEstadisticos(db);

    var opcion = req.body.opcion;
    var tipo_adicional = req.body.tipo_adicional;
    var indice = req.body.INDICE;
    var importe = req.body.IMPORTE;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    if (tipo_adicional == 'costes') {
        tablaAdicionalesCostes.registroBlanco();
        tablaAdicionalesCostes.setImporte(importe);
        tablaAdicionalesCostes.setGrabada(true);
        tablaAdicionalesCostes.updateRow(indice);
    }

    if (tipo_adicional == 'estadisticos') {
        tablaAdicionalesEstadisticos.registroBlanco();
        tablaAdicionalesEstadisticos.setImporte(importe);
        tablaAdicionalesEstadisticos.setGrabada(true);
        tablaAdicionalesEstadisticos.updateRow(indice);
    }

    if (tipo_adicional == 'acum_estadisticos') {
        tablaAcumuladosEstadisticos.registroBlanco();
        tablaAcumuladosEstadisticos.setImporte(importe);
        tablaAcumuladosEstadisticos.setGrabada(true);
        tablaAcumuladosEstadisticos.updateRow(indice);
    }

    if (tipo_adicional == 'correcciones') {
        tablaAdicionalesCorrecciones.registroBlanco();
        tablaAdicionalesCorrecciones.setImporte(importe);
        tablaAdicionalesCorrecciones.setGrabada(true);
        tablaAdicionalesCorrecciones.updateRow(indice);
    }

    res.send('');

});

module.exports = router;
