// -------------------------------------------------
// Seleccion de tipos de Hojas
// -------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_hojas = require('../tablas/tabla_hojas');

/* GET home page. */
router.get('/seleccion_hojas', async function (req, res, next) {

    var hoja;
    var titulo;
    var invisible;
    var rows = new Array();

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);

    tablaHojas.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
    tablaHojas.setOrdenBy('TIPOHOJA');

    await tablaHojas.open().then(async response => {

        var stat = tablaHojas.getFirst();

        while (stat == true) {

            hoja = tablaHojas.getHoja();
            titulo = tablaHojas.getTitulo();
            invisible = tablaHojas.getInvisible();
            tipo_hoja = tablaHojas.getTipoHoja();

            rows.push({ hoja, titulo, invisible, tipo_hoja });

            stat = tablaHojas.getNext();

        }

        res.json(rows);

    });
});

module.exports = router;
