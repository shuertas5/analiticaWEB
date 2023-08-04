// --------------------------------------------------------------
// Servidor: Introducir_Valores de Adicionales
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const tabla_adicionales_costes = require('../tablas/tabla_adicionales_costes');
const tabla_adicionales_estadisticos = require('../tablas/tabla_adicionales_estadisticos');
const tabla_adicionales_correcciones = require('../tablas/tabla_adicionales_correcciones');
const tabla_acumulados_estadisticos = require('../tablas/tabla_acumulados_estadisticos');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_hojas = require('../tablas/tabla_hojas');
const tabla_lineas = require('../tablas/tabla_lineas');
const rutinas = require('../treu/rutinas_server.js');
const TablaSQL = require('../tablas/TablaSQL');
const formato = require('../treu/formato.js');

/* GET home page. */
router.get('/introducir_valores_adicionales', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    var tipo_adicional = search_params.get('tipo_adicional');
    var ordenacion = search_params.get('ordenacion');

    if (ordenacion == null) {
        ordenacion = '2';
    }

    const fichero = "./frontend/static/css/index.css";

    var titulo_boton;
    var color_boton;

    var indice = 0;
    var orden = "";
    var titulo_adicional = "";
    var hoja = 0;
    var linea = 0;
    var importe = 0;
    var hoja_linea = "";
    var forma_intro = 'intro';

    var rows = [];

    var campos = { indice, orden, titulo_adicional, hoja, linea, hoja_linea, importe, forma_intro };

    titulo_boton = "Iniciar Grabacion";
    color_boton_grabar = rutinas.getStyle(fichero, ".clase_boton_alta");
    color_boton_iniciar = rutinas.getStyle(fichero, ".boton_formato");

    var content;
    fs.readFile('./views/introducir_valores_adicionales.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { tipo_adicional, ordenacion, campos, titulo_boton, color_boton_grabar, color_boton_iniciar, rows: rows }));
    });

});

module.exports = router;
