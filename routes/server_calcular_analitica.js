// --------------------------------------------------------------
// Servidor: Calcular la Analitica
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
const rutinas = require('../treu/rutinas_server.js');
const impresion = require('../treu/treu_print_courier_pdf.js');
const formato = require('../treu/formato.js');
const fecha = require('../treu/forfecha.js');

/* GET home page. */
router.get('/calcular_analitica', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    var no_adicionales = rutinas.parseBoolean(search_params.get('no_adicionales'));

    var param = search_params.get('no_adicionales');
    if (param == undefined) {
        var retorno = "temporal";
        var fiche = fs.openSync("./" + retorno + "/retorno.html", "w");
        fs.closeSync(fiche);
    }

    var rows = [];

    var mes_actu;
    var anno_actu;
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);

    await tablaParametrosApp.getByPrimaryIndex().then(ret => {

        if (ret == true) {
            mes_actu = tablaParametrosApp.getMesEnCurso();
            anno_actu = tablaParametrosApp.getAnnoEnCurso();
        }

        mes_actu++;
        if (mes_actu > 12) {
            mes_actu = 1;
            anno_actu++;
        }

    })

    var mes_letra = formato.form('##', mes_actu, "0") + " / " + rutinas.mesesLetras(mes_actu, false);
    var anno_format = formato.form("#.###", anno_actu, "");

    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Calcular Analitica";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

    var content;
    fs.readFile('./views/calcular_analitica.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { color_boton, titulo_boton, no_adicionales, mes_letra, anno_format, rows: rows }));
    });

});

