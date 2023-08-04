// -------------------------------------------------
// Seleccion de Lineas Analiticas
// -------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_hojas = require('../tablas/tabla_hojas');
const tabla_lineas = require('../tablas/tabla_lineas');

/* GET home page. */
router.get('/seleccion_lineas', async function (req, res, next) {

    var hoja;
    var linea;
    var titulo;
    var invisible;
    var intensa;
    var rows = new Array();

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    hoja = search_params.get('hoja');
 
    var tablaLineas = new tabla_lineas.TablaLineas(db);

    tablaLineas.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
    tablaLineas.setOrdenBy('HOJA,LINEA');

    await tablaLineas.open().then(async response => {

        var stat = tablaLineas.getFirst();

        while (stat == true) {

            linea = tablaLineas.getLinea();
            titulo = tablaLineas.getTitulo();
            invisible = tablaLineas.getInvisible();
            intensa = tablaLineas.getIntensa();

            rows.push({ linea, titulo, invisible, intensa });

            stat = tablaLineas.getNext();

        }

        res.json(rows);

    });
});

module.exports = router;
