// --------------------------------------------------------------
// Servidor: Mantenimiento de Asignaciones de Cuentas
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const rutinas = require('../treu/rutinas_server.js');

/* GET home page. */
router.get('/manten_asignaciones', async function (req, res, next) {
    
    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    var ordenacion = search_params.get('ordenacion');
    var buscar_cuenta = search_params.get('buscar_cuenta');;

    if (ordenacion==null) {
        ordenacion='1';
    }

    if (buscar_cuenta==null) {
        buscar_cuenta="";
    }

    var rows=[];

    var content;
    fs.readFile('./views/manten_asignaciones.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { ordenacion, buscar_cuenta, rows: rows }));
    });

});

module.exports = router;
