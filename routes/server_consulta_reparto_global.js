// -------------------------------------------------
// Consulta Reparto Presupuesto Global
// -------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_hojas = require('../tablas/tabla_hojas');
const tabla_lineas = require('../tablas/tabla_lineas');
const tabla_reparto_ppto_global = require('../tablas/tabla_reparto_ppto_global');

/* GET home page. */
router.get('/consulta_reparto_ppto_global', async function (req, res, next) {

    var hoja;
    var linea;
    var titulo;
    var invisible;
    var coeficientes = new Array(12);
    var rows = new Array();

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

   var tablaRepartoPptoGlobal = new tabla_reparto_ppto_global.TablaRepartoPptoGlobal(db);

    tablaRepartoPptoGlobal.addFirstUno(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
    tablaRepartoPptoGlobal.setOrdenBy('UNO');

    await tablaRepartoPptoGlobal.open().then(async response => {

        var stat = tablaRepartoPptoGlobal.getFirst();

        while (stat == true) {

            coeficientes = tablaRepartoPptoGlobal.getCifras();

            rows.push({ coeficientes });

            stat = tablaRepartoPptoGlobal.getNext();

        }

        res.json(rows);

    });
});

module.exports = router;
