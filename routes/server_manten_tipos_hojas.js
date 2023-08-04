// --------------------------------------------------------------
// Servidor: Mantenimiento Tipos Hojas Analiticas
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_tipos_hojas = require('../tablas/tabla_tipos_hojas');

router.get('/manten_tipos_hojas', async function (req, res, next) {

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

            rows.push({tipo, titulo});

            stat = tablaTiposHojas.getNext();

        }

        var content;
        fs.readFile('./views/manten_tipos_hojas.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { rows: rows }));
        });

    });

});

module.exports = router;
