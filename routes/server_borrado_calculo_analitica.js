// --------------------------------------------------------------
// Servidor: Borrado Calculo Analitica
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_indicadores = require('../tablas/tabla_indicadores.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_cifras = require('../tablas/tabla_cifras.js');
const tabla_cifras_extras = require('../tablas/tabla_cifras_extras.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');

/* GET home page. */
router.get('/borrado_calculo_analitica', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    var rows = [];

    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Borrar Cálculo";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

    var content;
    fs.readFile('./views/borrado_calculo_analitica.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { color_boton, titulo_boton, rows: rows }));
    });

});

router.post('/borrado_calculo_analitica', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var stat;

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaIndicadores = new tabla_indicadores.TablaIndicadores(db);
    var tablaCifras = new tabla_cifras.TablaCifras(db);
    var tablaCifrasExtras = new tabla_cifras_extras.TablaCifrasExtras(db);

    var temporal = "temporal";
    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    // Grabamos el fichero de retorno.txt

    var retorno = "temporal";
    var conten = "";

    var descri_error = '';
    var errores = false;

    var indicadorA;
    var indicadorC;
    var indicadorK;

    await tablaIndicadores.getByPrimaryIndex(1).then(reto => {
        indicadorC = tablaIndicadores.getEncendido();
    });

    await tablaIndicadores.getByPrimaryIndex(3).then(reto => {
        indicadorA = tablaIndicadores.getEncendido();
    });

    await tablaIndicadores.getByPrimaryIndex(6).then(reto => {
        indicadorK = tablaIndicadores.getEncendido();
    });

    errores = false;

    if (indicadorC == true) {
        descri_error += "-- Limpieza No permitida. Analitica Cerrandose.\r\n";
        errores = true;
    }

    if (indicadorA == true) {
        descri_error += "-- Limpieza No permitida. Analitica Abriendose.\r\n";
        errores = true;
    }

    if (indicadorK == true) {
        descri_error += "-- Limpieza No permitida. Reapertura Analitica en Tramite.\r\n";
        errores = true;
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

        // Fijacion de los indicadores al Inicio del proceso

        await tablaIndicadores.getByPrimaryIndex(5).then(reto => {    // Indicador D
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.updateRow(5);
        });

        await tablaIndicadores.getByPrimaryIndex(2).then(reto => {     // Indicador L
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setEncendido(true);
            tablaIndicadores.updateRow(2);
        });

        var hoja;
        var linea;

        // -----------------------------------------
        // Proceso de Limpieza de la Analitica
        // -----------------------------------------

        var num=0;

        tablaCifras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaCifras.setOrdenBy("HOJA,LINEA");

        await tablaCifras.open().then(reto => {

            stat = tablaCifras.getFirst();

            while (stat == true) {

                hoja = tablaCifras.getHoja();
                linea = tablaCifras.getLinea();

                tablaCifras.registroBlanco();
                tablaCifras.setMesCalculo(0.0);
                tablaCifras.updateRow(hoja, linea);

                num++;

                stat = tablaCifras.getNext();
            }

        });

        tablaCifrasExtras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaCifrasExtras.setOrdenBy("HOJA,LINEA");

        await tablaCifrasExtras.open().then(reto => {

            stat = tablaCifrasExtras.getFirst();

            while (stat == true) {

                hoja = tablaCifrasExtras.getHoja();
                linea = tablaCifrasExtras.getLinea();

                tablaCifrasExtras.registroBlanco();
                tablaCifrasExtras.setMesCalculo(0.0);
                tablaCifrasExtras.updateRow(hoja, linea);

                num++;

                stat = tablaCifrasExtras.getNext();
            }

        });

        // Fijacion de los indicadores al final del proceso

        await tablaIndicadores.getByPrimaryIndex(2).then(reto => {  // Indicador L
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.updateRow(2);
        });

        await tablaIndicadores.getByPrimaryIndex(5).then(reto => {  // Indicador D
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.updateRow(5);
        });

        await tablaIndicadores.getByPrimaryIndex(4).then(reto => {  // Indicador B
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.updateRow(4);
        });

        conten += "<p style='color: red;'>Se ha Borrado el Cálculo de la Analítica Correctamente</p>";
        conten += "<p>Datos de " + formato.form('###.###', num, "") + " Lineas Borradas</p>";

        fs.writeSync(fiche, conten, 0);
        fs.closeSync(fiche);

        res.send('');
    }

});

module.exports = router;
