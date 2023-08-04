// --------------------------------------------------------------
// Servidor: Introducir_Valores de Presupuesto
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_hojas = require('../tablas/tabla_hojas');
const tabla_lineas = require('../tablas/tabla_lineas');
const rutinas = require('../treu/rutinas_server.js');
const TablaSQL = require('../tablas/TablaSQL');
const formato = require('../treu/formato.js');

/* GET home page. */
router.get('/introducir_valores_presupuesto', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    var hoja_intro = search_params.get('hoja_intro');

    if (hoja_intro==undefined || hoja_intro==null) {
        hoja_intro=0;
    }

    const fichero = "./frontend/static/css/index.css";

    var titulo_boton;
    var color_boton;

    var titulo = "";
    var hoja = 0;
    var linea = 0;
    var importe = 0;
    var forma_intro = 'intro';

    var rows = [];

    var campos = { titulo, hoja, linea, importe, forma_intro };

    titulo_boton = "Iniciar Grabacion";
    color_boton_grabar = rutinas.getStyle(fichero, ".clase_boton_alta");
    color_boton_iniciar = rutinas.getStyle(fichero, ".boton_formato");

    var content;
    fs.readFile('./views/introducir_valores_presupuesto.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { hoja_intro, campos, titulo_boton, color_boton_grabar, color_boton_iniciar, rows: rows }));
    });

});

module.exports = router;
