// --------------------------------------------------------------
// Servidor: Reparto Presupuesto Hoja Linea
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
const tabla_reparto_ppto_lineas = require('../tablas/tabla_reparto_ppto_lineas');

/* GET home page. */
router.get('/reparto_ppto_hoja_linea', async function (req, res, next) {

    var hoja;
    var linea;
    var titulo_hoja;
    var titulo_linea;
    var reparto01;
    var reparto02;
    var rows = new Array();

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaRepartoPptoLineas = new tabla_reparto_ppto_lineas.TablaRepartoPptoLineas(db);

    var stat;
    async function prim_hoja(hoja_h) {

        await tablaHojas.getByPrimaryIndex(hoja_h).then(stati => {
            if (stati == true) {
                titulo_hoja = rutinas.acoplarseriemax(tablaHojas.getTitulo(),15);
            }
            else {
                titulo_hoja = "";
            }
        });
    }

    async function prim_linea(hoja_h,linea_h) {

        await tablaLineas.getByPrimaryIndex(hoja_h,linea_h).then(stati => {
            if (stati == true) {
                titulo_linea = tablaLineas.getTitulo();
            }
            else {
                titulo_linea = "";
            }
        });
    }

    var repartos = [];

    tablaRepartoPptoLineas.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
    tablaRepartoPptoLineas.setOrdenBy('HOJA,LINEA');

    await tablaRepartoPptoLineas.open().then(async response => {

        var stat = tablaRepartoPptoLineas.getFirst();

        while (stat == true) {

            hoja = tablaRepartoPptoLineas.getHoja();
            linea = tablaRepartoPptoLineas.getLinea();
            repartos = tablaRepartoPptoLineas.getCifras();
            reparto01 = parseFloat(repartos[1]);
            reparto02 = parseFloat(repartos[2]);
 
            await prim_hoja(hoja);
            await prim_linea(hoja,linea);

            rows.push({ hoja, linea, titulo_hoja, titulo_linea, reparto01, reparto02 });

            stat = tablaRepartoPptoLineas.getNext();
        }

        var content;
        fs.readFile('./views/reparto_ppto_hoja_linea.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { rows: rows }));
        });

    });

});

module.exports = router;
