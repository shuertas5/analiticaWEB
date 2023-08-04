// --------------------------------------------------------------
// Servidor: Reapertura Cierre de la Analitica
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_asignaciones = require('../tablas/tabla_asignaciones');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_totales = require('../tablas/tabla_totales.js');
const tabla_indicadores = require('../tablas/tabla_indicadores.js');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_adicionales_costes = require('../tablas/tabla_adicionales_costes.js');
const tabla_adicionales_correcciones = require('../tablas/tabla_adicionales_correcciones.js');
const tabla_adicionales_estadisticos = require('../tablas/tabla_adicionales_estadisticos.js');
const tabla_acumulados_estadisticos = require('../tablas/tabla_acumulados_estadisticos.js');
const tabla_correcciones_especiales = require('../tablas/tabla_correcciones_especiales');
const tabla_movimientos = require('../tablas/tabla_movimientos.js');
const tabla_diario_fichero = require('../tablas/tabla_diario_fichero.js');
const tabla_cifras = require('../tablas/tabla_cifras.js');
const tabla_cifras_extras = require('../tablas/tabla_cifras_extras.js');
const tabla_diario_copia = require('../tablas/tabla_diario_copia.js');
const tabla_adic_costes_copia = require('../tablas/tabla_adic_costes_copia.js');
const tabla_adic_correcciones_copia = require('../tablas/tabla_adic_correcciones_copia.js');
const tabla_adic_estadisticos_copia = require('../tablas/tabla_adic_estadisticos_copia.js');
const tabla_acum_estadisticos_copia = require('../tablas/tabla_acum_estadisticos_copia.js');
const tabla_correcciones_especiales_copia = require('../tablas/tabla_correcciones_especiales_copia');
const rutinas = require('../treu/rutinas_server.js');
const impresion = require('../treu/treu_print_courier_pdf.js');
const formato = require('../treu/formato.js');
const fecha = require('../treu/forfecha.js');

/* GET home page. */
router.get('/reapertura_cierre_analitica', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    var no_adicionales = rutinas.parseBoolean(search_params.get('no_adicionales'));

    var retorno = "temporal";
    var fiche = fs.openSync("./" + retorno + "/retorno.html", "w");
    fs.closeSync(fiche);

    var rows = [];

    var mes_actu;
    var anno_actu;
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);

    await tablaParametrosApp.getByPrimaryIndex().then(ret => {

        if (ret == true) {
            mes_actu = tablaParametrosApp.getMesEnCurso();
            anno_actu = tablaParametrosApp.getAnnoEnCurso();
        }

    })

    var mes_letra = formato.form('##', mes_actu, "0") + " / " + rutinas.mesesLetras(mes_actu, false);
    var anno_format = formato.form("#.###", anno_actu, "");

    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Reapertura Analitica";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

    var content;
    fs.readFile('./views/reapertura_cierre_analitica.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { color_boton, titulo_boton, no_adicionales, mes_letra, anno_format, rows: rows }));
    });

});

