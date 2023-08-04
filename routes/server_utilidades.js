// **********************************************************
// Utilidades de accesos al Servidor
// **********************************************************

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');

const TablaSQL = require('../tablas/TablaSQL');
const tabla_tipos_hojas = require('../tablas/tabla_tipos_hojas');
const tabla_hojas = require('../tablas/tabla_hojas');
const tabla_lineas = require('../tablas/tabla_lineas');
const tabla_totales = require('../tablas/tabla_totales');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_adicionales_costes = require('../tablas/tabla_adicionales_costes');
const tabla_adicionales_estadisticos = require('../tablas/tabla_adicionales_estadisticos');
const tabla_adicionales_correcciones = require('../tablas/tabla_adicionales_correcciones');
const tabla_acumulados_estadisticos = require('../tablas/tabla_acumulados_estadisticos');
const tabla_valores_ppto = require('../tablas/tabla_valores_ppto');
const tabla_asignaciones = require('../tablas/tabla_asignaciones');
const tabla_notas_ppto = require('../tablas/tabla_notas_ppto');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');

router.post('/utilidades', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var lectura = JSON.parse(req.body.cuerpo);

    // ----------------------------------
    // Acceso Lectura Nombre Empresa 
    // ----------------------------------

    if (lectura.funcion == 'get_nombre_empresa') {

        var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);

        var nombre;
        var imagen;

        await tablaParametrosApp.getByPrimaryIndex().then(stat => {

            if (stat == true) {

                nombre = tablaParametrosApp.getTituloEmpresa();
                imagen = tablaParametrosApp.getEscudoEmpresa();

                var sal = { ret: true, tipo, nombre, imagen }

                res.json(sal);
            }
            else {

                var sal = { ret: false }

                res.json(sal);
            }

        });
    }

    // ----------------------------------
    // Acceso Primario a Tipo de Hoja 
    // ----------------------------------

    if (lectura.funcion == 'get_tipo_hoja_primary') {

        var tipo = lectura.parametros.tipo;
        var titulo;

        var tablaTiposHojas = new tabla_tipos_hojas.TablaTiposHojas(db);

        await tablaTiposHojas.getByPrimaryIndex(tipo).then(stat => {

            if (stat == true) {

                tipo = tablaTiposHojas.getTipo();
                titulo = tablaTiposHojas.getTitulo();

                var sal = { ret: true, tipo, titulo }

                res.json(sal);
            }
            else {

                var sal = { ret: false }

                res.json(sal);
            }

        });
    }

    // ----------------------------------
    // Acceso Primario a Hoja Analitica
    // ----------------------------------

    if (lectura.funcion == 'get_hoja_primary') {

        var hoja = lectura.parametros.hoja;
        var titulo;
        var hoja_externa;
        var tipo_hoja;
        var invisible;
        var linea_resultado;
        var linea_facturacion;

        var tablaHojas = new tabla_hojas.TablaHojas(db);

        await tablaHojas.getByPrimaryIndex(hoja).then(stat => {

            if (stat == true) {

                hoja = tablaHojas.getHoja();
                titulo = tablaHojas.getTitulo();
                hoja_externa = tablaHojas.getHojaExterna();
                tipo_hoja = tablaHojas.getTipoHoja();
                invisible = tablaHojas.getInvisible();
                linea_resultado = tablaHojas.getLineaResultado();
                linea_facturacion = tablaHojas.getLineaFacturacion();

                var sal = { ret: true, hoja, titulo, hoja_externa, tipo_hoja, invisible, linea_resultado, linea_facturacion }

                res.json(sal);
            }
            else {

                var sal = { ret: false }

                res.json(sal);
            }

        });
    }

    // ----------------------------------
    // Acceso Primario a Linea Analitica
    // ----------------------------------

    if (lectura.funcion == 'get_linea_primary') {

        var hoja = lectura.parametros.hoja;
        var linea = lectura.parametros.linea;
        var titulo;
        var invisible;

        var tablaLineas = new tabla_lineas.TablaLineas(db);

        await tablaLineas.getByPrimaryIndex(hoja, linea).then(stat => {

            if (stat == true) {

                hoja = tablaLineas.getHoja();
                linea = tablaLineas.getLinea();
                titulo = tablaLineas.getTitulo();
                invisible = tablaLineas.getInvisible();

                var sal = { ret: true, hoja, linea, titulo, invisible }

                res.json(sal);
            }
            else {

                var sal = { ret: false }

                res.json(sal);
            }

        });
    }

    // ------------------------------------------
    // Acceso Secuencial a Lineas de Analitica
    // ------------------------------------------

    if (lectura.funcion == 'get_lineas_secuencial') {

        var hoja = lectura.parametros.hoja;

        var linea;
        var titulo;
        var ref_hoja;
        var ref_linea;
        var blanca;
        var de_totales;
        var invisible;
        var rows = new Array();

        const acceso = require("./procedimientos_varios");

        var db = acceso.accesoDB(req.session.empresa);

        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaLineas = new tabla_lineas.TablaLineas(db);

        tablaLineas.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
        tablaLineas.setOrdenBy('HOJA,LINEA');

        await tablaLineas.open().then(async response => {

            var stat = tablaLineas.getFirst();

            while (stat == true) {

                linea = tablaLineas.getLinea();
                titulo = tablaLineas.getTitulo();
                ref_hoja = tablaLineas.getRefHoja();
                ref_linea = tablaLineas.getRefLinea();
                blanca = tablaLineas.getBlanca();
                de_totales = tablaLineas.getDeTotales();
                invisible = tablaLineas.getInvisible();

                rows.push({ hoja, linea, titulo, ref_hoja, ref_linea, blanca, de_totales, invisible });

                stat = tablaLineas.getNext();
            }

            res.json(rows);

        });
    }

    // ------------------------------------------
    // Acceso Secuencial a Totales de Analitica
    // ------------------------------------------

    if (lectura.funcion == 'get_totales_secuencial') {

        var hoja = lectura.parametros.hoja;

        var linea;
        var nu_compo;
        var rows = new Array();

        const acceso = require("./procedimientos_varios");

        var db = acceso.accesoDB(req.session.empresa);

        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaTotales = new tabla_totales.TablaTotales(db);

        tablaTotales.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
        tablaTotales.setOrdenBy('HOJA,LINEA');

        await tablaTotales.open().then(async response => {

            var stat = tablaTotales.getFirst();

            while (stat == true) {

                linea = tablaTotales.getLinea();
                nu_compo = tablaTotales.getNumComponentes();

                rows.push({ hoja, linea, nu_compo });

                stat = tablaTotales.getNext();
            }

            res.json(rows);

        });
    }

    // ------------------------------------------------
    // Acceso Secuencial a Adicionales de Analitica
    // ------------------------------------------------

    if (lectura.funcion == 'get_adicionales_secuencial') {

        var tipo_adicional = lectura.parametros.tipo_adicional;
        var ordenacion = lectura.parametros.ordenacion;

        var indice;
        var titulo;
        var orden;
        var hoja;
        var linea;
        var titu_linea;
        var blanca;
        var grabada;
        var rows = new Array();

        var indice_str;
        var titulo_forma;
        var ordena_str;
        var hoja_str;
        var linea_str;
        var titu_linea_str;
        var importe_str;

        const acceso = require("./procedimientos_varios");

        var db = acceso.accesoDB(req.session.empresa);

        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaAdicionalesCostes = new tabla_adicionales_costes.TablaAdicionalesCostes(db);
        var tablaAdicionalesEstadisticos = new tabla_adicionales_estadisticos.TablaAdicionalesEstadisticos(db);
        var tablaAdicionalesCorrecciones = new tabla_adicionales_correcciones.TablaAdicionalesCorrecciones(db);
        var tablaAcumuladosEstadisticos = new tabla_acumulados_estadisticos.TablaAcumuladosEstadisticos(db);

        var orden_str = ""

        if (ordenacion == '1') {
            orden_str = "INDICE";
        }
        else {
            orden_str = "ORDEN,INDICE";
        }

        if (tipo_adicional == 'costes') {

            tablaAdicionalesCostes.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
            tablaAdicionalesCostes.setOrdenBy(orden_str);

            await tablaAdicionalesCostes.open().then(async response => {

                var stat = tablaAdicionalesCostes.getFirst();

                while (stat == true) {

                    indice = tablaAdicionalesCostes.getIndice();
                    titulo = tablaAdicionalesCostes.getTitulo();
                    hoja = tablaAdicionalesCostes.getHoja();
                    linea = tablaAdicionalesCostes.getLinea();
                    blanca = tablaAdicionalesCostes.getBlanca();
                    orden = tablaAdicionalesCostes.getOrden();
                    grabada = tablaAdicionalesCostes.getGrabada();
                    importe = tablaAdicionalesCostes.getImporte();

                    if (blanca == true) {
                        indice_str = "";
                        ordena_str = "";
                        hoja_str = "";
                        linea_str = "";
                        titulo_forma = "font-weight: bold;"
                        titu_linea_str = "";
                        importe_str = "";
                    }
                    else {
                        if (grabada == false) {
                            importe_str = "*No Valorado*"
                        }
                        else {
                            importe_str = formato.form("###.###.###,##", importe, "");
                        }
                        indice_str = indice;
                        ordena_str = orden;
                        hoja_str = formato.form('##', hoja, "0");
                        linea_str = formato.form('###', linea, "0");
                        titulo_forma = ""
                    }

                    await tablaLineas.getByPrimaryIndex(hoja, linea).then(result => {
                        if (result == true) {
                            titu_linea = rutinas.acoplarseriemax(tablaLineas.getTitulo(), 15);
                        }
                        else {
                            titu_linea = "";

                        }
                        titu_linea_str = titu_linea;
                    })

                    rows.push({ indice, orden, titulo, hoja, linea, titu_linea, importe, blanca, grabada, indice_str, ordena_str, titulo_forma, hoja_str, linea_str, importe_str, titu_linea_str });

                    stat = tablaAdicionalesCostes.getNext();
                }

                res.json(rows);

            });
        }

        if (tipo_adicional == 'estadisticos') {

            tablaAdicionalesEstadisticos.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
            tablaAdicionalesEstadisticos.setOrdenBy(orden_str);

            await tablaAdicionalesEstadisticos.open().then(async response => {

                var stat = tablaAdicionalesEstadisticos.getFirst();

                while (stat == true) {

                    indice = tablaAdicionalesEstadisticos.getIndice();
                    titulo = tablaAdicionalesEstadisticos.getTitulo();
                    hoja = tablaAdicionalesEstadisticos.getHoja();
                    linea = tablaAdicionalesEstadisticos.getLinea();
                    blanca = tablaAdicionalesEstadisticos.getBlanca();
                    orden = tablaAdicionalesEstadisticos.getOrden();
                    grabada = tablaAdicionalesEstadisticos.getGrabada();
                    importe = tablaAdicionalesEstadisticos.getImporte();

                    if (blanca == true) {
                        indice_str = "";
                        ordena_str = "";
                        hoja_str = "";
                        linea_str = "";
                        titulo_forma = "font-weight: bold;"
                        titu_linea_str = "";
                        importe_str = "";
                    }
                    else {
                        if (grabada == false) {
                            importe_str = "*No Valorado*"
                        }
                        else {
                            importe_str = formato.form("###.###.###,##", importe, "");
                        }
                        indice_str = indice;
                        ordena_str = orden;
                        hoja_str = formato.form('##', hoja, "0");
                        linea_str = formato.form('###', linea, "0");
                        titulo_forma = ""
                    }

                    await tablaLineas.getByPrimaryIndex(hoja, linea).then(result => {
                        if (result == true) {
                            titu_linea = rutinas.acoplarseriemax(tablaLineas.getTitulo(), 15);
                        }
                        else {
                            titu_linea = "";
                        }
                        titu_linea_str = titu_linea;
                    })

                    rows.push({ indice, orden, titulo, hoja, linea, titu_linea, importe, blanca, grabada, indice_str, ordena_str, titulo_forma, hoja_str, linea_str, importe_str, titu_linea_str });

                    stat = tablaAdicionalesEstadisticos.getNext();
                }

                res.json(rows);

            });
        }

        if (tipo_adicional == 'acum_estadisticos') {

            tablaAcumuladosEstadisticos.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
            tablaAcumuladosEstadisticos.setOrdenBy(orden_str);

            await tablaAcumuladosEstadisticos.open().then(async response => {

                var stat = tablaAcumuladosEstadisticos.getFirst();

                while (stat == true) {

                    indice = tablaAcumuladosEstadisticos.getIndice();
                    titulo = tablaAcumuladosEstadisticos.getTitulo();
                    hoja = tablaAcumuladosEstadisticos.getHoja();
                    linea = tablaAcumuladosEstadisticos.getLinea();
                    blanca = tablaAcumuladosEstadisticos.getBlanca();
                    orden = tablaAcumuladosEstadisticos.getOrden();
                    grabada = tablaAcumuladosEstadisticos.getGrabada();
                    importe = tablaAcumuladosEstadisticos.getImporte();

                    if (blanca == true) {
                        indice_str = "";
                        ordena_str = "";
                        hoja_str = "";
                        linea_str = "";
                        titulo_forma = "font-weight: bold;"
                        titu_linea_str = "";
                        importe_str = "";
                    }
                    else {
                        if (grabada == false) {
                            importe_str = "*No Valorado*"
                        }
                        else {
                            importe_str = formato.form("###.###.###,##", importe, "");
                        }
                        indice_str = indice;
                        ordena_str = orden;
                        hoja_str = formato.form('##', hoja, "0");
                        linea_str = formato.form('###', linea, "0");
                        titulo_forma = ""
                    }

                    await tablaLineas.getByPrimaryIndex(hoja, linea).then(result => {
                        if (result == true) {
                            titu_linea = rutinas.acoplarseriemax(tablaLineas.getTitulo(), 15);
                        }
                        else {
                            titu_linea = "";
                        }
                        titu_linea_str = titu_linea;
                    })

                    rows.push({ indice, orden, titulo, hoja, linea, titu_linea, importe, blanca, grabada, indice_str, ordena_str, titulo_forma, hoja_str, linea_str, importe_str, titu_linea_str });
                    stat = tablaAcumuladosEstadisticos.getNext();
                }

                res.json(rows);

            });
        }

        if (tipo_adicional == 'correcciones') {

            tablaAdicionalesCorrecciones.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
            tablaAdicionalesCorrecciones.setOrdenBy(orden_str);

            await tablaAdicionalesCorrecciones.open().then(async response => {

                var stat = tablaAdicionalesCorrecciones.getFirst();

                while (stat == true) {

                    indice = tablaAdicionalesCorrecciones.getIndice();
                    titulo = tablaAdicionalesCorrecciones.getTitulo();
                    hoja = tablaAdicionalesCorrecciones.getHoja();
                    linea = tablaAdicionalesCorrecciones.getLinea();
                    blanca = tablaAdicionalesCorrecciones.getBlanca();
                    orden = tablaAdicionalesCorrecciones.getOrden();
                    grabada = tablaAdicionalesCorrecciones.getGrabada();
                    importe = tablaAdicionalesCorrecciones.getImporte();

                    if (blanca == true) {
                        indice_str = "";
                        ordena_str = "";
                        hoja_str = "";
                        linea_str = "";
                        titulo_forma = "font-weight: bold;"
                        titu_linea_str = "";
                        importe_str = "";
                    }
                    else {
                        if (grabada == false) {
                            importe_str = "*No Valorado*"
                        }
                        else {
                            importe_str = formato.form("###.###.###,##", importe, "");
                        }
                        indice_str = indice;
                        ordena_str = orden;
                        hoja_str = formato.form('##', hoja, "0");
                        linea_str = formato.form('###', linea, "0");
                        titulo_forma = ""
                    }

                    await tablaLineas.getByPrimaryIndex(hoja, linea).then(result => {
                        if (result == true) {
                            titu_linea = rutinas.acoplarseriemax(tablaLineas.getTitulo(), 15);
                        }
                        else {
                            titu_linea = "";
                        }
                        titu_linea_str = titu_linea;
                    })

                    rows.push({ indice, orden, titulo, hoja, linea, titu_linea, importe, blanca, grabada, indice_str, ordena_str, titulo_forma, hoja_str, linea_str, importe_str, titu_linea_str });

                    stat = tablaAdicionalesCorrecciones.getNext();
                }

                res.json(rows);

            });
        }
    }

    // --------------------------------------------------------------
    // Acceso Secuencial a Lineas entrada Presupuesto de Analitica
    // --------------------------------------------------------------

    if (lectura.funcion == 'get_valores_ppto_secuencial') {

        var hoja = lectura.parametros.hoja;

        var linea;
        var titulo;
        var ref_hoja;
        var ref_linea;
        var blanca;
        var de_totales;
        var invisible;
        var importe;
        var grabada;
        var rows = new Array();

        var hoja_intro = hoja;

        const acceso = require("./procedimientos_varios");

        var db = acceso.accesoDB(req.session.empresa);

        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaValoresPresupuesto = new tabla_valores_ppto.TablaValoresPresupuesto(db);

        tablaLineas.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
        tablaLineas.setOrdenBy('HOJA,LINEA');

        await tablaLineas.open().then(async response => {

            var stat = tablaLineas.getFirst();

            while (stat == true) {

                linea = tablaLineas.getLinea();
                titulo = tablaLineas.getTitulo();
                ref_hoja = tablaLineas.getRefHoja();
                ref_linea = tablaLineas.getRefLinea();
                blanca = tablaLineas.getBlanca();
                de_totales = tablaLineas.getDeTotales();
                invisible = tablaLineas.getInvisible();

                hoja_str = formato.form('##', hoja, "0");
                linea_str = formato.form('###', linea, "0");

                if (de_totales == true) {
                    titulo_forma = "font-weight: bold;"
                    importe_str = "";
                    grabada = false;
                }
                else if (blanca == true || invisible == true) {
                    titulo_forma = "color: gray;"
                    importe_str = "";
                    grabada = false;
                }
                else {

                    await tablaValoresPresupuesto.getByPrimaryIndex(hoja, linea).then(st => {
                        if (st == true) {
                            importe = tablaValoresPresupuesto.getPresupuesto();
                            grabada = tablaValoresPresupuesto.getGrabada();
                        }
                        else {
                            importe = 0.0;
                            grabada = false;
                        }
                    })

                    if (grabada == false) {
                        importe_str = "*No Valorado*"
                    }
                    else {
                        importe_str = formato.form("###.###.###,##", importe, "");
                    }
                    titulo_forma = ""
                }

                rows.push({ hoja_intro, hoja, linea, titulo, importe, grabada, ref_hoja, ref_linea, blanca, de_totales, invisible, hoja_str, linea_str, importe_str });

                stat = tablaLineas.getNext();
            }

            res.json(rows);

        });
    }

    // ------------------------------------------------
    // Acceso Secuencial a Asignaciones
    // ------------------------------------------------

    if (lectura.funcion == 'get_asignaciones_secuencial') {

        var ordenacion = lectura.parametros.ordenacion;
        var buscar_cuenta = lectura.parametros.buscar_cuenta;

        var cuenta;
        var subcuenta
        var titulo;
        var hoja;
        var linea;
        var titu_linea;
        var rows = new Array();

        var cuenta_str;
        var subcuenta_str;
        var titulo_forma;
        var hoja_str;
        var linea_str;
        var titu_linea_str;
        var importe_str;

        const acceso = require("./procedimientos_varios");
        var db = acceso.accesoDB(req.session.empresa);

        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaAsignaciones = new tabla_asignaciones.TablaAsignaciones(db);

        var orden_str = ""

        if (ordenacion == '1') {
            orden_str = "CUENTA,SUBCUENTA";
        }
        else {
            orden_str = "HOJA,LINEA,CUENTA,SUBCUENTA";
        }

        if (ordenacion == "1" && buscar_cuenta != "") {
            tablaAsignaciones.addFirstCuenta(TablaSQL.TablaSQL.BTR_GR_OR_EQ, buscar_cuenta);
            tablaAsignaciones.setOrdenBy(orden_str);
        }
        else {
            tablaAsignaciones.addFirstCuenta(TablaSQL.TablaSQL.BTR_NOT_EQ, '');
            tablaAsignaciones.setOrdenBy(orden_str);
        }

        await tablaAsignaciones.open().then(async response => {

            var stat = tablaAsignaciones.getFirst();

            while (stat == true) {

                cuenta = tablaAsignaciones.getCuenta();
                subcuenta = tablaAsignaciones.getSubCuenta();
                titulo = tablaAsignaciones.getTitulo();
                hoja = tablaAsignaciones.getHoja();
                linea = tablaAsignaciones.getLinea();

                hoja_str = formato.form('##', hoja, "0");
                linea_str = formato.form('###', linea, "0");

                await tablaLineas.getByPrimaryIndex(hoja, linea).then(result => {
                    if (result == true) {
                        titu_linea = rutinas.acoplarseriemax(tablaLineas.getTitulo(), 15);
                    }
                    else {
                        titu_linea = "";

                    }
                    titu_linea_str = rutinas.acoplarseriemax(titu_linea, 20);
                })

                rows.push({ cuenta, subcuenta, titulo, hoja, linea, titu_linea, hoja_str, linea_str, titu_linea_str });

                stat = tablaAsignaciones.getNext();
            }

            res.json(rows);

        });
    }

    // ------------------------------------------
    // Acceso Secuencial a Notas de Ppto
    // ------------------------------------------

    if (lectura.funcion == 'get_notas_ppto_secuencial') {

        var hoja = lectura.parametros.hoja;

        var linea;
        var nota;
        var titu_linea;
        var rows = new Array();

        const acceso = require("./procedimientos_varios");

        var db = acceso.accesoDB(req.session.empresa);

        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaNotasPresupuesto = new tabla_notas_ppto.TablaNotasPresupuesto(db);

        tablaNotasPresupuesto.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
        tablaNotasPresupuesto.setOrdenBy('HOJA,LINEA');

        await tablaNotasPresupuesto.open().then(async response => {

            var stat = tablaNotasPresupuesto.getFirst();

            while (stat == true) {

                linea = tablaNotasPresupuesto.getLinea();
                nota = tablaNotasPresupuesto.getNota();

                await tablaLineas.getByPrimaryIndex(hoja,linea).then(st =>{
                    if (st==true) {
                        titu_linea = tablaLineas.getTitulo();
                    }
                    else {
                        titu_linea="";
                    }
                })

                rows.push({ hoja, linea, titu_linea, nota });

                stat = tablaNotasPresupuesto.getNext();
            }

            res.json(rows);

        });
    }
});

module.exports = router;
