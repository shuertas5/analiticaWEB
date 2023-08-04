// --------------------------------------------------------------
// Servidor: Mantenimiento Hojas Analiticas
// --------------------------------------------------------------

var express = require('express');
const session = require('express-session');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_tipos_hojas = require('../tablas/tabla_tipos_hojas');
const tabla_hojas = require('../tablas/tabla_hojas');
const rutinas = require('../treu/rutinas_server.js');

/* GET home page. */
router.get('/manten_hojas', async function (req, res, next) {

    var hoja;
    var titulo;
    var hoja_externa;
    var tipo_hoja;
    var titulo_tipo;
    var rows = new Array();

    const acceso = require("./procedimientos_varios");

    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaTiposHojas = new tabla_tipos_hojas.TablaTiposHojas(db);

    var stat;
    async function prim(tipo_h) {

        await tablaTiposHojas.getByPrimaryIndex(tipo_h).then(stati => {
            if (stati == true) {
                titulo_tipo = rutinas.acoplarseriemax(tablaTiposHojas.getTitulo(),15);
            }
            else {
                titulo_tipo = "";
            }
        });
    }

    tablaHojas.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
    tablaHojas.setOrdenBy('HOJA');

    await tablaHojas.open().then(async response => {

        var stat = tablaHojas.getFirst();

        while (stat == true) {

            hoja = tablaHojas.getHoja();
            titulo = tablaHojas.getTitulo();
            hoja_externa = tablaHojas.getHojaExterna();
            tipo_hoja = tablaHojas.getTipoHoja();

            await prim(tipo_hoja);

            rows.push({ hoja, titulo, hoja_externa, titulo_tipo });

            stat = tablaHojas.getNext();
        }

        var content;
        fs.readFile('./views/manten_hojas.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { rows: rows }));
        });

    });

});

module.exports = router;
