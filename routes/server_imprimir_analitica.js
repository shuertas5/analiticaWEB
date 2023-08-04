// --------------------------------------------------------------
// Servidor: Impresion de la Analitica
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const tabla_parametros_app = require('../tablas/tabla_parametros_app.js');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_cifras = require('../tablas/tabla_cifras.js');
const tabla_cifras_extras = require('../tablas/tabla_cifras_extras.js');
const tabla_presupuesto = require('../tablas/tabla_presupuesto.js');
const tabla_historico_cifras = require('../tablas/tabla_historico_cifras.js');
const impresion = require('../treu/treu_print_courier_pdf.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');
const fecha = require('../treu/forfecha.js');
const TablaSQL = require('../tablas/TablaSQL.js');

/* GET home page. */
router.get('/imprimir_analitica', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    var mes = search_params.get('mes');
    var hoja_inicial = search_params.get('hoja_inicial');
    var hoja_final = search_params.get('hoja_final');
    var formato_listado = search_params.get('formato_listado');

    var nombre_empresa;
    var escudo_empresa;
    var pasadas_calculo;
    var mes_en_curso;
    var anno_en_curso;
    var titulo_corto;
    var anno_ppto;
    var fecha_ppto;
    var hora_ppto;
    var obligatoria_desc_adicional;
    var ppto_activo;
    var analitica_subcta_vacia;
    var cargos_a_no_visibles;
    var control_de_fecha;
    var hoja_resultado;
    var linea_resultado;
    var hoja_facturacion;
    var linea_facturacion;

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaPresupuesto = new tabla_presupuesto.TablaPresupuesto(db);
    var tablaCifras = new tabla_cifras.TablaCifras(db);
    var tablaCifrasExtras = new tabla_cifras_extras.TablaCifrasExtras(db);

    var campos = {};

    await tablaParametrosApp.getByPrimaryIndex().then(stat2 => {

        if (stat2 == true) {

            nombre_empresa = tablaParametrosApp.getTituloEmpresa();
            escudo_empresa = tablaParametrosApp.getEscudoEmpresa();
            mes_en_curso = tablaParametrosApp.getMesEnCurso();
            anno_en_curso = tablaParametrosApp.getAnnoEnCurso();
            anno_ppto = tablaParametrosApp.getAnnoPpto();
            fecha_ppto = tablaParametrosApp.getFechaPpto();
            hora_ppto = tablaParametrosApp.getHoraPpto();
            ppto_activo = tablaParametrosApp.getPresupuestoActivo();
            control_de_fecha = tablaParametrosApp.getControlFechaMovimientos();
            hoja_resultado = tablaParametrosApp.getHojaResultado();
            linea_resultado = tablaParametrosApp.getLineaResultado();
            hoja_facturacion = tablaParametrosApp.getHojaFacturacion();
            linea_facturacion = tablaParametrosApp.getLineaFacturacion();

        }
        else {

            nombre_empresa = "";
            escudo_empresa = "";
            mes_en_curso = 1;
            anno_en_curso = 2022;
            anno_ppto = 2022;
            fecha_ppto = null;
            hora_ppto = "";
            ppto_activo = false;
            control_de_fecha = true;
            hoja_resultado = 0;
            linea_resultado = 0;
            hoja_facturacion = 0;
            linea_facturacion = 0;

        }

        if (hoja_inicial == null) hoja_inicial = 1;
        if (hoja_final == null) hoja_final = 99;
        if (formato_listado == null) formato_listado = 1;
        if (mes == null) mes = mes_en_curso;

        campos = { nombre_empresa, mes_en_curso, anno_en_curso, anno_ppto, fecha_ppto, hora_ppto, ppto_activo, control_de_fecha, hoja_resultado, linea_resultado, hoja_facturacion, linea_facturacion };

    }).then(reponse => {

        const fichero = "./frontend/static/css/index.css";

        var titulo_boton = "Imprimir";
        var color_boton = rutinas.getStyle(fichero, ".clase_boton_modificacion");

        var mes_actual = mes;
        var meses = Array();
        var hoja = 0;

        for (var i = 1; i <= mes_en_curso; i++) {
            var fec = new Date("2000-" + i + "-01");
            var mes_letra = fecha.forfecha('Ml', fec, "");
            meses.push(formato.form('##', i, "0") + ' / ' + mes_letra);
        }

        var content;
        fs.readFile('./views/imprimir_analitica.pug', async function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { titulo_boton, color_boton, mes_actual, meses, formato_listado, hoja_inicial, hoja_final, campos: campos }));
        });
    });
});

