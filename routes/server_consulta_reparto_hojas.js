// -------------------------------------------------
// Consulta Reparto Presupuesto Hojas
// -------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_hojas = require('../tablas/tabla_hojas');
const tabla_lineas = require('../tablas/tabla_lineas');
const tabla_reparto_ppto_hojas = require('../tablas/tabla_reparto_ppto_hojas');

/* GET home page. */
router.get('/consulta_reparto_ppto_hojas', async function (req, res, next) {

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

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaRepartoPptoHojas = new tabla_reparto_ppto_hojas.TablaRepartoPptoHojas(db);

    tablaRepartoPptoHojas.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
    tablaRepartoPptoHojas.setOrdenBy('HOJA');

    await tablaRepartoPptoHojas.open().then(async response => {

        var stat = tablaRepartoPptoHojas.getFirst();

        while (stat == true) {

            hoja = tablaRepartoPptoHojas.getHoja();
            coeficientes = tablaRepartoPptoHojas.getCifras();

            await tablaHojas.getByPrimaryIndex(hoja).then(ret => {

                if (ret == true) {
                    titulo = tablaHojas.getTitulo();
                    invisible = tablaHojas.getInvisible();
                }
                else {
                    titulo = "";
                    invisible = false;
                }

            })

            rows.push({ hoja, titulo, invisible, coeficientes });

            stat = tablaRepartoPptoHojas.getNext();

        }

        res.json(rows);

    });
});

module.exports = router;