router.post('/reapertura_cierre_analitica', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var stat;
    var chequeo = true;

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaTotales = new tabla_totales.TablaTotales(db);
    var tablaIndicadores = new tabla_indicadores.TablaIndicadores(db);
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaLineas2 = new tabla_lineas.TablaLineas(db);
    var tablaAdicionalesCostes = new tabla_adicionales_costes.TablaAdicionalesCostes(db);
    var tablaAdicionalesCorrecciones = new tabla_adicionales_correcciones.TablaAdicionalesCorrecciones(db);
    var tablaAdicionalesEstadisticos = new tabla_adicionales_estadisticos.TablaAdicionalesEstadisticos(db);
    var tablaAcumuladosEstadisticos = new tabla_acumulados_estadisticos.TablaAcumuladosEstadisticos(db);
    var tablaMovimientos = new tabla_movimientos.TablaMovimientos(db);
    var tablaDiarioFichero = new tabla_diario_fichero.TablaDiarioFichero(db);
    var tablaCifras = new tabla_cifras.TablaCifras(db);
    var tablaCifrasExtras = new tabla_cifras_extras.TablaCifrasExtras(db);
    var tablaAsignaciones = new tabla_asignaciones.TablaAsignaciones(db);
    var tablaCorreccionesEspeciales = new tabla_correcciones_especiales.TablaCorreccionesEspeciales(db);
    var tablaAdicionalesCostesCopia = new tabla_adic_costes_copia.TablaAdicCostesCopia(db);
    var tablaAdicionalesCorreccionesCopia = new tabla_adic_correcciones_copia.TablaAdicCorreccionesCopia(db);
    var tablaAdicionalesEstadisticosCopia = new tabla_adic_estadisticos_copia.TablaAdicEstadisticosCopia(db);
    var tablaAcumuladosEstadisticosCopia = new tabla_acum_estadisticos_copia.TablaAcumEstadisticosCopia(db);
    var tablaCorreccionesEspecialesCopia = new tabla_correcciones_especiales_copia.TablaCorreccionesEspecialesCopia(db);
    var tablaDiarioCopia = new tabla_diario_copia.TablaDiarioCopia(db);

    var temporal = "temporal";
    var retorno = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    fiche = fs.openSync("./" + retorno + "/retorno.html", "w");
    fs.closeSync(fiche);

    var errores, stat, grabada, parcialerrores, detotales, sumable, novisible;
    var avance, hoja, linea, i, kk, s;
    var importe, suma, impor;

    var numcomponentes;
    var coeficientes = new Array(45);
    var hojascomp = new Array(45);
    var lineascomp = new Array(45);
    var mascomp = new Array(45);

    var reparto = new Array(12);
    var valoresmeses = new Array(12);
    var cifr = new Array(12);
    var sumacifr = new Array(12);

    var cifras = new Array(24);

    var indicadorA, indicadorL, indicadorB, indicadorD;
    var errores;
    var impresoraabierta = false;
    var hojaimpre = 1;

    await tablaIndicadores.getByPrimaryIndex(3).then(reto => {
        indicadorA = tablaIndicadores.getEncendido();
    });

    await tablaIndicadores.getByPrimaryIndex(2).then(reto => {
        indicadorL = tablaIndicadores.getEncendido();
    });

    await tablaIndicadores.getByPrimaryIndex(4).then(reto => {
        indicadorB = tablaIndicadores.getEncendido();
    });

    await tablaIndicadores.getByPrimaryIndex(5).then(reto => {
        indicadorD = tablaIndicadores.getEncendido();
    });

    var descri_error="";
    var errores = false;

    if (indicadorA == true) {
        descri_error += "-- Reapertura No permitida. Analitica Abriendose.\r\n";
        errores = true;
    }

    if (indicadorL == true) {
        descri_error += "-- Reapertura No permitida. Analítica a Medio Limpiar.\r\n";
        errores = true;
    }

    if (indicadorB == true) {
        descri_error += "-- Reapertura No permitida. Analítica a Medio Calcular.\r\n";
        errores = true;
    }

    if (indicadorD == true) {
        descri_error += "-- Reapertura No permitida. Analítica Calculada.\r\n";
        errores = true;
    }

    if (errores == true) {
        fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);
        res.send('');
    }
    else {

        var importe;
        var signo;
        var descripcion;
        var blanca;
        var blanca2;
        var referencia;
        var fechax;
        var origen;
        var indice;
        var importesig;
        var detotales;
        var novisible;

        var num=0;

        // Fijacion de los indicadores al Inicio del proceso

        await tablaIndicadores.getByPrimaryIndex(6).then(reto => {   // Indicador K
            tablaIndicadores.setEncendido(true);
            tablaIndicadores.updateRow(6);
        });

        await tablaIndicadores.getByPrimaryIndex(7).then(reto => {    // Indicador J
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.updateRow(7);
        });

        var mes_actu;
        var anno_actu;
        var tituloempresa;
        await tablaParametrosApp.getByPrimaryIndex().then(sta => {
            if (sta == true) {
                tituloempresa = tablaParametrosApp.getTituloEmpresa();
                mes_actu = tablaParametrosApp.getMesEnCurso();
                anno_actu = tablaParametrosApp.getAnnoEnCurso();
            }
            else {
                tituloempresa = "";
                mes_actu = 1;
                anno_actu = 2022;
            }
        })

        // -----------------------------------------
        // Proceso de Reapertura de la Analitica
        // -----------------------------------------

        tablaCifras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaCifras.setOrdenBy("HOJA,LINEA");

        await tablaCifras.open().then(reto => {

            stat = tablaCifras.getFirst();

            while (stat == true) {

                hoja = tablaCifras.getHoja();
                linea = tablaCifras.getLinea();

                cerrada = tablaCifras.getCerrada();
                cifras = tablaCifras.getCifras();

                mescalculo = cifras[23];
                for (i = 1; i <= 23; i++) {
                    cifras[25 - i - 1] = cifras[25 - i - 1 - 1];
                }
                cifras[0] = 0.0;

                if (cerrada == false) {
                    tablaCifras.registroBlanco();
                    tablaCifras.setCifras(cifras);
                    tablaCifras.setMesCalculo(0.0);
                    tablaCifras.setCerrada(true);
                    tablaCifras.updateRow(hoja, linea);
                }

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

                cerrada = tablaCifrasExtras.getCerrada();
                cifras = tablaCifrasExtras.getCifras();

                mescalculo = cifras[23];
                for (i = 1; i <= 23; i++) {
                    cifras[25 - i - 1] = cifras[25 - i - 1 - 1];
                }
                cifras[0] = 0.0;

                if (cerrada == false) {
                    tablaCifrasExtras.registroBlanco();
                    tablaCifrasExtras.setCifras(cifras);
                    tablaCifrasExtras.setMesCalculo(0.0);
                    tablaCifrasExtras.setCerrada(true);
                    tablaCifrasExtras.updateRow(hoja, linea);
                }

                num++;

                stat = tablaCifrasExtras.getNext();
            }

        });

        // Copiar Datos de Ficheros de Copia

        tablaDiarioFichero.ejecutaSQL("DELETE FROM DIARIO_FICHERO");
        tablaCorreccionesEspeciales.ejecutaSQL("DELETE FROM CORRECCIONES_ESPE");

        tablaDiarioCopia.addFirstCuenta(TablaSQL.TablaSQL.BTR_NOT_EQ, "");
        tablaDiarioCopia.setOrdenBy("CUENTA,SUBCUENTA");

        await tablaDiarioCopia.open().then(reto => {

            stat = tablaDiarioCopia.getFirst();

            while (stat == true) {

                claveorigen = tablaDiarioCopia.getOrigen();
                secuen = tablaDiarioCopia.getSecuencia();
                cuenta = tablaDiarioCopia.getCuenta();
                subcuenta = tablaDiarioCopia.getSubCuenta();
                fechax = tablaDiarioCopia.getFecha();
                referencia = tablaDiarioCopia.getReferencia();
                importe = tablaDiarioCopia.getImporte();
                signo = tablaDiarioCopia.getSigno();
                descripcion = tablaDiarioCopia.getDescripcion();

                tablaDiarioFichero.registroBlanco();
                tablaDiarioFichero.setOrigen(claveorigen);
                tablaDiarioFichero.setSecuencia(secuen);
                tablaDiarioFichero.setCuenta(cuenta);
                tablaDiarioFichero.setSubCuenta(subcuenta);
                tablaDiarioFichero.setFecha(fechax);
                tablaDiarioFichero.setReferencia(referencia);
                tablaDiarioFichero.setImporte(importe);
                tablaDiarioFichero.setSigno(signo);
                tablaDiarioFichero.setDescripcion(descripcion);
                tablaDiarioFichero.insertRow();

                num++;

                stat = tablaDiarioCopia.getNext();
            }

        });

        tablaAdicionalesCostesCopia.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaAdicionalesCostesCopia.setOrdenBy('INDICE');

        await tablaAdicionalesCostesCopia.open().then(reto => {

            stat = tablaAdicionalesCostesCopia.getFirst();

            while (stat == true) {

                indice = tablaAdicionalesCostesCopia.getIndice();
                importe = tablaAdicionalesCostesCopia.getImporte();

                stat = tablaAdicionalesCostes.getByPrimaryIndex(indice);
                if (stat == true) {
                    tablaAdicionalesCostes.registroBlanco();
                    tablaAdicionalesCostes.setImporte(importe);
                    if (Math.abs(importe) > 0.001) tablaAdicionalesCostes.setGrabada(true);
                    tablaAdicionalesCostes.updateRow(indice);
                }

                num++;

                stat = tablaAdicionalesCostesCopia.getNext();
            }
        });

        tablaAdicionalesCorreccionesCopia.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaAdicionalesCorreccionesCopia.setOrdenBy('INDICE');

        await tablaAdicionalesCorreccionesCopia.open().then(reto => {

            stat = tablaAdicionalesCorreccionesCopia.getFirst();

            while (stat == true) {

                indice = tablaAdicionalesCorreccionesCopia.getIndice();
                importe = tablaAdicionalesCorreccionesCopia.getImporte();

                stat = tablaAdicionalesCorrecciones.getByPrimaryIndex(indice);
                if (stat == true) {
                    tablaAdicionalesCorrecciones.registroBlanco();
                    tablaAdicionalesCorrecciones.setImporte(importe);
                    if (Math.abs(importe) > 0.001) tablaAdicionalesCorrecciones.setGrabada(true);
                    tablaAdicionalesCorrecciones.updateRow(indice);
                }

                num++;

                stat = tablaAdicionalesCorreccionesCopia.getNext();
            }
        });

        tablaAdicionalesEstadisticosCopia.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaAdicionalesEstadisticosCopia.setOrdenBy('INDICE');

        await tablaAdicionalesEstadisticosCopia.open().then(reto => {

            stat = tablaAdicionalesEstadisticosCopia.getFirst();

            while (stat == true) {

                indice = tablaAdicionalesEstadisticosCopia.getIndice();
                importe = tablaAdicionalesEstadisticosCopia.getImporte();

                stat = tablaAdicionalesEstadisticos.getByPrimaryIndex(indice);
                if (stat == true) {
                    tablaAdicionalesEstadisticos.registroBlanco();
                    tablaAdicionalesEstadisticos.setImporte(importe);
                    if (Math.abs(importe) > 0.001) tablaAdicionalesEstadisticos.setGrabada(true);
                    tablaAdicionalesEstadisticos.updateRow(indice);
                }

                num++;

                stat = tablaAdicionalesEstadisticosCopia.getNext();
            }
        });

        tablaCorreccionesEspecialesCopia.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaCorreccionesEspecialesCopia.setOrdenBy('INDICE');

        await tablaCorreccionesEspecialesCopia.open().then(reto => {

            stat = tablaCorreccionesEspecialesCopia.getFirst();

            while (stat == true) {

                indice = tablaCorreccionesEspecialesCopia.getIndice();
                importe = tablaCorreccionesEspecialesCopia.getImporte();
                hoja = tablaCorreccionesEspecialesCopia.getHoja();
                linea = tablaCorreccionesEspecialesCopia.getLinea();
                causa = tablaCorreccionesEspecialesCopia.getCausa();

                tablaCorreccionesEspeciales.registroBlanco();
                tablaCorreccionesEspeciales.setIndice(indice);
                tablaCorreccionesEspeciales.setImporte(importe);
                tablaCorreccionesEspeciales.setHoja(hoja);
                tablaCorreccionesEspeciales.setLinea(linea);
                tablaCorreccionesEspeciales.setCausa(causa);
                tablaCorreccionesEspeciales.insertRow();

                num++;

                stat = tablaCorreccionesEspecialesCopia.getNext();
            }

        });

        tablaAcumuladosEstadisticosCopia.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaAcumuladosEstadisticosCopia.setOrdenBy('INDICE');

        await tablaAcumuladosEstadisticosCopia.open().then(reto => {

            stat = tablaAcumuladosEstadisticosCopia.getFirst();

            while (stat == true) {

                indice = tablaAcumuladosEstadisticosCopia.getIndice();
                hoja = tablaAcumuladosEstadisticosCopia.getHoja();
                linea = tablaAcumuladosEstadisticosCopia.getLinea();
                importe = tablaAcumuladosEstadisticosCopia.getImporte();

                stat = tablaAcumuladosEstadisticos.getByPrimaryIndex(indice);
                if (stat == true) {
                    tablaAcumuladosEstadisticos.registroBlanco();
                    tablaAcumuladosEstadisticos.setImporte(importe);
                    if (Math.abs(importe) > 0.001) tablaAcumuladosEstadisticos.setGrabada(true);
                    tablaAcumuladosEstadisticos.updateRow(indice);
                }

                num++;

                stat = tablaAcumuladosEstadisticosCopia.getNext();
            }

        });

        await tablaIndicadores.getByPrimaryIndex(7).then(reto => {  // Indicador J
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setEncendido(true);
            tablaIndicadores.updateRow(7);
        });

        // Segunda Fase Reapertura Cifras Analiticas

        tablaCifras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaCifras.setOrdenBy('HOJA,LINEA');

        await tablaCifras.open().then(reto => {

            stat = tablaCifras.getFirst();

            while (stat == true) {

                hoja = tablaCifras.getHoja();
                linea = tablaCifras.getLinea();

                tablaCifras.registroBlanco();
                tablaCifras.setCerrada(false);
                tablaCifras.updateRow(hoja, linea);

                num++;

                stat = tablaCifras.getNext();
            }

        });

        tablaCifrasExtras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaCifrasExtras.setOrdenBy('HOJA,LINEA');

        await tablaCifrasExtras.open().then(reto => {

            stat = tablaCifrasExtras.getFirst();

            while (stat == true) {

                hoja = tablaCifrasExtras.getHoja();
                linea = tablaCifrasExtras.getLinea();

                tablaCifrasExtras.registroBlanco();
                tablaCifrasExtras.setCerrada(false);
                tablaCifrasExtras.updateRow(hoja, linea);

                num++;

                stat = tablaCifrasExtras.getNext();
            }
        });

        tablaDiarioCopia.ejecutaSQL("DELETE FROM DIARIO_COPIA");
        tablaAdicionalesCostesCopia.ejecutaSQL("DELETE FROM ADIC_COSTES_COPIA");
        tablaAdicionalesCorreccionesCopia.ejecutaSQL("DELETE FROM ADIC_CORRECCIONES_COPIA");
        tablaAdicionalesEstadisticosCopia.ejecutaSQL("DELETE FROM ADIC_ESTADISTICOS_COPIA");
        tablaCorreccionesEspecialesCopia.ejecutaSQL("DELETE FROM CORRECCIONES_ESPE_COPIA");
        tablaAcumuladosEstadisticosCopia.ejecutaSQL("DELETE FROM ACUM_ESTADISTICOS_COPIA");

        tablaMovimientos.borrarMes(anno_actu, mes_actu);

        // Fijacion de los indicadores al final del proceso

        mes = mes_actu;
        anno = anno_actu;

        mes--;
        if (mes < 1) {
            mes = 12;
            anno--;
        }

        tablaParametrosApp.startTransaccion();

        await tablaParametrosApp.getByPrimaryIndex().then(reto => {
            tablaParametrosApp.registroBlanco();
            tablaParametrosApp.setAnnoEnCurso(anno);
            tablaParametrosApp.setMesEnCurso(mes);
            tablaParametrosApp.updateRow();
        });

        await tablaIndicadores.getByPrimaryIndex(6).then(reto => {  // Indicador K
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.updateRow(6);
        });

        await tablaIndicadores.getByPrimaryIndex(7).then(reto => {  // Indicador J
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.updateRow(7);
        });

        tablaParametrosApp.endTransaccion();

        var conten="";
        conten += "<p style='color: red;'>Se ha Reabierto la Analítica Correctamente</p>";
		conten += "<p>Datos de " + formato.form('###.###.###', num, "") + " Lineas Reabiertas</p>";

        fiche = fs.openSync("./" + retorno + "/retorno.html", "w");
        fs.writeSync(fiche, conten, 0);
        fs.closeSync(fiche);

        if (impresoraabierta == true) {
            imp.cierre();
            res.send('');
            return;
        }

        res.send('vacio');

    }

});

module.exports = router;
