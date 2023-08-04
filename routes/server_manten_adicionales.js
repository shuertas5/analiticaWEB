// --------------------------------------------------------------
// Servidor: Mantenimiento Datos Adicionales
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const rutinas = require('../treu/rutinas_server.js');

/* GET home page. */
router.get('/manten_adicionales', async function (req, res, next) {
    
    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    var tipo_adicional = search_params.get('tipo_adicional');
    var ordenacion = search_params.get('ordenacion');

    if (ordenacion==null) {
        ordenacion='1';
    }

    var rows=[];

    var content;
    fs.readFile('./views/manten_adicionales.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { tipo_adicional, ordenacion, rows: rows }));
    });

});

module.exports = router;
