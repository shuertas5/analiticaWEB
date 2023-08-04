// --------------------------------------------------------------
// Servidor: Mantenimiento de Totales de Lineas Analiticas
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_lineas = require('../tablas/tabla_lineas');
const tabla_hojas = require('../tablas/tabla_hojas');

/* GET home page. */
router.get('/manten_totales', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    var hoja = search_params.get('hoja');

    var rows=[];

    var content;
    fs.readFile('./views/manten_totales.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { hoja, rows: rows }));
    });

});

module.exports = router;