router.post('/calcular_analitica', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var stat;
    var chequeo = true;

    var vector_texto = req.body.data;
    var vector_datos_impresora = req.body.data_impre;

    var no_adicionales = req.body.NO_ADICIONALES;

    if (no_adicionales == undefined) {
        no_adicionales = false;
    }
    else {
        no_adicionales = true;
    }

    if (vector_texto != undefined) {
        no_adicionales = rutinas.parseBoolean(rutinas.leer_lista_campos(vector_texto, 'NO_ADICIONALES'));
        chequeo = false;
    }

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

    var indicadorA, indicadorC, indicadorK, indicadorL, indicadorB, indicadorD;
    var errores;
    var impresoraabierta = false;
    var hojaimpre = 1;

    await tablaIndicadores.getByPrimaryIndex(1).then(retor => {
        indicadorC = tablaIndicadores.getEncendido();
    });

    await tablaIndicadores.getByPrimaryIndex(3).then(retor => {
        indicadorA = tablaIndicadores.getEncendido();
    });

    await tablaIndicadores.getByPrimaryIndex(6).then(retor => {
        indicadorK = tablaIndicadores.getEncendido();
    });

    await tablaIndicadores.getByPrimaryIndex(2).then(retor => {
        indicadorL = tablaIndicadores.getEncendido();
    });

    await tablaIndicadores.getByPrimaryIndex(4).then(retor => {
        indicadorB = tablaIndicadores.getEncendido();
    });

    await tablaIndicadores.getByPrimaryIndex(5).then(retor => {
        indicadorD = tablaIndicadores.getEncendido();
    });

    var descri_error = '';
    var errores = false;

    if (indicadorC == true) {
        descri_error += "-- Cálculo No permitido. Analitica Cerrandose.\r\n";
        errores = true;
    }

    if (indicadorA == true) {
        descri_error += "-- Cálculo No permitido. Analitica Abriendose.\r\n";
        errores = true;
    }

    if (indicadorK == true) {
        descri_error += "-- Cálculo No permitido. Reapertura Analitica en Tramite.\r\n";
        errores = true;
    }

    if (indicadorL == true) {
        descri_error += "-- Cálculo No permitido. Analítica a Medio Limpiar.\r\n";
        errores = true;
    }

    if (indicadorB == true) {
        descri_error += "-- Cálculo No permitido. Analítica a Medio Calcular.\r\n";
        errores = true;
    }

    if (indicadorD == true) {
        descri_error += "-- Cálculo No permitido. Analítica ya Calculada.\r\n";
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
        var errorescalculo = false;
        var parcialerrores = false;

        var veccuentas = new Array();
        var vecsubcuentas = new Array();

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

        // Fijacion de los indicadores al Inicio del proceso

        await tablaIndicadores.getByPrimaryIndex(4).then(sta => {  // Indicador B
            if (sta == true) {
                tablaIndicadores.registroBlanco();
                tablaIndicadores.setEncendido(true);
                tablaIndicadores.updateRow(4);
            }
        });

        var imp = new impresion.Treu_print_courier_pdf('V');

        imp.borrarFicherosSalida();

        var mes_actu;
        var anno_actu;
        var controlfechamovimientos;
        var cargoslineasnovisibles;
        await tablaParametrosApp.getByPrimaryIndex().then(sta => {
            if (sta == true) {
                tituloempresa = tablaParametrosApp.getTituloEmpresa();
                maxpasadas = tablaParametrosApp.getMaxPasadas();
                mes_actu = tablaParametrosApp.getMesEnCurso();
                anno_actu = tablaParametrosApp.getAnnoEnCurso();
                controlfechamovimientos = tablaParametrosApp.getControlFechaMovimientos();
                cargoslineasnovisibles = tablaParametrosApp.getCargosLineaNoVisible();
            }
            else {
                tituloempresa = "";
                maxpasadas = 10;
                mes_actu = 1;
                anno_actu = 2022;
                controlfechamovimientos = true;
                cargoslineasnovisibles = false;
            }
        })

        mes_actu++;
        if (mes_actu > 12) {
            mes_actu = 1;
            anno_actu++;
        }

        // -----------------------------------------
        // Proceso de Calculo de la Analitica
        // -----------------------------------------

        // Primera pasada Incorporacion Apuntes Contables

        var numcuen = 0;
        var secuencia = 0;
        var saldocarga = 0.0;

        var hoja = 0;
        var linea = 0;
        var parcialerrores = false;

        var antecuenta = "";
        var antesubcuenta = "";
        var antesaldo = 0.0;
        var antehoja = 0;
        var antelinea = 0;
        var anteerror = false;

        var fechax;

        var erroresfechas = false;

        var mes = mes_actu;
        var anno = anno_actu;

        tablaMovimientos.borrarMes(anno, mes);

        //tablaCuentasNoAbiertas.ejecutaSQL("DELETE FROM CUENTAS_NO_ABIERTAS");

        tablaDiarioFichero.addFirstCuenta(TablaSQL.TablaSQL.BTR_NOT_EQ, "");
        tablaDiarioFichero.setOrdenBy("CUENTA,SUBCUENTA");
        await tablaDiarioFichero.open().then(async reto => {

            nmov = tablaDiarioFichero.getRowCount();

            stat = tablaDiarioFichero.getFirst();

            while (stat == true) {

                cuenta = tablaDiarioFichero.getCuenta();
                subcuenta = tablaDiarioFichero.getSubCuenta();
                importe = tablaDiarioFichero.getImporte();
                signo = tablaDiarioFichero.getSigno();
                referencia = tablaDiarioFichero.getReferencia();
                descripcion = tablaDiarioFichero.getDescripcion();
                fechax = tablaDiarioFichero.getFecha();
                origen = tablaDiarioFichero.getOrigen();

                var fechixi = fechax;

                if (controlfechamovimientos == true) {
                    if ((fechixi.getMonth() + 1) != mes || fechixi.getYear() != anno) {
                        erroresfechas = true;
                    }
                }

                saltarcomprobaciones = false;
                if (cuenta == antecuenta && subcuenta == antesubcuenta) saltarcomprobaciones = true;

                var importesig = 0.0;
                if (signo == "D") importesig = importe;
                if (signo == "H") importesig = -1 * importe;

                saldocarga += importesig;

                if (saltarcomprobaciones == false) {

                    parcialerrores = false;

                    await tablaAsignaciones.getByPrimaryIndex(cuenta, subcuenta).then(async sta => {

                        if (sta == true) {

                            hoja = tablaAsignaciones.getHoja();
                            linea = tablaAsignaciones.getLinea();

                            stat = tablaHojas.getByPrimaryIndex(hoja);

                            if (stat == false) {

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Cuenta Contable: ");
                                imp.print(rutinas.acoplarserie(cuenta, 20));
                                imp.print(" / ");
                                imp.print(rutinas.acoplarserie(subcuenta, 10));
                                imp.printre(' ', 2);

                                imp.print("No Existe Hoja Analitica " + formato.form("##", hoja, "0"));
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }

                            await tablaLineas.getByPrimaryIndex(hoja, linea).then(sta => {

                                if (sta == false) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("Cuenta Contable: ");
                                    imp.print(rutinas.acoplarserie(cuenta, 20));
                                    imp.print(" / ");
                                    imp.print(rutinas.acoplarserie(subcuenta, 10));
                                    imp.printre(' ', 2);

                                    imp.print("No Existe Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0"));
                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }
                                else {

                                    detotales = tablaLineas.getDeTotales();
                                    novisible = tablaLineas.getInvisible();
                                    blanca2 = tablaLineas.getBlanca();

                                    if (detotales == true) {

                                        hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                        impresoraabierta = true;

                                        if (imp.hayespacio(2) == false) {
                                            imp.hoja();
                                            hojaimpre++;
                                            cabecera(imp, tituloempresa, hojaimpre);
                                        }

                                        imp.printre(' ', 2);
                                        imp.print("Cuenta Contable: ");
                                        imp.print(rutinas.acoplarserie(cuenta, 20));
                                        imp.print(" / ");
                                        imp.print(rutinas.acoplarserie(subcuenta, 10));
                                        imp.printre(' ', 2);

                                        imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es de Totales.");
                                        imp.linea();

                                        errorescalculo = true;
                                        parcialerrores = true;

                                    }

                                    if (blanca2 == true) {

                                        hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                        impresoraabierta = true;

                                        if (imp.hayespacio(2) == false) {
                                            imp.hoja();
                                            hojaimpre++;
                                            cabecera(imp, tituloempresa, hojaimpre);
                                        }

                                        imp.printre(' ', 2);
                                        imp.print("Cuenta Contable: ");
                                        imp.print(rutinas.acoplarserie(cuenta, 20));
                                        imp.print(" / ");
                                        imp.print(rutinas.acoplarserie(subcuenta, 10));
                                        imp.printre(' ', 2);

                                        imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es Linea Blanca. No Válida.");
                                        imp.linea();

                                        errorescalculo = true;
                                        parcialerrores = true;

                                    }

                                    if (novisible == true && cargoslineasnovisibles == false) {

                                        hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                        impresoraabierta = true;

                                        if (imp.hayespacio(2) == false) {
                                            imp.hoja();
                                            hojaimpre++;
                                            cabecera(imp, tituloempresa, hojaimpre);
                                        }

                                        imp.printre(' ', 2);
                                        imp.print("Cuenta Contable: ");
                                        imp.print(rutinas.acoplarserie(cuenta, 20));
                                        imp.print(" / ");
                                        imp.print(rutinas.acoplarserie(subcuenta, 10));
                                        imp.printre(' ', 2);

                                        imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es No Visible.");
                                        imp.linea();

                                        errorescalculo = true;
                                        parcialerrores = true;

                                    }
                                }
                            });
                        }
                        else {

                            esta = false;
                            for (i = 1; i <= numcuen; i++) {
                                if (cuenta == veccuentas[i - 1] && subcuenta == vecsubcuentas[i - 1]) {
                                    esta = true;
                                    break;
                                }
                            }

                            if (esta == false) {

                                numcuen++;
                                veccuentas.push(cuenta);
                                vecsubcuentas.push(subcuenta);

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Cuenta Contable: ");
                                imp.print(rutinas.acoplarserie(cuenta, 20));
                                imp.print(" / ");
                                imp.print(rutinas.acoplarserie(subcuenta, 10));
                                imp.printre(' ', 2);

                                imp.print("No está definida en la tabla de Asignaciones");
                                imp.linea();

                                /*stat = tablaCuentasNoAbiertas.getByPrimaryIndex(cuenta, subcuenta);

                                if (stat == false) {

                                    tablaCuentasNoAbiertas.registroBlanco();
                                    tablaCuentasNoAbiertas.setCuenta(cuenta);
                                    tablaCuentasNoAbiertas.setSubCuenta(subcuenta);
                                    tablaCuentasNoAbiertas.setNoAbierta(true);
                                    tablaCuentasNoAbiertas.setTituloCuenta("");
                                    tablaCuentasNoAbiertas.setHoja(0);
                                    tablaCuentasNoAbiertas.setLinea(0);
                                    tablaCuentasNoAbiertas.setTituloLinea("");
                                    tablaCuentasNoAbiertas.insertRow();

                                    if (chckbxExportarErrores.isSelected() == true) {

                                        grabados_a_excel = true;

                                        conectarexcel();

                                        var titulocuenta, cuenta_pri;

                                        if (cuentaFin - cuentaIni > 0 && tipo_cuenta == 1) {
                                            cuenta_pri = cuenta.substring(cuentaIni, cuentaFin);
                                        }
                                        else {
                                            cuenta_pri = cuenta;
                                        }

                                        stat = tablaCuentasPGC.getByPrimaryIndex(cuenta_pri);

                                        if (stat == true) {
                                            titulocuenta = Utilidades.quitarcola(tablaCuentasPGC.getNombre());
                                        }
                                        else {
                                            titulocuenta = "";
                                        }

                                        lin++;

                                        excel.grabarceldastring(lin, 1, cuenta);
                                        excel.grabarceldastring(lin, 2, subcuenta);
                                        excel.grabarceldastring(lin, 3, titulocuenta);
                                        excel.grabarceldastring(lin, 6, modelo);

                                    }

                                }*/
                            }

                            errorescalculo = true;
                            parcialerrores = true;

                        }
                    });

                }

                if (antecuenta != cuenta || antesubcuenta != subcuenta) {

                    if (antecuenta != "" && anteerror == false) {

                        await tablaCifras.getByPrimaryIndex(antehoja, antelinea).then(sta => {

                            if (sta == true) {
                                impor = tablaCifras.getMesCalculo();
                                impor += antesaldo;
                                tablaCifras.registroBlanco();
                                tablaCifras.setMesCalculo(impor);
                                tablaCifras.updateRow(antehoja, antelinea);
                            }
                            else {
                                for (i = 1; i <= 24; i++) cifras[i - 1] = 0.0;
                                tablaCifras.registroBlanco();
                                tablaCifras.setHoja(antehoja);
                                tablaCifras.setLinea(antelinea);
                                tablaCifras.setCifras(cifras);
                                tablaCifras.setMesCalculo(antesaldo);
                                tablaCifras.setCerrada(false);
                                tablaCifras.insertRow();
                            }

                            antesaldo = 0.0;
                        });

                    }
                }

                antecuenta = cuenta;
                antesubcuenta = subcuenta;
                antehoja = hoja;
                antelinea = linea;
                anteerror = parcialerrores;

                if (parcialerrores == false) {

                    /*stat=tablaCifras.getByPrimaryIndex(hoja,linea);
    
                    if (stat==true) {
                        impor=tablaCifras.getMesCalculo();
                        impor+=importesig;
                        tablaCifras.setMesCalculo(impor);
                        tablaCifras.updateRow();
                    }
                    else {
                        for (i=1; i<=24; i++) cifras[i-1]=0.0;
                        tablaCifras.registroBlanco();
                        tablaCifras.setHoja(hoja);
                        tablaCifras.setLinea(linea);
                        tablaCifras.setCifras(cifras);
                        tablaCifras.setMesCalculo(importesig);
                        tablaCifras.setCerrada(false);
                        tablaCifras.insertRow();
                    }*/

                    antesaldo += importesig;

                    secuencia++;
                    tablaMovimientos.registroBlanco();
                    tablaMovimientos.setHoja(hoja);
                    tablaMovimientos.setLinea(linea);
                    tablaMovimientos.setAnno(anno_actu);
                    tablaMovimientos.setMes(mes_actu);
                    tablaMovimientos.setSecuencia(secuencia);
                    tablaMovimientos.setDescripcion(descripcion);
                    tablaMovimientos.setImporte(importe);
                    tablaMovimientos.setSigno(signo);
                    tablaMovimientos.setReferencia(referencia);
                    tablaMovimientos.setCuenta(cuenta);
                    tablaMovimientos.setSubCuenta(subcuenta);
                    tablaMovimientos.setFecha(fecha.forfecha("B", fechax, ""));
                    tablaMovimientos.setOrigen(origen);
                    tablaMovimientos.insertRow();

                }

                stat = tablaDiarioFichero.getNext();
            }

            // Grabar la Ultima Linea

            if (antecuenta != "" && anteerror == false) {

                await tablaCifras.getByPrimaryIndex(antehoja, antelinea).then(sta => {

                    if (sta == true) {
                        impor = tablaCifras.getMesCalculo();
                        impor += antesaldo;
                        tablaCifras.registroBlanco();
                        tablaCifras.setMesCalculo(impor);
                        tablaCifras.updateRow(antehoja, antelinea);
                    }
                    else {
                        for (i = 1; i <= 24; i++) cifras[i - 1] = 0.0;
                        tablaCifras.registroBlanco();
                        tablaCifras.setHoja(antehoja);
                        tablaCifras.setLinea(antelinea);
                        tablaCifras.setCifras(cifras);
                        tablaCifras.setMesCalculo(antesaldo);
                        tablaCifras.setCerrada(false);
                        tablaCifras.insertRow();
                    }
                });

            }

        });

        // Imprimir errores de fechas

        if (erroresfechas == true) {

            hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

            impresoraabierta = true;

            if (imp.hayespacio(2) == false) {
                imp.hoja();
                hojaimpre++;
                cabecera(imp, tituloempresa, hojaimpre);
            }

            if (errorescalculo == true) imp.linea();

            imp.printre(' ', 2);
            imp.print("Hay apuntes contables con fecha fuera de periodo actual.");
            imp.linea();
            imp.linea();

            errorescalculo = true;
            parcialerrores = true;
        }

        // Primera pasada Incorporacion Adicionales Costes

        if (no_adicionales == false) {

            tablaAdicionalesCostes.addFirstBlanca(TablaSQL.TablaSQL.BTR_NOT_EQ, true);
            tablaAdicionalesCostes.setOrdenBy("ORDEN");

            await tablaAdicionalesCostes.open().then(async sta => {

                stat = tablaAdicionalesCostes.getFirst();

                while (stat == true) {

                    indice = tablaAdicionalesCostes.getIndice();
                    hoja = tablaAdicionalesCostes.getHoja();
                    linea = tablaAdicionalesCostes.getLinea();
                    importesig = tablaAdicionalesCostes.getImporte();
                    descripcion = tablaAdicionalesCostes.getTitulo();
                    blanca = tablaAdicionalesCostes.getBlanca();

                    parcialerrores = false;

                    if (blanca == false) {

                        await tablaHojas.getByPrimaryIndex(hoja).then(sta => {

                            if (sta == false) {

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Adicional Costes Indice: ");
                                imp.print(formato.form("######", indice, "0"));
                                imp.printre(' ', 2);

                                imp.print("No Existe Hoja Analitica " + formato.form("##", hoja, "0"));
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }

                        });

                        await tablaLineas.getByPrimaryIndex(hoja, linea).then(sta => {

                            if (sta == false) {

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Adicional Costes Indice: ");
                                imp.print(formato.form("######", indice, "0"));
                                imp.printre(' ', 2);

                                imp.print("No Existe Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0"));
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }
                            else {

                                detotales = tablaLineas.getDeTotales();
                                novisible = tablaLineas.getInvisible();
                                blanca2 = tablaLineas.getBlanca();

                                if (detotales == true) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("Adicional Costes Indice: ");
                                    imp.print(formato.form("######", indice, "0"));
                                    imp.printre(' ', 2);

                                    imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es de Totales.");
                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }

                                if (blanca2 == true) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("Adicional Costes Indice: ");
                                    imp.print(formato.form("######", indice, "0"));
                                    imp.printre(' ', 2);

                                    imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es Linea Blanca. No Válida.");
                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }

                                if (novisible == true && cargoslineasnovisibles == false) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("Adicional Costes Indice: ");
                                    imp.print(formato.form("######", indice, "0"));
                                    imp.printre(' ', 2);

                                    imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es No Visible.");
                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }
                            }
                        });

                    }

                    if (parcialerrores == false && blanca == false) {

                        await tablaCifras.getByPrimaryIndex(hoja, linea).then(sta => {

                            if (sta == true) {
                                impor = tablaCifras.getMesCalculo();
                                impor += importesig;
                                tablaCifras.registroBlanco();
                                tablaCifras.setMesCalculo(impor);
                                tablaCifras.updateRow(hoja, linea);
                            }
                            else {
                                for (i = 1; i <= 24; i++) cifras[i - 1] = 0.0;
                                tablaCifras.registroBlanco();
                                tablaCifras.setHoja(hoja);
                                tablaCifras.setLinea(linea);
                                tablaCifras.setCifras(cifras);
                                tablaCifras.setMesCalculo(importesig);
                                tablaCifras.setCerrada(false);
                                tablaCifras.insertRow();
                            }

                            if (importesig < 0.0) {
                                signo = "H";
                            }
                            else {
                                signo = "D";
                            }

                            referencia = "CONSTANTE";
                            cuenta = "ADICON";
                            subcuenta = "";

                            const fechixi = fecha.ultimodiames(mes_actu,anno_actu);

                            if (Math.abs(importesig) >= 0.001) {

                                secuencia++;
                                tablaMovimientos.registroBlanco();
                                tablaMovimientos.setHoja(hoja);
                                tablaMovimientos.setLinea(linea);
                                tablaMovimientos.setAnno(anno_actu);
                                tablaMovimientos.setMes(mes_actu);
                                tablaMovimientos.setSecuencia(secuencia);
                                tablaMovimientos.setDescripcion(descripcion);
                                tablaMovimientos.setImporte(Math.abs(importesig));
                                tablaMovimientos.setSigno(signo);
                                tablaMovimientos.setReferencia(referencia);
                                tablaMovimientos.setCuenta(cuenta);
                                tablaMovimientos.setSubCuenta(subcuenta);
                                tablaMovimientos.setFecha(fecha.forfecha("B", fechixi, ""));
                                tablaMovimientos.setOrigen("");
                                tablaMovimientos.insertRow();

                            }
                        });

                    }

                    stat = tablaAdicionalesCostes.getNext();
                }
            });

            // Primera pasada Incorporacion Adicionales Correcciones

            tablaAdicionalesCorrecciones.addFirstBlanca(TablaSQL.TablaSQL.BTR_NOT_EQ, true);
            tablaAdicionalesCorrecciones.setOrdenBy("ORDEN");

            await tablaAdicionalesCorrecciones.open().then(async sta => {

                stat = tablaAdicionalesCorrecciones.getFirst();

                while (stat == true) {

                    indice = tablaAdicionalesCorrecciones.getIndice();
                    hoja = tablaAdicionalesCorrecciones.getHoja();
                    linea = tablaAdicionalesCorrecciones.getLinea();
                    importesig = tablaAdicionalesCorrecciones.getImporte();
                    descripcion = tablaAdicionalesCorrecciones.getTitulo();
                    blanca = tablaAdicionalesCorrecciones.getBlanca();

                    parcialerrores = false;

                    if (blanca == false) {

                        await tablaHojas.getByPrimaryIndex(hoja).then(sta => {

                            if (sta == false) {

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Adicional Correcciones Indice: ");
                                imp.print(formato.form("######", indice, "0"));
                                imp.printre(' ', 2);

                                imp.print("No Existe Hoja Analitica " + formato.form("##", hoja, "0"));
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }

                        });

                        await tablaLineas.getByPrimaryIndex(hoja, linea).then(sta => {

                            if (sta == false) {

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Adicional Correcciones Indice: ");
                                imp.print(formato.form("######", indice, "0"));
                                imp.printre(' ', 2);

                                imp.print("No Existe Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0"));
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }
                            else {

                                detotales = tablaLineas.getDeTotales();
                                novisible = tablaLineas.getInvisible();
                                blanca2 = tablaLineas.getBlanca();

                                if (detotales == true) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("Adicional Correcciones Indice: ");
                                    imp.print(formato.form("######", indice, "0"));
                                    imp.printre(' ', 2);

                                    imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es de Totales.");
                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }

                                if (blanca2 == true) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("Adicional Correcciones Indice: ");
                                    imp.print(formato.form("######", indice, "0"));
                                    imp.printre(' ', 2);

                                    imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es Linea Blanca. No Válida.");
                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }

                                if (novisible == true && cargoslineasnovisibles == false) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("Adicional Correcciones Indice: ");
                                    imp.print(formato.form("######", indice, "0"));
                                    imp.printre(' ', 2);

                                    imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es No Visible.");
                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }
                            }
                        });

                    }

                    if (parcialerrores == false && blanca == false) {

                        await tablaCifras.getByPrimaryIndex(hoja, linea).then(sta => {

                            if (sta == true) {
                                impor = tablaCifras.getMesCalculo();
                                impor += importesig;
                                tablaCifras.registroBlanco();
                                tablaCifras.setMesCalculo(impor);
                                tablaCifras.updateRow(hoja, linea);
                            }
                            else {
                                for (i = 1; i <= 24; i++) cifras[i - 1] = 0.0;
                                tablaCifras.registroBlanco();
                                tablaCifras.setHoja(hoja);
                                tablaCifras.setLinea(linea);
                                tablaCifras.setCifras(cifras);
                                tablaCifras.setMesCalculo(importesig);
                                tablaCifras.setCerrada(false);
                                tablaCifras.insertRow();
                            }

                            if (importesig < 0.0) {
                                signo = "H";
                            }
                            else {
                                signo = "D";
                            }

                            referencia = "CONSTANTE";
                            cuenta = "ADICON";
                            subcuenta = "";

                            const fechixi = fecha.ultimodiames(mes_actu,anno_actu);

                            if (Math.abs(importesig) >= 0.001) {

                                secuencia++;
                                tablaMovimientos.registroBlanco();
                                tablaMovimientos.setHoja(hoja);
                                tablaMovimientos.setLinea(linea);
                                tablaMovimientos.setAnno(anno_actu);
                                tablaMovimientos.setMes(mes_actu);
                                tablaMovimientos.setSecuencia(secuencia);
                                tablaMovimientos.setDescripcion(descripcion);
                                tablaMovimientos.setImporte(Math.abs(importesig));
                                tablaMovimientos.setSigno(signo);
                                tablaMovimientos.setReferencia(referencia);
                                tablaMovimientos.setCuenta(cuenta);
                                tablaMovimientos.setSubCuenta(subcuenta);
                                tablaMovimientos.setFecha(fecha.forfecha("B", fechixi, ""));
                                tablaMovimientos.setOrigen("");
                                tablaMovimientos.insertRow();

                            }
                        });

                    }

                    stat = tablaAdicionalesCorrecciones.getNext();
                }
            });

            // Primera pasada Incorporacion Adicionales Estadisticos

            tablaAdicionalesEstadisticos.addFirstBlanca(TablaSQL.TablaSQL.BTR_NOT_EQ, true);
            tablaAdicionalesEstadisticos.setOrdenBy("ORDEN");

            await tablaAdicionalesEstadisticos.open().then(async sta => {

                stat = tablaAdicionalesEstadisticos.getFirst();

                while (stat == true) {

                    indice = tablaAdicionalesEstadisticos.getIndice();
                    hoja = tablaAdicionalesEstadisticos.getHoja();
                    linea = tablaAdicionalesEstadisticos.getLinea();
                    importesig = tablaAdicionalesEstadisticos.getImporte();
                    descripcion = tablaAdicionalesEstadisticos.getTitulo();
                    blanca = tablaAdicionalesEstadisticos.getBlanca();

                    parcialerrores = false;

                    if (blanca == false) {

                        await tablaHojas.getByPrimaryIndex(hoja).then(sta => {

                            if (sta == false) {

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Adicional Estadistico Indice: ");
                                imp.print(formato.form("######", indice, "0"));
                                imp.printre(' ', 2);

                                imp.print("No Existe Hoja Analitica " + formato.form("##", hoja, "0"));
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }

                        });

                        await tablaLineas.getByPrimaryIndex(hoja, linea).then(sta => {

                            if (sta == false) {

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Adicional Estadistico Indice: ");
                                imp.print(formato.form("######", indice, "0"));
                                imp.printre(' ', 2);

                                imp.print("No Existe Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0"));
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }
                            else {

                                detotales = tablaLineas.getDeTotales();
                                novisible = tablaLineas.getInvisible();
                                blanca2 = tablaLineas.getBlanca();

                                if (detotales == true) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("Adicional Estadistico Indice: ");
                                    imp.print(formato.form("######", indice, "0"));
                                    imp.printre(' ', 2);

                                    imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es de Totales.");
                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }

                                if (blanca2 == true) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("Adicional Estadistico Indice: ");
                                    imp.print(formato.form("######", indice, "0"));
                                    imp.printre(' ', 2);

                                    imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es Linea Blanca. No Válida.");
                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }

                                if (novisible == true && cargoslineasnovisibles == false) {

                                    hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                    impresoraabierta = true;

                                    if (imp.hayespacio(2) == false) {
                                        imp.hoja();
                                        hojaimpre++;
                                        cabecera(imp, tituloempresa, hojaimpre);
                                    }

                                    imp.printre(' ', 2);
                                    imp.print("Adicional Estadistico Indice: ");
                                    imp.print(formato.form("######", indice, "0"));
                                    imp.printre(' ', 2);

                                    imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es No Visible.");
                                    imp.linea();

                                    errorescalculo = true;
                                    parcialerrores = true;

                                }
                            }
                        });

                    }

                    if (parcialerrores == false && blanca == false) {

                        await tablaCifras.getByPrimaryIndex(hoja, linea).then(sta => {

                            if (sta == true) {
                                impor = tablaCifras.getMesCalculo();
                                impor += importesig;
                                tablaCifras.registroBlanco();
                                tablaCifras.setMesCalculo(impor);
                                tablaCifras.updateRow(hoja, linea);
                            }
                            else {
                                for (i = 1; i <= 24; i++) cifras[i - 1] = 0.0;
                                tablaCifras.registroBlanco();
                                tablaCifras.setHoja(hoja);
                                tablaCifras.setLinea(linea);
                                tablaCifras.setCifras(cifras);
                                tablaCifras.setMesCalculo(importesig);
                                tablaCifras.setCerrada(false);
                                tablaCifras.insertRow();
                            }

                            if (importesig < 0.0) {
                                signo = "H";
                            }
                            else {
                                signo = "D";
                            }

                            referencia = "CONSTANTE";
                            cuenta = "ADICON";
                            subcuenta = "";

                            const fechixi = fecha.ultimodiames(mes_actu,anno_actu);

                            if (Math.abs(importesig) >= 0.001) {

                                secuencia++;
                                tablaMovimientos.registroBlanco();
                                tablaMovimientos.setHoja(hoja);
                                tablaMovimientos.setLinea(linea);
                                tablaMovimientos.setAnno(anno_actu);
                                tablaMovimientos.setMes(mes_actu);
                                tablaMovimientos.setSecuencia(secuencia);
                                tablaMovimientos.setDescripcion(descripcion);
                                tablaMovimientos.setImporte(Math.abs(importesig));
                                tablaMovimientos.setSigno(signo);
                                tablaMovimientos.setReferencia(referencia);
                                tablaMovimientos.setCuenta(cuenta);
                                tablaMovimientos.setSubCuenta(subcuenta);
                                tablaMovimientos.setFecha(fecha.forfecha("B", fechixi, ""));
                                tablaMovimientos.setOrigen("");
                                tablaMovimientos.insertRow();

                            }
                        });

                    }

                    stat = tablaAdicionalesEstadisticos.getNext();
                }
            });

            // Primera pasada Incorporacion Correcciones Especiales

            tablaCorreccionesEspeciales.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
            tablaCorreccionesEspeciales.setOrdenBy("HOJA,LINEA");

            await tablaCorreccionesEspeciales.open().then(async reto => {

                stat = tablaCorreccionesEspeciales.getFirst();

                while (stat == true) {

                    indice = tablaCorreccionesEspeciales.getIndice();
                    hoja = tablaCorreccionesEspeciales.getHoja();
                    linea = tablaCorreccionesEspeciales.getLinea();
                    importesig = tablaCorreccionesEspeciales.getImporte();
                    descripcion = tablaCorreccionesEspeciales.getCausa();

                    parcialerrores = false;

                    await tablaHojas.getByPrimaryIndex(hoja).then(sta => {

                        if (sta == false) {

                            hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                            impresoraabierta = true;

                            if (imp.hayespacio(2) == false) {
                                imp.hoja();
                                hojaimpre++;
                                cabecera(imp, tituloempresa, hojaimpre);
                            }

                            imp.printre(' ', 2);
                            imp.print("Correcciones Especiales Indice: ");
                            imp.print(formato.form("######", indice, "0"));
                            imp.printre(' ', 2);

                            imp.print("No Existe Hoja Analitica " + formato.form("##", hoja, "0"));
                            imp.linea();

                            errorescalculo = true;
                            parcialerrores = true;

                        }

                    });

                    await tablaLineas.getByPrimaryIndex(hoja, linea).then(async sta => {

                        if (sta == false) {

                            hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                            impresoraabierta = true;

                            if (imp.hayespacio(2) == false) {
                                imp.hoja();
                                hojaimpre++;
                                cabecera(imp, tituloempresa, hojaimpre);
                            }

                            imp.printre(' ', 2);
                            imp.print("Correcciones Especiales Indice: ");
                            imp.print(formato.form("######", indice, "0"));
                            imp.printre(' ', 2);

                            imp.print("No Existe Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0"));
                            imp.linea();

                            errorescalculo = true;
                            parcialerrores = true;

                        }
                        else {

                            detotales = tablaLineas.getDeTotales();
                            novisible = tablaLineas.getInvisible();
                            blanca2 = tablaLineas.getBlanca();

                            if (detotales == true) {

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Correcciones Especiales Indice: ");
                                imp.print(formato.form("######", indice, "0"));
                                imp.printre(' ', 2);

                                imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es de Totales.");
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }

                            if (blanca2 == true) {

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Correcciones Especiales Indice: ");
                                imp.print(formato.form("######", indice, "0"));
                                imp.printre(' ', 2);

                                imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es Linea Blanca. No Válida.");
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }

                            if (novisible == true && cargoslineasnovisibles == false) {

                                hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                                impresoraabierta = true;

                                if (imp.hayespacio(2) == false) {
                                    imp.hoja();
                                    hojaimpre++;
                                    cabecera(imp, tituloempresa, hojaimpre);
                                }

                                imp.printre(' ', 2);
                                imp.print("Correcciones Especiales Indice: ");
                                imp.print(formato.form("######", indice, "0"));
                                imp.printre(' ', 2);

                                imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es No Visible.");
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }
                        }

                        if (parcialerrores == false) {

                            await tablaCifras.getByPrimaryIndex(hoja, linea).then(sta => {

                                if (sta == true) {
                                    impor = tablaCifras.getMesCalculo();
                                    impor += importesig;
                                    tablaCifras.registroBlanco();
                                    tablaCifras.setMesCalculo(impor);
                                    tablaCifras.updateRow(hoja, linea);
                                }
                                else {
                                    for (i = 1; i <= 24; i++) cifras[i - 1] = 0.0;
                                    tablaCifras.registroBlanco();
                                    tablaCifras.setHoja(hoja);
                                    tablaCifras.setLinea(linea);
                                    tablaCifras.setCifras(cifras);
                                    tablaCifras.setMesCalculo(importesig);
                                    tablaCifras.setCerrada(false);
                                    tablaCifras.insertRow();
                                }

                                if (importesig < 0.0) {
                                    signo = "H";
                                }
                                else {
                                    signo = "D";
                                }

                                referencia = "ESPECIAL";
                                cuenta = "ADIESPE";
                                subcuenta = "";

                                const fechixi = fecha.ultimodiames(mes_actu,anno_actu);

                                if (Math.abs(importesig) >= 0.001) {

                                    secuencia++;
                                    tablaMovimientos.registroBlanco();
                                    tablaMovimientos.setHoja(hoja);
                                    tablaMovimientos.setLinea(linea);
                                    tablaMovimientos.setAnno(anno_actu);
                                    tablaMovimientos.setMes(mes_actu);
                                    tablaMovimientos.setSecuencia(secuencia);
                                    tablaMovimientos.setDescripcion(descripcion);
                                    tablaMovimientos.setImporte(Math.abs(importesig));
                                    tablaMovimientos.setSigno(signo);
                                    tablaMovimientos.setReferencia(referencia);
                                    tablaMovimientos.setCuenta(cuenta);
                                    tablaMovimientos.setSubCuenta(subcuenta);
                                    tablaMovimientos.setFecha(fecha.forfecha("B", fechixi, ""));
                                    tablaMovimientos.setOrigen("");
                                    tablaMovimientos.insertRow();

                                }
                            });

                        }
                    });

                    stat = tablaCorreccionesEspeciales.getNext();
                }
            });

            // Primera pasada Incorporacion Acumulados Estadisticos

            var importesig;

            tablaAcumuladosEstadisticos.addFirstBlanca(TablaSQL.TablaSQL.BTR_NOT_EQ, true);
            tablaAcumuladosEstadisticos.setOrdenBy("ORDEN");

            await tablaAcumuladosEstadisticos.open().then(async reto => {

                stat = tablaAcumuladosEstadisticos.getFirst();

                while (stat == true) {

                    hoja = tablaAcumuladosEstadisticos.getHoja();
                    linea = tablaAcumuladosEstadisticos.getLinea();
                    importesig = tablaAcumuladosEstadisticos.getImporte();
                    descripcion = tablaAcumuladosEstadisticos.getTitulo();

                    parcialerrores = false;

                    await tablaHojas.getByPrimaryIndex(hoja).then(sta => {

                        if (sta == false) {

                            hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                            impresoraabierta = true;

                            if (imp.hayespacio(2) == false) {
                                imp.hoja();
                                hojaimpre++;
                                cabecera(imp, tituloempresa, hojaimpre);
                            }

                            imp.printre(' ', 2);
                            imp.print("Acumulado Estadistico Hoja/Linea: ");
                            imp.print(formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0"));
                            imp.printre(' ', 2);

                            imp.print("No Existe Hoja Analitica " + formato.form("##", hoja, "0"));
                            imp.linea();

                            errorescalculo = true;
                            parcialerrores = true;

                        }
                    });

                    await tablaLineas.getByPrimaryIndex(hoja, linea).then(async sta => {

                        if (sta == false) {

                            hojaimpre = abririmpresora(impresoraabierta, imp, tituloempresa, hojaimpre, vector_datos_impresora);

                            impresoraabierta = true;

                            if (imp.hayespacio(2) == false) {
                                imp.hoja();
                                hojaimpre++;
                                cabecera(imp, tituloempresa, hojaimpre);
                            }

                            imp.printre(' ', 2);
                            imp.print("Acumulado Estadistico Hoja/Linea: ");
                            imp.print(formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0"));
                            imp.printre(' ', 2);

                            imp.print("No Existe Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0"));
                            imp.linea();

                            errorescalculo = true;
                            parcialerrores = true;

                        }
                        else {

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
                                imp.print("Acumulado Estadistico Hoja/Linea: ");
                                imp.print(formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0"));
                                imp.printre(' ', 2);

                                imp.print("La Linea Analitica " + formato.form("##", hoja, "0") + " / " + formato.form("###", linea, "0") + " Es de Totales");
                                imp.linea();

                                errorescalculo = true;
                                parcialerrores = true;

                            }
                        }

                        if (parcialerrores == false) {

                            await tablaCifrasExtras.getByPrimaryIndex(hoja, linea).then(sta => {

                                if (sta == true) {
                                    tablaCifrasExtras.registroBlanco();
                                    tablaCifrasExtras.setMesCalculo(importesig);
                                    tablaCifrasExtras.updateRow(hoja, linea);
                                }
                                else {
                                    for (var i = 1; i <= 24; i++) cifras[i - 1] = 0.0;
                                    tablaCifrasExtras.registroBlanco();
                                    tablaCifrasExtras.setHoja(hoja);
                                    tablaCifrasExtras.setLinea(linea);
                                    tablaCifrasExtras.setCifras(cifras);
                                    tablaCifrasExtras.setMesCalculo(importesig);
                                    tablaCifrasExtras.setCerrada(false);
                                    tablaCifrasExtras.insertRow();
                                }
                            });
                        }
                    });

                    stat = tablaAcumuladosEstadisticos.getNext();
                }
            });

        }

        // Pasadas Siguientes de Sumar Totales

        var pasada;

        for (var kk = 2; kk <= maxpasadas; kk++) {

            tablaLineas.addFirstPasadaCalculo(TablaSQL.TablaSQL.BTR_EQ, kk);
            tablaLineas.addAndDeTotales(TablaSQL.TablaSQL.BTR_EQ, true);
            tablaLineas.setOrdenBy("HOJA,LINEA");

            await tablaLineas.open().then(async reto => {

                stat = tablaLineas.getFirst();

                while (stat == true) {

                    hoja = tablaLineas.getHoja();
                    linea = tablaLineas.getLinea();

                    parcialerrores = false;

                    await tablaTotales.getByPrimaryIndex(hoja, linea).then(async sta => {

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

                        if (parcialerrores == false) {

                            numcomponentes = tablaTotales.getNumComponentes();
                            coeficientes = tablaTotales.getCoeficientes();
                            hojascomp = tablaTotales.getHojasComponentes();
                            lineascomp = tablaTotales.getLineasComponentes();
                            mascomp = tablaTotales.getMasComponentes();

                            suma = 0.0;
                            for (var s = 1; s <= numcomponentes; s++) {

                                pasada = 1;

                                await tablaLineas2.getByPrimaryIndex(hojascomp[s - 1], lineascomp[s - 1]).then(async sta => {

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
                                    else {

                                        await tablaCifras.getByPrimaryIndex(hojascomp[s - 1], lineascomp[s - 1]).then(async sta => {

                                            if (sta == true) {
                                                impor = tablaCifras.getMesCalculo();
                                                impor = coeficientes[s - 1] * impor;
                                                if (mascomp[s - 1] == "-") impor = -1 * impor;
                                            }
                                            else {
                                                impor = 0.0;
                                            }
                                            suma += impor;
                                        });
                                    }
                                });
                            }

                            suma = rutinas.ajustardecimales(suma, 2);

                            await tablaCifras.getByPrimaryIndex(hoja, linea).then(sta => {

                                if (sta == true) {
                                    impor = tablaCifras.getMesCalculo();
                                    impor += suma;
                                    tablaCifras.registroBlanco();
                                    tablaCifras.setMesCalculo(impor);
                                    tablaCifras.updateRow(hoja, linea);
                                }
                                else {
                                    for (i = 1; i <= 24; i++) cifras[i - 1] = 0.0;
                                    tablaCifras.registroBlanco();
                                    tablaCifras.setHoja(hoja);
                                    tablaCifras.setLinea(linea);
                                    tablaCifras.setCifras(cifras);
                                    tablaCifras.setMesCalculo(suma);
                                    tablaCifras.setCerrada(false);
                                    tablaCifras.insertRow();
                                }

                            });

                        }

                    });

                    stat = tablaLineas.getNext();
                }
            });
        }

        // Fijacion de los indicadores al final del proceso

        if (saldocarga < 0.0) {
            signo = "H";
        }
        else {
            signo = "D";
        }

        var conten = "";

        if (errorescalculo == false) {

            await tablaIndicadores.getByPrimaryIndex(5).then(reto => {   // Indicador D
                tablaIndicadores.registroBlanco();
                tablaIndicadores.setEncendido(true);
                tablaIndicadores.updateRow(5);
            });

            await tablaIndicadores.getByPrimaryIndex(4).then(reto => {  // Indicador B
                tablaIndicadores.registroBlanco();
                tablaIndicadores.setEncendido(false);
                tablaIndicadores.updateRow(4);
            });

            conten += "<p style='color: red;'>Cálculo Finalizado Correctamente</p>";
            conten += "<p>Cálculo Finalizado. Saldo Carga = " + formato.form("###.###.###,##", Math.abs(saldocarga), "k") + " " + signo + "</p>";
        }
        else {

            tablaMovimientos.borrarMes(anno, mes);

            conten += "<p style='color: red;'>Cálculo No Realizado. Hay Errores</p>";

        }

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
