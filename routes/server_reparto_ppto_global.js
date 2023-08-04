// --------------------------------------------------------------
// Servidor: Reparto Presupuesto Global
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_reparto_ppto_global = require('../tablas/tabla_reparto_ppto_global');

/* GET home page. */
router.get('/reparto_ppto_global', async function (req, res, next) {

    var titulo;
    var reparto01;
    var reparto02;
    var reparto03;
    var reparto04;
    var reparto05;
    var reparto06;
    var rows = new Array();

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaRepartoPptoGlobal = new tabla_reparto_ppto_global.TablaRepartoPptoGlobal(db);

    var repartos = [];

    tablaRepartoPptoGlobal.addFirstUno(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
    tablaRepartoPptoGlobal.setOrdenBy('UNO');

    await tablaRepartoPptoGlobal.open().then(async response => {

        var stat = tablaRepartoPptoGlobal.getFirst();

        while (stat == true) {

            repartos = tablaRepartoPptoGlobal.getCifras();
            reparto01 = parseFloat(repartos[1]);
            reparto02 = parseFloat(repartos[2]);
            reparto03 = parseFloat(repartos[3]);
            reparto04 = parseFloat(repartos[4]);
            reparto05 = parseFloat(repartos[5]);
            reparto06 = parseFloat(repartos[6]);

            titulo = "Reparto Global Analitica";
 
            rows.push({ titulo, reparto01, reparto02, reparto03, reparto04, reparto05, reparto06 });

            stat = tablaRepartoPptoGlobal.getNext();
        }

        var content;
        fs.readFile('./views/reparto_ppto_global.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { rows: rows }));
        });

    });

});

module.exports = router;
