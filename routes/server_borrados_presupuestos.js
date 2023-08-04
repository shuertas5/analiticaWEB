// --------------------------------------------------------------
// Servidor: Borrados del Presupuesto Analitico
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_presupuesto = require('../tablas/tabla_presupuesto.js');
const tabla_valores_ppto = require('../tablas/tabla_valores_ppto.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_indicadores = require('../tablas/tabla_indicadores.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');

/* GET home page. */
router.get('/borrados_presupuestos', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    var rows = [];

    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Borrar Presupuesto";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

    var tipo_borrado = '0';
    var borrado = '1';

    var content;
    fs.readFile('./views/borrados_presupuestos.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { color_boton, titulo_boton, tipo_borrado, borrado, rows: rows }));
    });

});

router.post('/borrados_presupuestos', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var stat;

    var temporal = "temporal";
    var retorno = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    fiche = fs.openSync("./" + retorno + "/retorno.html", "w");
    fs.closeSync(fiche);

    var tablaPresupuesto = new tabla_presupuesto.TablaPresupuesto(db);
    var tablaValoresPresupuesto = new tabla_valores_ppto.TablaValoresPresupuesto(db);
    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaIndicadores = new tabla_indicadores.TablaIndicadores(db);

    var tipo_borrado = req.body.TIPO_BORRADO;
    var hoja = req.body.HOJA;
    var borrado = req.body.BORRADO;

    var descri_error = '';
    var errores = false;

    if (tipo_borrado == 2 && borrado == 2) {

        await tablaHojas.getByPrimaryIndex(hoja).then(sta => {

            if (sta == false) {
                descri_error += "-- Numero de Hoja NO Existe.\r\n";
                errores = true;
            }

        });

    }

    if (errores == true) {
        fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);
        res.send('');
    }
    else {

        retorno = "temporal";
        var conten = "";

        fiche = fs.openSync("./" + retorno + "/retorno.html", "w");

        if (tipo_borrado == 1) {

            tablaPresupuesto.ejecutaSQL("DELETE FROM PRESUPUESTO");

            // Fijacion de los indicadores al Inicio del proceso

            await tablaIndicadores.getByPrimaryIndex(8).then(sta => {  // Indicador A
                if (sta == true) {
                    tablaIndicadores.registroBlanco();
                    tablaIndicadores.setEncendido(false);
                    tablaIndicadores.updateRow(8);
                }
            });

            await tablaIndicadores.getByPrimaryIndex(9).then(sta => {  // Indicador B
                if (sta == true) {
                    tablaIndicadores.registroBlanco();
                    tablaIndicadores.setEncendido(false);
                    tablaIndicadores.updateRow(9);
                }
            });

            conten += "<p style='color: red;'>Calculo del Presupuesto Borrado Correctamente<p>";

        }

        if (tipo_borrado == 2 && borrado == 2) {

            await tablaValoresPresupuesto.deleteValoresHoja(hoja).then(ret => {
                conten += "<p style='color: red;'>Valores del Presupuesto Borrados Correctamente<p>";
                conten += "<p>Datos Hoja: " + formato.form('##', hoja, "") + " Borrados<p>";
            });

        }

        if (tipo_borrado == 2 && borrado == 1) {

            var hojax;
            var num = 0;

            tablaHojas.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
            tablaHojas.setOrdenBy('HOJA');

            await tablaHojas.open().then(async sta => {

                stat = tablaHojas.getFirst();

                while (stat == true) {

                    hojax = tablaHojas.getHoja();

                    await tablaValoresPresupuesto.deleteValoresHoja(hojax).then(ret=>{

                        num++;

                    });

                    stat = tablaHojas.getNext();
                }

            });

            conten += "<p style='color: red;'>Valores del Presupuesto Borrados Correctamente<p>";
            conten += "<p>Datos de " + formato.form('##', num, "") + " Hojas Borradas<p>";

        }

        fs.writeSync(fiche, conten, 0);
        fs.closeSync(fiche);

        res.send('');
    }

});

module.exports = router;
