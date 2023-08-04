// -------------------------------------------------
// Consulta Reparto Presupuesto Lineas
// -------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_hojas = require('../tablas/tabla_hojas');
const tabla_lineas = require('../tablas/tabla_lineas');
const tabla_reparto_ppto_lineas = require('../tablas/tabla_reparto_ppto_lineas');

/* GET home page. */
router.get('/consulta_reparto_ppto_lineas', async function (req, res, next) {

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

    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaRepartoPptoLineas = new tabla_reparto_ppto_lineas.TablaRepartoPptoLineas(db);

    tablaRepartoPptoLineas.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
    tablaRepartoPptoLineas.setOrdenBy('HOJA,LINEA');

    await tablaRepartoPptoLineas.open().then(async response => {

        var stat = tablaRepartoPptoLineas.getFirst();

        while (stat == true) {

            hoja = tablaRepartoPptoLineas.getHoja();
            linea = tablaRepartoPptoLineas.getLinea();
            coeficientes = tablaRepartoPptoLineas.getCifras();

            await tablaLineas.getByPrimaryIndex(hoja, linea).then(ret => {

                if (ret == true) {
                    titulo = tablaLineas.getTitulo();
                    invisible = tablaLineas.getInvisible();
                }
                else {
                    titulo = "";
                    invisible = false;
                }

            })

            rows.push({ hoja, linea, titulo, invisible, coeficientes });

            stat = tablaRepartoPptoLineas.getNext();

        }

        res.json(rows);

    });
});

module.exports = router;
