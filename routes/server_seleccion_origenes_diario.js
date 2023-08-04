// -------------------------------------------------
// Seleccion de origenes de diario
// -------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_origenes_diario = require('../tablas/tabla_origenes_diario');

/* GET home page. */
router.get('/seleccion_origenes_diario', async function (req, res, next) {

    var clave_origen;
    var titulo;
    var rows = new Array();

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaOrigenesDiario = new tabla_origenes_diario.TablaOrigenesDiario(db);

    tablaOrigenesDiario.addFirstClaveOrigen(TablaSQL.TablaSQL.BTR_NOT_EQ, '');
    tablaOrigenesDiario.setOrdenBy('CLAVE_ORIGEN');

    await tablaOrigenesDiario.open().then(async response => {

        var stat = tablaOrigenesDiario.getFirst();

        while (stat == true) {

            clave_origen = tablaOrigenesDiario.getClaveOrigen();
            titulo = tablaOrigenesDiario.getTitulo();

            rows.push({ clave_origen, titulo });

            stat = tablaOrigenesDiario.getNext();

        }

        res.json(rows);

    });
});

module.exports = router;