router.post('/imprimir_analitica', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaPresupuesto = new tabla_presupuesto.TablaPresupuesto(db);
    var tablaCifras = new tabla_cifras.TablaCifras(db);
    var tablaCifrasExtras = new tabla_cifras_extras.TablaCifrasExtras(db);
    var tablaHistoricoCifras = new tabla_historico_cifras.TablaHistoricoCifras(db);

    var nombre_empresa;
    var escudo_empresa;
    var mes_en_curso;
    var anno_en_curso;
    var anno_ppto;
    var fecha_ppto;
    var hora_ppto;
    var ppto_activo;
    var control_de_fecha;
    var hoja_resultado;
    var linea_resultado;
    var hoja_facturacion;
    var linea_facturacion;

    await tablaParametrosApp.getByPrimaryIndex().then(stat2 => {

        if (stat2 == true) {

            nombre_empresa = tablaParametrosApp.getTituloEmpresa();
            escudo_empresa = tablaParametrosApp.getEscudoEmpresa();
            mes_en_curso = tablaParametrosApp.getMesEnCurso();
            anno_en_curso = tablaParametrosApp.getAnnoEnCurso();
            anno_ppto = tablaParametrosApp.getAnnoPpto();
            fecha_ppto = tablaParametrosApp.getFechaPpto();
            hora_ppto = tablaParametrosApp.getHoraPpto();
            ppto_activo = tablaParametrosApp.getPresupuestoActivo();
            control_de_fecha = tablaParametrosApp.getControlFechaMovimientos();
            hoja_resultado = tablaParametrosApp.getHojaResultado();
            linea_resultado = tablaParametrosApp.getLineaResultado();
            hoja_facturacion = tablaParametrosApp.getHojaFacturacion();
            linea_facturacion = tablaParametrosApp.getLineaFacturacion();

        }
        else {

            nombre_empresa = "";
            escudo_empresa = "";
            mes_en_curso = 1;
            anno_en_curso = 2022;
            anno_ppto = 2022;
            fecha_ppto = null;
            hora_ppto = "";
            ppto_activo = false;
            control_de_fecha = true;
            hoja_resultado = 0;
            linea_resultado = 0;
            hoja_facturacion = 0;
            linea_facturacion = 0;

        }
    });

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    var vector_texto = req.body.data;
    var vector_datos_impresora = req.body.data_impre;

    var mes_consu = rutinas.leer_lista_campos(vector_texto, 'MES');
    var formato_listado = rutinas.leer_lista_campos(vector_texto, 'FORMATO_LISTADO');
    var hoja_inicial = rutinas.leer_lista_campos(vector_texto, 'HOJA_INICIAL');
    var hoja_final = rutinas.leer_lista_campos(vector_texto, 'HOJA_FINAL');

    var mes_actual = mes_en_curso;
    var imp;

    if (formato_listado == '1' || formato_listado == '3') {
        imp = new impresion.Treu_print_courier_pdf('H');
        imp.resetcondi();
        imp.setOrientacion("H");
        imp.setSizeFont(10);
        imp.compactarbis(true);
    }
    else {
        imp = new impresion.Treu_print_courier_pdf('V');
        imp.resetcondi();
        imp.setOrientacion("V");
        imp.setSizeFont(7);
        imp.compactarbis(false);
    }

    imp.setMargenes(1, 1, 4, 4);

    var color;
    if (formato_listado == '3' || formato_listado == '4') {
        color = true;
    }
    else {
        color = false;
    }

    var valor_mes;
    var valor_acumulado;
    var valor_presupuesto;
    var valor_ante;
    var valor_mes_ref;
    var valor_acumulado_ref;
    var valor_presupuesto_ref;
    var valor_ante_ref;

    var porcenmes = 0.0;
    var porcenacu = 0.0;
    var porcenante = 0.0;
    var porcenppto = 0.0;

    var aper = imp.aperturaSilenciosa2(vector_datos_impresora);

    var prime = true;

    if (aper == true) {

        tablaHojas.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaHojas.setOrdenBy('HOJAEXTERNA');

        await tablaHojas.open().then(async reto1 => {

            var stat0 = tablaHojas.getFirst();

            while (stat0 == true) {

                var hoja = tablaHojas.getHoja();
                var hoja_invisible = tablaHojas.getInvisible();

                if (hoja >= hoja_inicial && hoja <= hoja_final && hoja_invisible == false) {

                    var titulohoja = tablaHojas.getTitulo();
                    var externa = tablaHojas.getHojaExterna();

                    if (prime == false) {
                        imp.hoja();
                    }
                    else {
                        prime = false;
                    }

                    cabecera(imp, nombre_empresa, hoja, titulohoja, externa, mes_consu, anno_en_curso);

                    tablaLineas.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
                    tablaLineas.setOrdenBy("HOJA,LINEA");

                    await tablaLineas.open().then(async ret => {

                        var stat = tablaLineas.getFirst();

                        while (stat == true) {

                            linea = tablaLineas.getLinea();
                            titulo = tablaLineas.getTitulo();
                            ref_hoja = tablaLineas.getRefHoja();
                            ref_linea = tablaLineas.getRefLinea();
                            invisible = tablaLineas.getInvisible();
                            pasadas_calculo = tablaLineas.getPasadaCalculo();
                            de_totales = tablaLineas.getDeTotales();
                            intensa = tablaLineas.getIntensa();
                            blanca = tablaLineas.getBlanca();
                            sumable = tablaLineas.getSumable();
                            estadistica = tablaLineas.getEstadistica();
                            con_decimales = tablaLineas.getConDecimales();
                            caracterblanco = tablaLineas.getCaracterBlanco();
                            no_acumulable = tablaLineas.getNoAcumulable();
                            con_porcentaje = tablaLineas.getConPorcentaje();
                            reduccionamillares = tablaLineas.getReduccionAMillares();
                            lineademargen = tablaLineas.getLineaDeMargen();
                            lineadereparto = tablaLineas.getLineaDeReparto();
                            tipo_acumulado = tablaLineas.getTipoAcumulado();

                            await tablaCifras.getByPrimaryIndex(hoja, linea).then(async stati => {

                                if (stati == true) {
                                    valor_mes = tablaCifras.getValorMes(mes_actual, mes_consu);
                                    valor_acumulado = tablaCifras.getValorAcumulado(mes_actual, mes_consu);
                                    valor_ante = tablaCifras.getValorAnnoAnterior(mes_actual, mes_consu);
                                }
                                else {
                                    valor_mes = 0.0;
                                    valor_acumulado = 0.0;
                                    valor_ante = 0.0;
                                }

                                await tablaCifras.getByPrimaryIndex(ref_hoja, ref_linea).then(stati => {

                                    if (stati == true) {
                                        valor_mes_ref = tablaCifras.getValorMes(mes_actual, mes_consu);
                                        valor_acumulado_ref = tablaCifras.getValorAcumulado(mes_actual, mes_consu);
                                        valor_ante_ref = tablaCifras.getValorAnnoAnterior(mes_actual, mes_consu);
                                    }
                                    else {
                                        valor_mes_ref = 0.0;
                                        valor_acumulado_ref = 0.0;
                                        valor_ante_ref = 0.0;
                                    }

                                });
                            });

                            if (sumable == false) {

                                if (tipo_acumulado == tabla_lineas.TablaLineas.ACUMULADO_DATO_EXTRA) {

                                    await tablaCifrasExtras.getByPrimaryIndex(hoja, linea).then(async stati => {

                                        if (stati == true) {
                                            valor_acumulado = tablaCifrasExtras.getValorMes(mes_actual, mes_consu);
                                            valor_ante = tablaCifrasExtras.getValorMesAnnoAnte(mes_actual, mes_consu);
                                        }
                                        else {
                                            valor_acumulado = 0.0;
                                            valor_ante = 0.0;
                                        }

                                    });

                                    await tablaCifrasExtras.getByPrimaryIndex(ref_hoja, ref_linea).then(stati => {

                                        if (stati == true) {
                                            valor_acumulado_ref = tablaCifrasExtras.getValorMes(mes_actual, mes_consu);
                                            valor_ante_ref = tablaCifrasExtras.getValorAnnoAnte(mes_actual, mes_consu);
                                        }
                                        else {
                                            valor_acumulado_ref = 0.0;
                                            valor_ante_ref = 0.0;
                                        }

                                    });
                                }

                                if (tipo_acumulado == tabla_lineas.TablaLineas.ACUMULADO_MEDIA_ANUAL) {

                                    await tablaCifras.getByPrimaryIndex(hoja, linea).then(async stati => {

                                        if (stat == true) {
                                            valor_acumulado = 0.0;
                                            for (var i = 1; i <= mes_consu; i++) {
                                                valor_acumulado += tablaCifras.getValorMes(mes_actual, i);
                                            }
                                            valor_acumulado = valor_acumulado / mes_consu;

                                            valor_ante = 0.0;
                                            for (var i = 1; i <= mes_consu; i++) {
                                                valor_ante += tablaCifras.getValorMesAnnoAnte(mes_actual, i);
                                            }
                                            valor_ante = valor_ante / mes_consu;
                                        }
                                        else {
                                            valor_acumulado = 0.0;
                                            valor_ante = 0.0;
                                        }

                                    });

                                    await tablaCifras.getByPrimaryIndex(ref_hoja, ref_linea).then(async stati => {

                                        if (stat == true) {
                                            valor_acumulado_ref = 0.0;
                                            for (var i = 1; i <= mes_consu; i++) {
                                                valor_acumulado_ref += tablaCifras.getValorMes(mes_actual, i);
                                            }
                                            valor_acumulado_ref = valor_acumulado_ref / mes_consu;

                                            valor_ante_ref = 0.0;
                                            for (var i = 1; i <= mes_consu; i++) {
                                                valor_ante_ref += tablaCifras.getValorMesAnnoAnte(mes_actual, i);
                                            }
                                            valor_ante_ref = valor_ante_ref / mes_consu;
                                        }
                                        else {
                                            valor_acumulado_ref = 0.0;
                                            valor_ante_ref = 0.0;
                                        }

                                    });

                                }

                                if (tipo_acumulado == tabla_lineas.TablaLineas.ACUMULADO_MEDIA_12_MESES) {

                                    await tablaCifras.getByPrimaryIndex(hoja, linea).then(async stati => {

                                        if (stat == true) {

                                            valor_acumulado = 0.0;
                                            for (var i = 1; i <= mes_consu; i++) {
                                                valor_acumulado += tablaCifras.getValorMes(mes_actual, i);
                                            }
                                            for (var i = mes_consu + 1; i <= 12; i++) {
                                                valor_acumulado += tablaCifras.getValorMesAnnoAnte(mes_actual, i);
                                            }
                                            valor_acumulado = valor_acumulado / 12;

                                            valor_ante = 0.0;
                                            for (var i = 1; i <= mes_consu; i++) {
                                                valor_ante += tablaCifras.getValorMesAnnoAnte(mes_actual, i);
                                            }

                                            await tablaHistoricoCifras.getByPrimaryIndex(anno_en_curso - 2, hoja, linea).then(async statix => {

                                                if (statix == true) {

                                                    for (var i = mes_consu + 1; i <= 12; i++) {
                                                        valor_ante += tablaHistoricoCifras.getValorMes(i);
                                                    }

                                                }
                                                valor_ante = valor_ante / 12;

                                            });
                                        }
                                        else {
                                            valor_acumulado = 0.0;
                                            valor_ante = 0.0;
                                        }
                                    });

                                    await tablaCifras.getByPrimaryIndex(ref_hoja, ref_linea).then(async stati => {

                                        if (stat == true) {

                                            valor_acumulado_ref = 0.0;
                                            for (var i = 1; i <= mes_consu; i++) {
                                                valor_acumulado_ref += tablaCifras.getValorMes(mes_actual, i);
                                            }
                                            for (var i = mes_consu + 1; i <= 12; i++) {
                                                valor_acumulado_ref += tablaCifras.getValorMesAnnoAnte(mes_actual, i);
                                            }
                                            valor_acumulado_ref = valor_acumulado_ref / 12;

                                            valor_ante_ref = 0.0;
                                            for (var i = 1; i <= mes_consu; i++) {
                                                valor_ante_ref += tablaCifras.getValorMesAnnoAnte(mes_actual, i);
                                            }

                                            await tablaHistoricoCifras.getByPrimaryIndex(anno_en_curso - 2, ref_hoja, ref_linea).then(async statix => {

                                                if (statix == true) {

                                                    for (var i = mes_consu + 1; i <= 12; i++) {
                                                        valor_ante_ref += tablaHistoricoCifras.getValorMes(i);
                                                    }

                                                }
                                                valor_ante_ref = valor_ante_ref / 12;

                                            });
                                        }
                                        else {
                                            valor_acumulado_ref = 0.0;
                                            valor_ante_ref = 0.0;
                                        }
                                    });
                               }

                            }

                            await tablaPresupuesto.getByPrimaryIndex(hoja, linea).then(async stati => {

                                if (stati == true) {
                                    valor_presupuesto = tablaPresupuesto.getValorAcumulado(mes_consu);
                                }
                                else {
                                    valor_presupuesto = 0.0;
                                }

                                await tablaPresupuesto.getByPrimaryIndex(ref_hoja, ref_linea).then(stati => {

                                    if (stati == true) {
                                        valor_presupuesto_ref = tablaPresupuesto.getValorAcumulado(mes_consu);
                                    }
                                    else {
                                        valor_presupuesto_ref = 0.0;
                                    }

                                });
                            });

                            porcenmes = rutinas.treu_div(valor_mes, Math.abs(valor_mes_ref)) * 100;
                            porcenacu = rutinas.treu_div(valor_acumulado, Math.abs(valor_acumulado_ref)) * 100;
                            porcenante = rutinas.treu_div(valor_ante, Math.abs(valor_ante_ref)) * 100;
                            porcenppto = rutinas.treu_div(valor_presupuesto, Math.abs(valor_presupuesto_ref)) * 100;

                            if (con_porcentaje == false) {
                                porcenmes = 0.0;
                                porcenacu = 0.0;
                                porcenante = 0.0;
                                porcenppto = 0.0;
                            }

                            if (imp.hayespacio(1) == true && invisible == false) {

                                imp.print(formato.form("###", linea, ""));
                                imp.print("I");

                                if (blanca == true && caracterblanco != ' ' && caracterblanco != '\0') {

                                    imp.printre(caracterblanco, 126);
                                    imp.print("I");
                                    imp.linea();

                                } else {

                                    if (blanca == true && (caracterblanco == ' ' || caracterblanco == '\0')) {

                                        valor_mes = 0.0;
                                        valor_acumulado = 0.0;
                                        valor_ante = 0.0;
                                        valor_presupuesto = 0.0;

                                        porcenmes = 0.0;
                                        porcenacu = 0.0;
                                        porcenante = 0.0;
                                        porcenppto = 0.0;

                                    }

                                    if (intensa == true) imp.setNegrita(true);
                                    if (color == true) setColorNumero(imp, valor_mes, de_totales, estadistica);
                                    if (con_decimales == true) {
                                        imp.print(formato.form("###.###.###,##", valor_mes, "DB"));
                                        imp.print(" ");
                                        imp.print(formato.form("###,##", porcenmes, "DB"));
                                    }
                                    else {
                                        imp.print(formato.form("##.###.###.###", valor_mes, "DB"));
                                        imp.print(" ");
                                        imp.print(formato.form("###,##", porcenmes, "DB"));
                                    }
                                    if (color == true) imp.resetColor();
                                    if (intensa == true) imp.setNegrita(false);

                                    imp.print("I");
                                    if (intensa == true) imp.setNegrita(true);
                                    imp.print(rutinas.acoplarserie(titulo, 30));
                                    if (intensa == true) imp.setNegrita(false);
                                    imp.print("I");

                                    if (intensa == true) imp.setNegrita(true);
                                    if (color == true) setColorNumero(imp, valor_ante, de_totales, estadistica);
                                    if (con_decimales == true) {
                                        imp.print(formato.form("###.###.###,##", valor_ante, "DB"));
                                        imp.print(" ");
                                        imp.print(formato.form("###,##", porcenante, "DB"));
                                    }
                                    else {
                                        imp.print(formato.form("##.###.###.###", valor_ante, "DB"));
                                        imp.print(" ");
                                        imp.print(formato.form("###,##", porcenante, "DB"));
                                    }
                                    if (color == true) imp.resetColor();
                                    if (intensa == true) imp.setNegrita(false);

                                    imp.print("I");
                                    if (intensa == true) imp.setNegrita(true);
                                    if (color == true) setColorNumero(imp, valor_acumulado, de_totales, estadistica);
                                    if (con_decimales == true) {
                                        imp.print(formato.form("###.###.###,##", valor_acumulado, "DB"));
                                        imp.print(" ");
                                        imp.print(formato.form("###,##", porcenacu, "DB"));
                                    }
                                    else {
                                        imp.print(formato.form("##.###.###.###", valor_acumulado, "DB"));
                                        imp.print(" ");
                                        imp.print(formato.form("###,##", porcenacu, "DB"));
                                    }
                                    if (color == true) imp.resetColor();
                                    if (intensa == true) imp.setNegrita(false);

                                    imp.print("I");

                                    if (intensa == true) imp.setNegrita(true);
                                    if (color == true) setColorNumero(imp, valor_presupuesto, de_totales, estadistica);
                                    if (con_decimales == true) {
                                        imp.print(formato.form("###.###.###,##", valor_presupuesto, "DB"));
                                        imp.print(" ");
                                        imp.print(formato.form("###,##", porcenppto, "DB"));
                                    }
                                    else {
                                        imp.print(formato.form("##.###.###.###", valor_presupuesto, "DB"));
                                        imp.print(" ");
                                        imp.print(formato.form("###,##", porcenppto, "DB"));
                                    }
                                    if (color == true) imp.resetColor();
                                    if (intensa == true) imp.setNegrita(false);

                                    imp.print("I");
                                    imp.linea();
                                }
                            }

                            stat = tablaLineas.getNext();
                        }

                    });

                }

                stat0 = tablaHojas.getNext();
            }

        });

        imp.cierre();

    }

    res.send('');

});

