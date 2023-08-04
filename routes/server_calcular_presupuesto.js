// --------------------------------------------------------------
// Servidor: Calcular el Presupuesto Analitico
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_reparto_ppto_lineas = require('../tablas/tabla_reparto_ppto_lineas.js');
const tabla_reparto_ppto_hojas = require('../tablas/tabla_reparto_ppto_hojas.js');
const tabla_reparto_ppto_global = require('../tablas/tabla_reparto_ppto_global.js');
const tabla_presupuesto = require('../tablas/tabla_presupuesto.js');
const tabla_valores_ppto = require('../tablas/tabla_valores_ppto.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_totales = require('../tablas/tabla_totales.js');
const tabla_indicadores = require('../tablas/tabla_indicadores.js');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const rutinas = require('../treu/rutinas_server.js');
const impresion = require('../treu/treu_print_courier_pdf.js');
const formato = require('../treu/formato.js');
const fecha = require('../treu/forfecha.js');

/* GET home page. */
router.get('/calcular_presupuesto', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    var tablaRepartoPptoLineas = new tabla_reparto_ppto_lineas.TablaRepartoPptoLineas(db);
    var tablaRepartoPptoHojas = new tabla_reparto_ppto_hojas.TablaRepartoPptoHojas(db);
    var tablaRepartoPptoGlobal = new tabla_reparto_ppto_global.TablaRepartoPptoGlobal(db);

    var activo_reparto_lineas = false;
    var activo_reparto_hojas = false;
    var activo_reparto_global = false;

    var anno_ppto = search_params.get('anno_ppto');
    var reparto_global = rutinas.parseBoolean(search_params.get('reparto_global'));
    var reparto_hojas = rutinas.parseBoolean(search_params.get('reparto_hojas'));
    var reparto_lineas = rutinas.parseBoolean(search_params.get('reparto_lineas'));
    var campos = { anno_ppto, reparto_global, reparto_hojas, reparto_lineas };

    tablaRepartoPptoLineas.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);

    var param = search_params.get('reparto_global');
    if (param == undefined) {
        var retorno = "temporal";
        var fiche = fs.openSync("./" + retorno + "/retorno.html", "w");
        fs.closeSync(fiche);
    }

    await tablaRepartoPptoLineas.open().then(reto => {
        var stat = tablaRepartoPptoLineas.getFirst();
        if (stat == true) {
            activo_reparto_lineas = true;
        }
    });

    tablaRepartoPptoHojas.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);

    await tablaRepartoPptoHojas.open().then(reto => {
        var stat = tablaRepartoPptoHojas.getFirst();
        if (stat == true) {
            activo_reparto_hojas = true;
        }
    });

    tablaRepartoPptoGlobal.addFirstUno(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);

    await tablaRepartoPptoGlobal.open().then(reto => {
        var stat = tablaRepartoPptoGlobal.getFirst();
        if (stat == true) {
            activo_reparto_global = true;
        }
    });

    var rows = [];

    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Calcular Presupuesto";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

    var content;
    fs.readFile('./views/calcular_presupuesto.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { color_boton, titulo_boton, activo_reparto_global, activo_reparto_hojas, activo_reparto_lineas, campos, rows: rows }));
    });

});

