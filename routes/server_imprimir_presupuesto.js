// --------------------------------------------------------------
// Servidor: Impresion del Presupuesto
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const tabla_parametros_app = require('../tablas/tabla_parametros_app.js');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_presupuesto = require('../tablas/tabla_presupuesto.js');
const tabla_notas_ppto = require('../tablas/tabla_notas_ppto.js');
const impresion = require('../treu/treu_print_courier_pdf.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');
const fecha = require('../treu/forfecha.js');
const TablaSQL = require('../tablas/TablaSQL.js');

/* GET home page. */
router.get('/imprimir_presupuesto', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    var mes = search_params.get('mes');
    var hoja_inicial = search_params.get('hoja_inicial');
    var hoja_final = search_params.get('hoja_final');
    var formato_listado = search_params.get('formato_listado');
    var con_notas = rutinas.parseBoolean(search_params.get('con_notas'));

    if (hoja_inicial == null) hoja_inicial = 1;
    if (hoja_final == null) hoja_final = 99;
    if (formato_listado == null) formato_listado = 1;
    if (mes == null) mes = 12;
    if (con_notas == null) con_notas = false;

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

        var fecha_ppto_format = fecha.forfecha('B', fecha_ppto, '');

        campos = { nombre_empresa, mes_en_curso, anno_en_curso, anno_ppto, fecha_ppto, fecha_ppto_format, hora_ppto, ppto_activo, control_de_fecha, hoja_resultado, linea_resultado, hoja_facturacion, linea_facturacion };

    }).then(reponse => {

        const fichero = "./frontend/static/css/index.css";

        var titulo_boton = "Imprimir";
        var color_boton = rutinas.getStyle(fichero, ".clase_boton_modificacion");

        var mes_actual = mes;
        var meses = Array();
        var hoja = 0;

        for (var i = 1; i <= 12; i++) {
            var fec = new Date("2000-" + i + "-01");
            var mes_letra = fecha.forfecha('Ml', fec, "");
            meses.push(formato.form('##', i, "0") + ' / ' + mes_letra);
        }

        var content;
        fs.readFile('./views/imprimir_presupuesto.pug', async function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { titulo_boton, color_boton, mes_actual, meses, formato_listado, hoja_inicial, hoja_final, con_notas, campos: campos }));
        });
    });
});