function cabecera(imp, tituloempresa, hojaana, titulohoja, externa, mes, anno) {

    imp.linea();
    imp.printre(' ', 75);
    imp.printre('-', 27);
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('-', 44);
    imp.print("   HOJA ANALITICA DE        ");
    imp.print("I C O N F I D E N C I A L I     ");
    imp.print(externa);
    imp.linea();

    imp.printre(' ', 3);
    imp.print("I " + rutinas.acoplarserie(tituloempresa, 40) + " I");
    imp.printre(' ', 28);
    imp.printre('-', 27);
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('-', 44);
    imp.printre(' ', 3);
    imp.print(titulohoja);
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('>', 3);
    imp.printre(' ', 1);
    imp.print(formato.form("##", hojaana, "0"));
    imp.printre(' ', 85);
    imp.print(rutinas.mesesLetras(mes, true));
    imp.print("  AÑO " + formato.form("####", anno, "0"));
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('-', 128);
    imp.linea();

    imp.printre(' ', 3);
    imp.print("I         MES           I       C O N C E P T O        I  ACUM. AÑO ANTERIOR   I   ACUMULADO ACTUAL    I      PRESUPUESTO      I");
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('-', 128);
    imp.linea();

}

function setColorNumero(imp, valor, detotales, estadistica) {

    if (detotales == true) {
        imp.setColor(hexdec("000000"));  // negro
    }
    else if (estadistica == true) {
        imp.setColor(hexdec("00FF00"));  // Verde
    }
    else {
        if (valor < -0.0001) {
            imp.setColor(hexdec("0000FF"));   // azul
        }
        else {
            imp.setColor(hexdec("FF0000"));   // rojo
        }
    }
}

function hexdec(val) {
    var hex = parseInt(val, 16);
    return hex;
}

module.exports = router;
