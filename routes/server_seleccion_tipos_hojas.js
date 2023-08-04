// -------------------------------------------------
// Seleccion de tipos de Hojas
// -------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_tipos_hojas = require('../tablas/tabla_tipos_hojas');

/* GET home page. */
router.get('/seleccion_tipos_hojas', async function (req, res, next) {

    var tipo;
    var titulo;
    var rows = new Array();

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaTiposHojas = new tabla_tipos_hojas.TablaTiposHojas(db);

    tablaTiposHojas.addFirstTipo(TablaSQL.TablaSQL.BTR_NOT_EQ, '');
    tablaTiposHojas.setOrdenBy('TIPO');

    await tablaTiposHojas.open().then(async response => {

        var stat = tablaTiposHojas.getFirst();

        while (stat == true) {

            tipo = tablaTiposHojas.getTipo();
            titulo = tablaTiposHojas.getTitulo();

            rows.push({ tipo, titulo });

            stat = tablaTiposHojas.getNext();

        }

        res.json(rows);

    });
});

module.exports = router;