router.post('/imprimir_presupuesto', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaPresupuesto = new tabla_presupuesto.TablaPresupuesto(db);
    var tablaNotasPresupuesto = new tabla_notas_ppto.TablaNotasPresupuesto(db);

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
    var con_notas = rutinas.parseBoolean(rutinas.leer_lista_campos(vector_texto, 'CON_NOTAS'));

    var imp;

    if (formato_listado == '1' || formato_listado == '3') {
        imp = new impresion.Treu_print_courier_pdf('H');
        imp.resetcondi();
        imp.setOrientacion("H");
        imp.setSizeFont(11);
        imp.compactarbis(true);
    }
    else {
        imp = new impresion.Treu_print_courier_pdf('V');
        imp.resetcondi();
        imp.setOrientacion("V");
        imp.setSizeFont(8);
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
    var valor_total;
    var valor_mes_ref;
    var valor_acumulado_ref;
    var valor_total_ref;

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

                    if (con_notas == true) {
                        cabecera1(imp, nombre_empresa, hoja, titulohoja, externa, anno_ppto, mes_consu);
                    }
                    else {
                        cabecera2(imp, nombre_empresa, hoja, titulohoja, externa, anno_ppto, mes_consu);
                    }

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
                            tipoacumulado = tablaLineas.getTipoAcumulado();

                            await tablaPresupuesto.getByPrimaryIndex(hoja, linea).then(async stati => {

                                if (stati == true) {
                                    valor_mes = tablaPresupuesto.getValorMes(mes_consu);
                                    valor_acumulado = tablaPresupuesto.getValorAcumulado(mes_consu);
                                    valor_total = tablaPresupuesto.getAcumulado();
                                }
                                else {
                                    valor_mes = 0.0;
                                    valor_acumulado = 0.0;
                                    valor_total = 0.0;
                                }

                                await tablaPresupuesto.getByPrimaryIndex(ref_hoja, ref_linea).then(stati => {

                                    if (stati == true) {
                                        valor_mes_ref = tablaPresupuesto.getValorMes(mes_consu);
                                        valor_acumulado_ref = tablaPresupuesto.getValorAcumulado(mes_consu);
                                        valor_total_ref = tablaPresupuesto.getAcumulado();
                                    }
                                    else {
                                        valor_mes_ref = 0.0;
                                        valor_acumulado_ref = 0.0;
                                        valor_total_ref = 0.0;
                                    }

                                });
                            });

                            var nota;

                            await tablaNotasPresupuesto.getByPrimaryIndex(hoja, linea).then(sstt => {

                                if (sstt == true) {
                                    nota = tablaNotasPresupuesto.getNota()
                                }
                                else {
                                    nota = "";
                                }
                            });

                            if (imp.hayespacio(1) == true && invisible == false) {

                                // Con Notas de Presupuesto

                                if (con_notas == true) {

                                    imp.print(formato.form("###", linea, ""));

                                    imp.print("I");

                                    if (blanca == true && caracterblanco != ' ' && caracterblanco != '\0') {

                                        imp.printre(caracterblanco, 109);
                                        imp.print("I");
                                        imp.linea();

                                    } else {

                                        var porcenmes = rutinas.treu_div(valor_mes, Math.abs(valor_mes_ref)) * 100;
                                        var porcenacum = rutinas.treu_div(valor_acumulado, Math.abs(valor_acumulado_ref)) * 100;
                                        var porcenppto = rutinas.treu_div(valor_total, Math.abs(valor_total_ref)) * 100;

                                        var valormes = valor_mes;
                                        var valorppto = valor_total;

                                        if (blanca == true && (caracterblanco == ' ' || caracterblanco == '\0')) {
                                            valormes = 0.0;
                                            valorppto = 0.0;
                                            porcenmes = 0.0;
                                            porcenppto = 0.0;
                                        }

                                        if (intensa == true) imp.setNegrita(true);
                                        imp.print(rutinas.acoplarserie(titulo, 30));
                                        if (intensa == true) imp.setNegrita(false);

                                        imp.print("I");

                                        if (intensa == true) imp.setNegrita(true);
                                        if (color == true) setColorNumero(imp, valormes, de_totales, estadistica);
                                        if (con_decimales == true) {
                                            imp.print(formato.form("###.###.###,##", valormes, "DB"));
                                            imp.print(" ");
                                            imp.print(formato.form("###,##", porcenmes, "DB"));
                                        }
                                        else {
                                            imp.print(formato.form("##.###.###.###", valormes, "DB"));
                                            imp.print(" ");
                                            imp.print(formato.form("###,##", porcenmes, "DB"));
                                        }
                                        if (color == true) imp.resetColor();
                                        if (intensa == true) imp.setNegrita(false);

                                        imp.print("I");

                                        if (intensa == true) imp.setNegrita(true);
                                        if (color == true) setColorNumero(imp, valorppto, de_totales, estadistica);
                                        if (con_decimales == true) {
                                            imp.print(formato.form("###.###.###,##", valorppto, "DB"));
                                            imp.print(" ");
                                            imp.print(formato.form("###,##", porcenppto, "DB"));
                                        }
                                        else {
                                            imp.print(formato.form("##.###.###.###", valorppto, "DB"));
                                            imp.print(" ");
                                            imp.print(formato.form("###,##", porcenppto, "DB"));
                                        }
                                        if (color == true) imp.resetColor();
                                        if (intensa == true) imp.setNegrita(false);

                                        imp.print("I");

                                        if (intensa == true) imp.setNegrita(true);
                                        imp.print(rutinas.acoplarserie(nota, 30));
                                        if (intensa == true) imp.setNegrita(false);

                                        imp.print("I");

                                        imp.linea();
                                    }
                                }

                                // Sin Notas de Presupuesto

                                if (con_notas == false) {

                                    imp.print(formato.form("###", linea, ""));

                                    imp.print("I");

                                    if (blanca == true && caracterblanco != ' ' && caracterblanco != '\0') {

                                        imp.printre(caracterblanco, 102);
                                        imp.print("I");
                                        imp.linea();

                                    } else {

                                        var porcenmes = rutinas.treu_div(valor_mes, Math.abs(valor_mes_ref)) * 100;
                                        var porcenacum = rutinas.treu_div(valor_acumulado, Math.abs(valor_acumulado_ref)) * 100;
                                        var porcenppto = rutinas.treu_div(valor_total, Math.abs(valor_total_ref)) * 100;

                                        var valormes = valor_mes;
                                        var valorppto = valor_total;

                                        if (blanca == true && (caracterblanco == ' ' || caracterblanco == '\0')) {
                                            valormes = 0.0;
                                            valorppto = 0.0;
                                            porcenmes = 0.0;
                                            porcenppto = 0.0;
                                        }

                                        if (intensa == true) imp.setNegrita(true);
                                        imp.print(rutinas.acoplarserie(titulo, 30));
                                        if (intensa == true) imp.setNegrita(false);

                                        imp.print("I");

                                        if (intensa == true) imp.setNegrita(true);
                                        if (color == true) setColorNumero(imp, valormes, de_totales, estadistica);
                                        if (con_decimales == true) {
                                            imp.print(formato.form("###.###.###,##", valormes, "DB"));
                                            imp.print(" ");
                                            imp.print(formato.form("###,##", porcenmes, "DB"));
                                        }
                                        else {
                                            imp.print(formato.form("##.###.###.###", valormes, "DB"));
                                            imp.print(" ");
                                            imp.print(formato.form("###,##", porcenmes, "DB"));
                                        }
                                        if (color == true) imp.resetColor();
                                        if (intensa == true) imp.setNegrita(false);

                                        imp.print("I");

                                        if (intensa == true) imp.setNegrita(true);
                                        if (color == true) setColorNumero(imp, valor_acumulado, de_totales, estadistica);
                                        if (con_decimales == true) {
                                            imp.print(formato.form("###.###.###,##", valor_acumulado, "DB"));
                                            imp.print(" ");
                                            imp.print(formato.form("###,##", porcenacum, "DB"));
                                        }
                                        else {
                                            imp.print(formato.form("##.###.###.###", valor_acumulado, "DB"));
                                            imp.print(" ");
                                            imp.print(formato.form("###,##", porcenacum, "DB"));
                                        }
                                        if (color == true) imp.resetColor();
                                        if (intensa == true) imp.setNegrita(false);

                                        imp.print("I");

                                        if (intensa == true) imp.setNegrita(true);
                                        if (color == true) setColorNumero(imp, valorppto, de_totales, estadistica);
                                        if (con_decimales == true) {
                                            imp.print(formato.form("###.###.###,##", valorppto, "DB"));
                                            imp.print(" ");
                                            imp.print(formato.form("###,##", porcenppto, "DB"));
                                        }
                                        else {
                                            imp.print(formato.form("##.###.###.###", valorppto, "DB"));
                                            imp.print(" ");
                                            imp.print(formato.form("###,##", porcenppto, "DB"));
                                        }
                                        if (color == true) imp.resetColor();
                                        if (intensa == true) imp.setNegrita(false);

                                        imp.print("I");

                                        imp.linea();
                                    }
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

function cabecera1(imp, nombre_empresa, hojaana, titulohoja, externa, annoppto, mes) {

    var fec = new Date("2000-" + mes + "-01");
    var mes_letra = fecha.forfecha('Ml', fec, "");

    mes_letra = rutinas.acoplarserie(mes_letra, 12).toUpperCase();

    imp.linea();
    imp.printre(' ', 75);
    imp.printre('-', 27);
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('-', 44);
    imp.print("      PRESUPUESTO ANUAL     ");
    imp.print("I C O N F I D E N C I A L I     ");
    imp.print(externa);
    imp.linea();

    imp.printre(' ', 3);
    imp.print("I " + rutinas.acoplarserie(nombre_empresa, 40) + " I");
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
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('-', 111);
    imp.linea();

    imp.printre(' ', 3);
    imp.print("I       C O N C E P T O        I  PPTO " + mes_letra + "    I   PRESUPUESTO " + formato.form("####", annoppto, "0") + "    I          N O T A S           I");
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('-', 111);
    imp.linea();

}

function cabecera2(imp, nombre_empresa, hojaana, titulohoja, externa, annoppto, mes) {

    var fec = new Date("2000-" + mes + "-01");
    var mes_letra = fecha.forfecha('Ml', fec, "");

    mes_letra = rutinas.acoplarserie(mes_letra, 12).toUpperCase();

    imp.linea();
    imp.printre(' ', 75);
    imp.printre('-', 27);
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('-', 44);
    imp.print("      PRESUPUESTO ANUAL     ");
    imp.print("I C O N F I D E N C I A L I     ");
    imp.print(externa);
    imp.linea();

    imp.printre(' ', 3);
    imp.print("I " + rutinas.acoplarserie(nombre_empresa, 40) + " I");
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
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('-', 104);
    imp.linea();

    imp.printre(' ', 3);
    imp.print("I       C O N C E P T O        I  PPTO " + mes_letra + "    I  ACUM " + mes_letra + "    I   PRESUPUESTO " + formato.form("####", annoppto, "0") + "    I");
    imp.linea();

    imp.printre(' ', 3);
    imp.printre('-', 104);
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
