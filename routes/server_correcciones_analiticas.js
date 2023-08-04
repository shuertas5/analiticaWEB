// --------------------------------------------------------------
// Servidor: Correcciones Analiticas
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_correcciones_especiales = require('../tablas/tabla_correcciones_especiales');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_lineas = require('../tablas/tabla_lineas');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');

/* GET home page. */
router.get('/correcciones_analiticas', async function (req, res, next) {

    var indice;
    var hoja;
    var linea;
    var titulo_linea="";
    var importe;
    var importe_str;
    var causa;

    var rows = new Array();

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaCorreccionesEspeciales = new tabla_correcciones_especiales.TablaCorreccionesEspeciales(db);
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);

    var stat;
    async function prim(tipo_h) {

        await tablaLineas.getByPrimaryIndex(hoja,linea).then(stati => {
            if (stati == true) {
                titulo_linea = rutinas.acoplarseriemax(tablaLineas.getTitulo(),20);
            }
            else {
                titulo_linea = "";
            }
        });
    }

    tablaCorreccionesEspeciales.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
    tablaCorreccionesEspeciales.setOrdenBy('HOJA');

    await tablaCorreccionesEspeciales.open().then(async response => {

        var stat = tablaCorreccionesEspeciales.getFirst();

        while (stat == true) {

            indice = tablaCorreccionesEspeciales.getIndice();
            hoja = tablaCorreccionesEspeciales.getHoja();
            linea = tablaCorreccionesEspeciales.getLinea();
            importe = tablaCorreccionesEspeciales.getImporte();
            causa = tablaCorreccionesEspeciales.getCausa();
            importe_str=formato.form('###.###.###,##',importe,"");

            await prim(hoja,linea);

            rows.push({ indice, hoja, linea, titulo_linea, importe, importe_str, causa });

            stat = tablaCorreccionesEspeciales.getNext();
        }

        var content;
        fs.readFile('./views/correcciones_analiticas.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { rows: rows }));
        });

    });

});

module.exports = router;
