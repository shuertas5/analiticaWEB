// --------------------------------------------------------------
// Servidor: Borrado de Hoja Analitica
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_valores_ppto = require('../tablas/tabla_valores_ppto.js');
const tabla_parametros_app = require('../tablas/tabla_parametros_app.js');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_totales = require('../tablas/tabla_totales.js');
const tabla_cifras = require('../tablas/tabla_cifras.js');
const tabla_cifras_extras = require('../tablas/tabla_cifras_extras.js');
const tabla_presupuesto = require('../tablas/tabla_presupuesto.js');
const tabla_historico_cifras = require('../tablas/tabla_historico_cifras.js');
const tabla_historico_cifras_extras = require('../tablas/tabla_historico_cifras_extras.js');
const tabla_historico_presupuesto = require('../tablas/tabla_historico_presupuesto.js');
const tabla_adicionales_costes = require('../tablas/tabla_adicionales_costes.js');
const tabla_adicionales_correcciones = require('../tablas/tabla_adicionales_correcciones.js');
const tabla_adicionales_estadisticos = require('../tablas/tabla_adicionales_estadisticos.js');
const tabla_acumulados_estadisticos = require('../tablas/tabla_acumulados_estadisticos.js');
const tabla_notas_presupuesto = require('../tablas/tabla_notas_ppto.js');
const tabla_movimientos = require('../tablas/tabla_movimientos.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');

/* GET home page. */
router.get('/borrado_hoja_analitica', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    var rows = [];

    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Borrar Hoja";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

    var tipo_borrado = '0';
    var borrado = '1';

    var content;
    fs.readFile('./views/borrado_hoja_analitica.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { color_boton, titulo_boton, tipo_borrado, borrado, rows: rows }));
    });

});