router.post('/calcular_presupuesto', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var stat;

    var vector_texto = req.body.data;
    var vector_datos_impresora = req.body.data_impre;

    var anno_ppto = req.body.ANNO_PPTO;
    var reparto_global = req.body.REPARTO_GLOBAL;
    var reparto_hojas = req.body.REPARTO_HOJAS;
    var reparto_lineas = req.body.REPARTO_LINEAS;

    var chequeo = true;

    if (reparto_global == undefined) {
        reparto_global = false;
    }
    else {
        reparto_global = true;
    }

    if (reparto_hojas == undefined) {
        reparto_hojas = false;
    }
    else {
        reparto_hojas = true;
    }

    if (reparto_lineas == undefined) {
        reparto_lineas = false;
    }
    else {
        reparto_lineas = true;
    }

    if (vector_texto != undefined) {
        anno_ppto = rutinas.leer_lista_campos(vector_texto, 'ANNO_PPTO');
        reparto_global = rutinas.leer_lista_campos(vector_texto, 'REPARTO_GLOBAL');
        reparto_hojas = rutinas.leer_lista_campos(vector_texto, 'REPARTO_HOJAS');
        reparto_lineas = rutinas.leer_lista_campos(vector_texto, 'REPARTO_LINEAS');
        chequeo = false;
    }

    var tablaRepartoPptoLineas = new tabla_reparto_ppto_lineas.TablaRepartoPptoLineas(db);
    var tablaRepartoPptoHojas = new tabla_reparto_ppto_hojas.TablaRepartoPptoHojas(db);
    var tablaRepartoPptoGlobal = new tabla_reparto_ppto_global.TablaRepartoPptoGlobal(db);
    var tablaPresupuesto = new tabla_presupuesto.TablaPresupuesto(db);
    var tablaValoresPresupuesto = new tabla_valores_ppto.TablaValoresPresupuesto(db);
    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaTotales = new tabla_totales.TablaTotales(db);
    var tablaIndicadores = new tabla_indicadores.TablaIndicadores(db);
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaLineas2 = new tabla_lineas.TablaLineas(db);

    var temporal = "temporal";
    var retorno = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    fiche = fs.openSync("./" + retorno + "/retorno.html", "w");
    fs.closeSync(fiche);

    var indicadorA, indicadorB;
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

    await tablaIndicadores.getByPrimaryIndex(8).then(sta => {
        if (sta == true) {
            indicadorA = tablaIndicadores.getEncendido();
        }
    });

    await tablaIndicadores.getByPrimaryIndex(9).then(sta => {
        if (sta == true) {
            indicadorB = tablaIndicadores.getEncendido();
        }
    });

    var descri_error = '';
    var errores = false;

    if (anno_ppto < 2000 || anno_ppto > 2100) {
        descri_error += " -- Año del Presupuesto Incorrecto.\r\n";
        errores = true;
    }

    if (indicadorA == true) {
        descri_error += " -- Cálculo No permitido. Presupuesto a medio Calcular.\r\n";
        errores = true;
    }

    if (indicadorB == true) {
        descri_error += " -- Cálculo No permitido. Presupuesto Calculado.\r\n";
        errores = true;
    }

    if (errores == true) {
        fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);
        res.send('');
    }
    else {

        if (chequeo == true) {
            res.send('');
            return;
        }

        var maxpasadas;

        // Fijacion de los indicadores al Inicio del proceso

        await tablaIndicadores.getByPrimaryIndex(8).then(sta => {  // Indicador A
            if (sta == true) {
                tablaIndicadores.registroBlanco();
                tablaIndicadores.setEncendido(true);
                tablaIndicadores.updateRow(8);
            }
        });

        var imp = new impresion.Treu_print_courier_pdf('V');

        imp.borrarFicherosSalida();

        await tablaParametrosApp.getByPrimaryIndex().then(sta => {
            if (sta == true) {
                tituloempresa = tablaParametrosApp.getTituloEmpresa();
                maxpasadas = tablaParametrosApp.getMaxPasadas();
            }
            else {
                tituloempresa = "";
                maxpasadas = 10;
            }
        })

        // -----------------------------------------
        // Proceso de Calculo del Presupuesto
        // -----------------------------------------

        // Primera pasada Incorporacion de datos

        avance = 0;
        errorescalculo = false;
        var impresoraabierta = false;
        var hojaimpre = 0;

        avance++;

        tablaValoresPresupuesto.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaValoresPresupuesto.setOrdenBy('HOJA');

        await tablaValoresPresupuesto.open().then(async reto => {

            stat = tablaValoresPresupuesto.getFirst();

            while (stat == true) {

                hoja = tablaValoresPresupuesto.getHoja();
                linea = tablaValoresPresupuesto.getLinea();
                importe = tablaValoresPresupuesto.getPresupuesto();
                grabada = tablaValoresPresupuesto.getGrabada();

                if (grabada == true) {

                    parcialerrores = false;

                    await tablaHojas.getByPrimaryIndex(hoja).then(ret => {

                        if (ret == false) {

                            hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                            impresoraabierta = true;

                            if (imp.hayespacio(2) == false) {
                                imp.hoja();
                                hojaimpre++;
                                cabecera(imp, tituloempresa, hojaimpre);
                            }

                            imp.printre(' ', 2);
                            imp.print("Apunte Importe = " + formato.form("###.###.###.###,##", importe, ""));
                            imp.printre(' ', 2);

                            imp.print("No Existe Hoja Analitica " + formato.form("##", hoja, "0"));
                            imp.linea();

                            errorescalculo = true;
                            parcialerrores = true;

                        }
                    });

                    await tablaLineas.getByPrimaryIndex(hoja, linea).then(ret => {

                        if (ret == false) {

                            hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                            impresoraabierta = true;

                            if (imp.hayespacio(2) == false) {
                                imp.hoja();
                                hojaimpre++;
                                cabecera(imp, tituloempresa, hojaimpre);
                            }

                            imp.printre(' ', 2);
                            imp.print("Apunte Importe = " + formato.form("###.###.###.###,##", importe, ""));
                            imp.printre(' ', 2);

                            imp.print("No Existe Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0"));
                            imp.linea();

                            errorescalculo = true;
                            parcialerrores = true;

                        }
                    });

                    if (parcialerrores == false) {

                        detotales = tablaLineas.getDeTotales();

                        if (detotales == true) {

                            hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                            impresoraabierta = true;

                            if (imp.hayespacio(2) == false) {
                                imp.hoja();
                                hojaimpre++;
                                cabecera(imp, tituloempresa, hojaimpre);
                            }

                            imp.printre(' ', 2);
                            imp.print("Apunte Importe = " + formato.form("###.###.###.###,##", importe, ""));
                            imp.printre(' ', 2);

                            imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es de Totales");
                            imp.linea();

                            errorescalculo = true;
                            parcialerrores = true;

                        }

                        novisible = tablaLineas.getInvisible();

                        if (novisible == true && Math.abs(importe) > 0.001) {

                            hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                            impresoraabierta = true;

                            if (imp.hayespacio(2) == false) {
                                imp.hoja();
                                hojaimpre++;
                                cabecera(imp, tituloempresa, hojaimpre);
                            }

                            imp.printre(' ', 2);
                            imp.print("Apunte Importe = " + formato.form("###.###.###.###,##", importe, ""));
                            imp.printre(' ', 2);

                            imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es No Visible");
                            imp.linea();

                            errorescalculo = true;
                            parcialerrores = true;

                        }
                    }

                    if (parcialerrores == false) {

                        sumable = true;
                        sumable = tablaLineas.getSumable();

                        if (sumable == true) {

                            for (i = 1; i <= 11; i++) reparto[i - 1] = 0.08333;
                            reparto[11] = 0.08337;

                            if (reparto_global == true) {
                                await tablaRepartoPptoGlobal.getByPrimaryIndex().then(sta => {
                                    if (sta == true) {
                                        reparto = tablaRepartoPptoGlobal.getCifras();
                                    }
                                });
                            }

                            if (reparto_hojas == true) {
                                await tablaRepartoPptoHojas.getByPrimaryIndex(hoja).then(sta => {
                                    if (sta == true) {
                                        reparto = tablaRepartoPptoHojas.getCifras();
                                    }
                                });
                            }

                            if (reparto_lineas == true) {
                                await tablaRepartoPptoLineas.getByPrimaryIndex(hoja, linea).then(sta => {
                                    if (sta == true) {
                                        reparto = tablaRepartoPptoLineas.getCifras();
                                    }
                                });
                            }
                        }
                        else {
                            for (i = 1; i <= 12; i++) reparto[i - 1] = 1.0;
                        }

                        if (sumable == true) {
                            suma = 0.0;
                            for (i = 1; i <= 11; i++) {
                                valoresmeses[i - 1] = rutinas.ajustardecimales(reparto[i - 1] * importe, 2);
                                suma += valoresmeses[i - 1];
                            }
                            valoresmeses[11] = rutinas.ajustardecimales(importe - suma, 2);
                        }
                        else {
                            for (i = 1; i <= 12; i++) {
                                valoresmeses[i - 1] = rutinas.ajustardecimales(reparto[i - 1] * importe, 2);
                            }
                        }

                        await tablaPresupuesto.getByPrimaryIndex(hoja, linea).then(sta => {

                            if (sta == false) {
                                tablaPresupuesto.registroBlanco();
                                tablaPresupuesto.setHoja(hoja);
                                tablaPresupuesto.setLinea(linea);
                                tablaPresupuesto.setCifras(valoresmeses);
                                tablaPresupuesto.setAcumulado(importe);
                                tablaPresupuesto.insertRow();
                            }
                            else {
                                impor = tablaPresupuesto.getAcumulado();
                                cifr = tablaPresupuesto.getCifras();
                                impor += importe;
                                for (i = 1; i <= 12; i++) cifr[i - 1] += valoresmeses[i - 1];
                                tablaPresupuesto.registroBlanco();
                                tablaPresupuesto.setCifras(cifr);
                                tablaPresupuesto.setAcumulado(impor);
                                tablaPresupuesto.updateRow(hoja, linea);
                            }
                        });

                    }
                }

                stat = tablaValoresPresupuesto.getNext();
            }

        });

        var pasada;

        // Pasadas Siguientes de Sumar Totales

        for (kk = 2; kk <= maxpasadas; kk++) {

            avance++;

            tablaLineas.addFirstPasadaCalculo(TablaSQL.TablaSQL.BTR_EQ, kk);
            tablaLineas.addAndDeTotales(TablaSQL.TablaSQL.BTR_EQ, true);
            tablaLineas.setOrdenBy("HOJA,LINEA");

            await tablaLineas.open().then(async ret => {

                stat = tablaLineas.getFirst();

                while (stat == true) {

                    hoja = tablaLineas.getHoja();
                    linea = tablaLineas.getLinea();

                    parcialerrores = false;

                    await tablaTotales.getByPrimaryIndex(hoja, linea).then(sta => {

                        if (sta == false) {

                            hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                            impresoraabierta = true;

                            if (imp.hayespacio(2) == false) {
                                imp.hoja();
                                hojaimpre++;
                                cabecera(imp, tituloempresa, hojaimpre);
                            }

                            imp.printre(' ', 2);
                            imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es de Totales y No Tiene la Definición del Total.");
                            imp.printre(' ', 2);

                            imp.linea();

                            errorescalculo = true;
                            parcialerrores = true;

                        }

                    });

                    if (parcialerrores == false) {

                        numcomponentes = tablaTotales.getNumComponentes();
                        coeficientes = tablaTotales.getCoeficientes();
                        hojascomp = tablaTotales.getHojasComponentes();
                        lineascomp = tablaTotales.getLineasComponentes();
                        mascomp = tablaTotales.getMasComponentes();

                        suma = 0.0;
                        for (i = 1; i <= 12; i++) sumacifr[i - 1] = 0.0;
                        for (s = 1; s <= numcomponentes; s++) {

                            pasada = 1;

                            await tablaLineas2.getByPrimaryIndex(hojascomp[s - 1], lineascomp[s - 1]).then(sta => {

                                if (sta == true) {
                                    pasada = tablaLineas2.getPasadaCalculo();
                                }

                                if (pasada >= kk) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("La Linea Analitica " + formato.form("##", hojascomp[s - 1], "0") + " / " + formato.form("###", lineascomp[s - 1], "0") + " Pasada de Cálculo Superior o Igual a la de Total " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + ". No Válida.");
                                    imp.printre(' ', 2);

                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }
                            });

                            if (parcialerrores == false) {

                                await tablaPresupuesto.getByPrimaryIndex(hojascomp[s - 1], lineascomp[s - 1]).then(sta => {

                                    if (sta == true) {
                                        impor = tablaPresupuesto.getAcumulado();
                                        cifr = tablaPresupuesto.getCifras();
                                        for (i = 1; i <= 12; i++) cifr[i - 1] = coeficientes[s - 1] * cifr[i - 1];
                                        impor = coeficientes[s - 1] * impor;
                                        if (mascomp[s - 1] == "-") {
                                            impor = -1 * impor;
                                            for (i = 1; i <= 12; i++) cifr[i - 1] = -1 * cifr[i - 1];
                                        }
                                    }
                                    else {
                                        for (i = 1; i <= 12; i++) cifr[i - 1] = 0.0;
                                        impor = 0.0;
                                    }
                                    suma += impor;
                                    for (i = 1; i <= 12; i++) sumacifr[i - 1] += cifr[i - 1];
                                });
                            }

                            suma = rutinas.ajustardecimales(suma, 2);
                            for (i = 1; i <= 12; i++) sumacifr[i - 1] = rutinas.ajustardecimales(sumacifr[i - 1], 2);

                        }
                        
                        await tablaPresupuesto.getByPrimaryIndex(hoja, linea).then(sta => {

                            if (sta == true) {
                                impor = tablaPresupuesto.getAcumulado();
                                cifr = tablaPresupuesto.getCifras();
                                impor += suma;
                                for (i = 1; i <= 12; i++) cifr[i - 1] += sumacifr[i - 1];
                                tablaPresupuesto.registroBlanco();
                                tablaPresupuesto.setCifras(cifr);
                                tablaPresupuesto.setAcumulado(impor);
                                tablaPresupuesto.updateRow(hoja, linea);
                            }
                            else {
                                tablaPresupuesto.registroBlanco();
                                tablaPresupuesto.setHoja(hoja);
                                tablaPresupuesto.setLinea(linea);
                                tablaPresupuesto.setCifras(sumacifr);
                                tablaPresupuesto.setAcumulado(suma);
                                tablaPresupuesto.insertRow();
                            }

                        });


                    }

                    stat = tablaLineas.getNext();
                }

            });
        }

        var retorno = "temporal";
        var conten = "";
        var fiche = fs.openSync("./" + retorno + "/retorno.html", "w");

        if (errorescalculo == false) {

            await tablaIndicadores.getByPrimaryIndex(8).then(ret => {   // Indicador A
                tablaIndicadores.registroBlanco();
                tablaIndicadores.setEncendido(false);
                tablaIndicadores.updateRow(8);
            });

            await tablaIndicadores.getByPrimaryIndex(9).then(ret => {  // Indicador Be
                tablaIndicadores.registroBlanco();
                tablaIndicadores.setEncendido(true);
                tablaIndicadores.updateRow(9);
            });

            await tablaParametrosApp.getByPrimaryIndex().then(ret => {

                if (ret == true) {

                    tablaParametrosApp.registroBlanco();
                    tablaParametrosApp.setAnnoPpto(anno_ppto);

                    var today = new Date();
                    tablaParametrosApp.setFechaPpto(fecha.forfecha("B", today, ""));

                    var momento = today.toLocaleTimeString('es-ES');

                    tablaParametrosApp.setHoraPpto(momento);
                    tablaParametrosApp.updateRow();
                }

            });

            conten += "<p style='color: red;'>Cálculo Finalizado Correctamente</p>";
        }
        else {
            conten += "<p style='color: red;'>Cálculo No Realizado. Hay Errores</p>";
        }

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

function abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora) {

    if (impresoraabierta == true) return hojaimpre;

    imp.resetcondi();
    imp.setOrientacion("V");
    imp.setSizeFont(7);
    imp.compactarbis(false);

    var aper = imp.aperturaSilenciosa2(vector_datos_impresora);
    if (aper == true) impresoraabierta = true;

    hojaimpre = 1;
    cabecera(imp, tituloempresa, hojaimpre);

    return hojaimpre;

}

function cabecera(imp, tituempre, hoja) {

    var fechax = new Date();

    imp.setNegrita(true);
    imp.print(rutinas.acoplarserie(tituempre, 40));
    imp.setNegrita(false);

    imp.print("       -- ERRORES EN CALCULO --       ");

    imp.print(fecha.forfecha("B", fechax, ""));
    imp.printre(' ', 10);
    imp.print("Hoja: ");
    imp.setNegrita(true);
    imp.print(formato.form("###", hoja, ""));
    imp.setNegrita(false);
    imp.linea();

    imp.printre('-', 131);
    imp.linea();

    imp.print("  DESCRIPCION ERROR ");
    imp.printre('-', 100);

    imp.linea();
    imp.printre('-', 131);
    imp.linea();
    imp.linea();

}

module.exports = router;
