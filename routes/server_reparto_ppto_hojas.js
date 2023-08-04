// --------------------------------------------------------------
// Servidor: Reparto Presupuesto Hojas
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_lineas = require('../tablas/tabla_lineas');
const tabla_hojas = require('../tablas/tabla_hojas');
const tabla_reparto_ppto_hojas = require('../tablas/tabla_reparto_ppto_hojas');

/* GET home page. */
router.get('/reparto_ppto_hojas', async function (req, res, next) {

    var hoja;
    var titulo_hoja;
    var reparto01;
    var reparto02;
    var reparto03;
    var reparto04;
    var rows = new Array();

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaRepartoPptoHojas = new tabla_reparto_ppto_hojas.TablaRepartoPptoHojas(db);

    var stat;
    async function prim_hoja(hoja_h) {

        await tablaHojas.getByPrimaryIndex(hoja_h).then(stati => {
            if (stati == true) {
                titulo_hoja = tablaHojas.getTitulo();
            }
            else {
                titulo_hoja = "";
            }
        });
    }

    var repartos = [];

    tablaRepartoPptoHojas.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
    tablaRepartoPptoHojas.setOrdenBy('HOJA');

    await tablaRepartoPptoHojas.open().then(async response => {

        var stat = tablaRepartoPptoHojas.getFirst();

        while (stat == true) {

            hoja = tablaRepartoPptoHojas.getHoja();
            repartos = tablaRepartoPptoHojas.getCifras();
            reparto01 = parseFloat(repartos[1]);
            reparto02 = parseFloat(repartos[2]);
            reparto03 = parseFloat(repartos[3]);
            reparto04 = parseFloat(repartos[4]);
 
            await prim_hoja(hoja);
 
            rows.push({ hoja, titulo_hoja, reparto01, reparto02, reparto03, reparto04 });

            stat = tablaRepartoPptoHojas.getNext();
        }

        var content;
        fs.readFile('./views/reparto_ppto_hojas.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { rows: rows }));
        });

    });

});

module.exports = router;