router.post('/borrado_hoja_analitica', async function (req, res, next) {

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
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaLineasBorrar = new tabla_lineas.TablaLineas(db);
    var tablaPresupuesto = new tabla_presupuesto.TablaPresupuesto(db);
    var tablaTotales = new tabla_totales.TablaTotales(db);
    var tablaCifras = new tabla_cifras.TablaCifras(db);
    var tablaCifrasExtras = new tabla_cifras_extras.TablaCifrasExtras(db);
    var tablaHistoricoCifras = new tabla_historico_cifras.TablaHistoricoCifras(db);
    var tablaHistoricoCifrasExtras = new tabla_historico_cifras_extras.TablaHistoricoCifrasExtras(db);
    var tablaHistoricoPresupuesto = new tabla_historico_presupuesto.TablaHistoricoPresupuesto(db);
    var tablaAdicionalesCostes = new tabla_adicionales_costes.TablaAdicionalesCostes(db);
    var tablaAdicionalesCorrecciones = new tabla_adicionales_correcciones.TablaAdicionalesCorrecciones(db);
    var tablaAdicionalesEstadisticos = new tabla_adicionales_estadisticos.TablaAdicionalesEstadisticos(db);
    var tablaAcumuladosEstadisticos = new tabla_acumulados_estadisticos.TablaAcumuladosEstadisticos(db);
    var tablaNotasPresupuesto = new tabla_notas_presupuesto.TablaNotasPresupuesto(db);
    var tablaMovimientos = new tabla_movimientos.TablaMovimientos(db);

    var hoja = req.body.HOJA;

    var descri_error = '';
    var errores = false;

    await tablaHojas.getByPrimaryIndex(hoja).then(sta => {

        if (sta == false) {
            descri_error += "-- Numero de Hoja NO Existe.\r\n";
            errores = true;
        }

    });

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

        var nlineas = 0;
        var linea;
        var indice;
        var blanca;
        var detotales;
        var anno;
        var anno_actu;

        await tablaParametrosApp.getByPrimaryIndex().then(ret=>{

            if (ret==true) {
                anno_actu=tablaParametrosApp.getAnnoEnCurso();
            }

        })

        // Dar de Baja Datos Adicionales Costes

        tablaAdicionalesCostes.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
        await tablaAdicionalesCostes.open().then(async ret => {

            stat = tablaAdicionalesCostes.getFirst();

            while (stat == true) {

                indice = tablaAdicionalesCostes.getIndice();
                blanca = tablaAdicionalesCostes.getBlanca();

                if (blanca == false) {
                    await tablaAdicionalesCostes.deleteByPrimaryIndex(indice);
                }

                stat = tablaAdicionalesCostes.getNext();
            }

        })

        // Dar de Baja Datos Adicionales Correcciones

        tablaAdicionalesCorrecciones.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
        await tablaAdicionalesCorrecciones.open().then(async ret => {

            stat = tablaAdicionalesCorrecciones.getFirst();

            while (stat == true) {

                indice = tablaAdicionalesCorrecciones.getIndice();
                blanca = tablaAdicionalesCorrecciones.getBlanca();

                if (blanca == false) {
                    await tablaAdicionalesCorrecciones.deleteByPrimaryIndex(indice);
                }

                stat = tablaAdicionalesCorrecciones.getNext();
            }

        })

        // Dar de Baja Datos Adicionales Estadisticos

        tablaAdicionalesEstadisticos.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
        await tablaAdicionalesEstadisticos.open().then(async ret => {

            stat = tablaAdicionalesEstadisticos.getFirst();

            while (stat == true) {

                indice = tablaAdicionalesEstadisticos.getIndice();
                blanca = tablaAdicionalesEstadisticos.getBlanca();

                if (blanca == false) {
                    await tablaAdicionalesEstadisticos.deleteByPrimaryIndex(indice);
                }

                stat = tablaAdicionalesEstadisticos.getNext();
            }

        })

        // Dar de Baja Datos Acumulados Estadisticos

        tablaAcumuladosEstadisticos.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
        await tablaAcumuladosEstadisticos.open().then(async ret => {

            stat = tablaAcumuladosEstadisticos.getFirst();

            while (stat == true) {

                indice = tablaAcumuladosEstadisticos.getIndice();
                blanca = tablaAcumuladosEstadisticos.getBlanca();

                if (blanca == false) {
                    await tablaAcumuladosEstadisticos.deleteByPrimaryIndex(indice);
                }

                stat = tablaAcumuladosEstadisticos.getNext();
            }

        })

        // Dar de Baja Resto de Datos de la Hoja

        tablaLineas.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
        await tablaLineas.open().then(async ret => {

            stat = tablaLineas.getFirst();

            while (stat == true) {

                linea = tablaLineas.getLinea();
                detotales = tablaLineas.getDeTotales();

                tablaCifras.deleteByPrimaryIndex(hoja, linea);
                tablaCifrasExtras.deleteByPrimaryIndex(hoja, linea);
                tablaPresupuesto.deleteByPrimaryIndex(hoja, linea);
                tablaValoresPresupuesto.deleteByPrimaryIndex(hoja, linea);
                tablaNotasPresupuesto.deleteByPrimaryIndex(hoja, linea);

                for (var kk = 1; kk <= 40; kk++) {
                    anno = anno_actu - kk;
                    tablaHistoricoCifras.deleteByPrimaryIndex(anno, hoja, linea);
                    tablaHistoricoCifrasExtras.deleteByPrimaryIndex(anno, hoja, linea);
                    tablaHistoricoPresupuesto.deleteByPrimaryIndex(anno, hoja, linea);
                }

                if (detotales == true) tablaTotales.deleteByPrimaryIndex(hoja, linea);

                await tablaLineasBorrar.deleteByPrimaryIndex(hoja, linea);

                nlineas++;

                stat = tablaLineas.getNext();
            }
        });

        tablaMovimientos.ejecutaSQL("DELETE FROM MOVIMIENTOS WHERE HOJA=" + formato.form("##", hoja, "0"));

        tablaHojas.deleteByPrimaryIndex(hoja);

        conten += "<p style='color: red;'>Borrado de la Hoja Realizado<p>";
        conten += "<p>Borradas " + formato.form('###', nlineas, "H") + " lineas<p>";

        fs.writeSync(fiche, conten, 0);
        fs.closeSync(fiche);

        res.send('');
    }

});

module.exports = router;
