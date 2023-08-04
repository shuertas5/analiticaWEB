// --------------------------------------------------------------
// Servidor: Consulta Analitica en Tramite
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_presupuesto = require('../tablas/tabla_presupuesto.js');
const tabla_cifras = require('../tablas/tabla_cifras.js');
const tabla_cifras_extras = require('../tablas/tabla_cifras_extras.js');
const tabla_parametros_app = require('../tablas/tabla_parametros_app.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');
const fecha = require('../treu/forfecha.js');

/* GET home page. */
router.get('/consulta_analitica_en_tramite', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    var mes_en_curso;
    var anno_en_curso;

    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);

    await tablaParametrosApp.getByPrimaryIndex().then(stat2 => {

        if (stat2 == true) {

            mes_en_curso = tablaParametrosApp.getMesEnCurso();
            anno_en_curso = tablaParametrosApp.getAnnoEnCurso();
        }
        else {
            mes_en_curso = 1;
            anno_en_curso = 2020;
        }
    });

    var mes_actual = mes_en_curso;
    var hoja = 0;

    var mes = mes_en_curso + 1;
    if (mes > 12) mes = 1;

    var fec = new Date("2000-" + (mes) + "-01");
    var mes_letra = fecha.forfecha('Ml', fec, "");
    var mes_en_calculo_format = formato.form('##', mes, "0") + ' / ' + mes_letra;

    var rows = [];

    var content;
    fs.readFile('./views/consulta_analitica_en_tramite.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { hoja, mes_actual, mes_actual, mes_en_calculo_format, rows: rows }));
    });

});

router.post('/consulta_analitica_en_tramite', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaPresupuesto = new tabla_presupuesto.TablaPresupuesto(db);
    var tablaCifras = new tabla_cifras.TablaCifras(db);
    var tablaCifrasExtras = new tabla_cifras_extras.TablaCifrasExtras(db);

    var hoja = req.body.HOJA;

    var stat;
    var linea;
    var titulo;
    var ref_hoja;
    var ref_linea;
    var invisible;
    var pasadas_calculo;
    var de_totales;
    var intensa;
    var blanca;
    var sumable;
    var estadistica;
    var con_decimales;
    var caracterblanco;
    var no_acumulable;
    var con_porcentaje;
    var reduccionamillares;
    var lineademargen;
    var lineadereparto;
    var tipo_acumulado;

    var valor_mes;
    var valor_acumulado;
    var ppto_acumulado;

    var valor_mes_ref;
    var valor_acumulado_ref;
    var ppto_acumulado_ref;

    var mes_actual;

    await tablaParametrosApp.getByPrimaryIndex().then(sti => {
        mes_actual = tablaParametrosApp.getMesEnCurso();
    });

    var mes_consu = mes_actual;
    mes_consu += 1;
    if (mes_consu > 12) mes_consu = 1;

    var temporal = "temporal";
    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var conten = "";

    var retorno = "temporal";
    var fiche = fs.openSync("./" + retorno + "/retorno.html", "w");

    conten += "<br>" + rutinas.repcarhtml('-', 110) + '<br>';
    conten += "&nbsp;LINEA TITULO LINEA ----------------- VALOR MES ------------- VALOR ACUMULADO ------- PRESUPUESTO ACUM. ----- <br>"
    conten += rutinas.repcarhtml('-', 110) + '<br><br>';

    tablaLineas.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja);
    tablaLineas.setOrdenBy("HOJA,LINEA");

    await tablaLineas.open().then(async ret => {

        stat = tablaLineas.getFirst();

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
                    valor_mes = tablaCifras.getMesCalculo();
                    valor_acumulado = tablaCifras.getValorAcumuladoEnTramite(mes_actual);
                }
                else {
                    valor_mes = 0.0;
                    valor_acumulado = 0.0;
                }

                await tablaCifras.getByPrimaryIndex(ref_hoja, ref_linea).then(stati => {

                    if (stati == true) {
                        valor_mes_ref = tablaCifras.getMesCalculo();
                        valor_acumulado_ref = tablaCifras.getValorAcumuladoEnTramite(mes_actual);
                    }
                    else {
                        valor_mes_ref = 0.0;
                        valor_acumulado_ref = 0.0;
                    }

                });
            });

            var valoresmeses = rutinas.iniciarArray(13);

            if (sumable == false) {

                for (var i = 1; i <= 12; i++) {
                    valoresmeses[i] = 0.0;
                }

                if (tipo_acumulado == tabla_lineas.TablaLineas.ACUMULADO_DATO_EXTRA) {

                    await tablaCifrasExtras.getByPrimaryIndex(hoja, linea).then(stati => {

                        if (stati == true) {
                            valor_acumulado = tablaCifrasExtras.getValorMesEnTramite();
                        }
                        else {
                            valor_acumulado = 0.0;
                        }
                    });

                    await tablaCifrasExtras.getByPrimaryIndex(ref_hoja, ref_linea).then(stati => {

                        if (stati == true) {
                            valor_acumulado_ref = tablaCifrasExtras.getValorMesEnTramite();
                        }
                        else {
                            valor_acumulado_ref = 0.0;
                        }
                    });
                }

                if (tipo_acumulado == tabla_lineas.TablaLineas.ACUMULADO_MEDIA_ANUAL) {

                    await tablaCifras.getByPrimaryIndex(hoja, linea).then(stati => {

                        if (stati == true) {

                            for (var i = 1; i <= mes - 1; i++) {
                                valoresmeses[i] = tablaCifras.getValorMes(mes_actual, i);
                            }
                            valoresmeses[mes] = tablaCifras.getValorMesEnTramite();

                            valor_acumulado = 0.0;
                            for (var i = 1; i <= mes_consu; i++) {
                                valor_acumulado += valoresmeses[i];
                            }
                            valor_acumulado = valor_acumulado / mes_consu;
                        }
                        else {
                            valor_acumulado = 0.0;
                        }

                    });

                    await tablaCifras.getByPrimaryIndex(ref_hoja, ref_linea).then(stati => {

                        if (stati == true) {

                            for (var i = 1; i <= mes - 1; i++) {
                                valoresmeses[i] = tablaCifras.getValorMes(mes_actual, i);
                            }
                            valoresmeses[mes] = tablaCifras.getValorMesEnTramite();

                            valor_acumulado_ref = 0.0;
                            for (var i = 1; i <= mes_consu; i++) {
                                valor_acumulado_ref += valoresmeses[i];
                            }
                            valor_acumulado_ref = valor_acumulado_ref / mes_consu;
                        }
                        else {
                            valor_acumulado_ref = 0.0;
                        }

                    });
                }

                if (tipo_acumulado == tabla_lineas.TablaLineas.ACUMULADO_MEDIA_12_MESES) {

                    await tablaCifras.getByPrimaryIndex(hoja, linea).then(stati => {

                        if (stati == true) {

                            valor_acumulado = 0.0;
                            for (var i = 1; i <= mes_consu - 1; i++) {
                                valoresmeses[i] = tablaCifras.getValorMes(mes_actual, i);
                            }
                            valoresmeses[mes_consu] = tablaCifras.getValorMesEnTramite();

                            for (var i = mes_consu + 1; i <= 12; i++) {
                                valoresmeses[i] = tablaCifras.getValorMesAnnoAnte(mes_actual, i);
                            }

                            valor_acumulado = 0.0;
                            for (var i = 1; i <= 12; i++) {
                                valor_acumulado += valoresmeses[i];
                            }
                            valor_acumulado = valor_acumulado / 12;

                        }
                        else {
                            valor_acumulado = 0.0;
                        }

                    });

                    await tablaCifras.getByPrimaryIndex(ref_hoja, ref_linea).then(stati => {

                        if (stati == true) {

                            valor_acumulado_ref = 0.0;
                            for (var i = 1; i <= mes_consu - 1; i++) {
                                valoresmeses[i] = tablaCifras.getValorMes(mes_actual, i);
                            }
                            valoresmeses[mes_consu] = tablaCifras.getValorMesEnTramite();

                            for (var i = mes_consu + 1; i <= 12; i++) {
                                valoresmeses[i] = tablaCifras.getValorMesAnnoAnte(mes_actual, i);
                            }

                            valor_acumulado_ref = 0.0;
                            for (var i = 1; i <= 12; i++) {
                                valor_acumulado_ref += valoresmeses[i];
                            }
                            valor_acumulado_ref = valor_acumulado_ref / 12;

                        }
                        else {
                            valor_acumulado_ref = 0.0;
                        }
                        
                    });
                }

            }

            await tablaPresupuesto.getByPrimaryIndex(hoja, linea).then(async stati => {

                if (stati == true) {
                    ppto_acumulado = tablaPresupuesto.getValorAcumulado(mes_consu);
                }
                else {
                    ppto_acumulado = 0.0;
                }

                await tablaPresupuesto.getByPrimaryIndex(ref_hoja, ref_linea).then(stati => {

                    if (stati == true) {
                        ppto_acumulado_ref = tablaPresupuesto.getValorAcumulado(mes_consu);
                    }
                    else {
                        ppto_acumulado_ref = 0.0;
                    }

                });
            });

            var porcenmes = rutinas.treu_div(valor_mes, Math.abs(valor_mes_ref)) * 100;
            var porcenacu = rutinas.treu_div(valor_acumulado, Math.abs(valor_acumulado_ref)) * 100;
            var porcenppto = rutinas.treu_div(ppto_acumulado, Math.abs(ppto_acumulado_ref)) * 100;

            if (con_porcentaje == false) {
                porcenmes = 0.0;
                porcenacu = 0.0;
                porcenppto = 0.0;
            }

            var colo;
            if (intensa == true) colo = 'blue'; else colo = 'black';
            if (invisible == false) {
                conten += '<div style="color: ' + colo + ';">';
                if (intensa == true) conten += '<b>';
                if (con_decimales == true) {
                    conten += "&nbsp;&nbsp;" + formato.form('###', linea, "H") + "&nbsp;&nbsp;" + rutinas.acoplarseriehtml(titulo, 30);
                    conten += "&nbsp;" + formato.form('###.###.###,##', valor_mes, "HBD") + "&nbsp;" + formato.form('###,##', porcenmes, "HBD");
                    conten += "&nbsp;" + formato.form('###.###.###,##', valor_acumulado, "HBD") + "&nbsp;" + formato.form('###,##', porcenacu, "HBD");
                    conten += "&nbsp;" + formato.form('###.###.###,##', ppto_acumulado, "HBD") + "&nbsp;" + formato.form('###,##', porcenppto, "HBD");
                    conten += "<br>";
                }
                else {
                    conten += "&nbsp;&nbsp;" + formato.form('###', linea, "H") + "&nbsp;&nbsp;" + rutinas.acoplarseriehtml(titulo, 30);
                    conten += "&nbsp;" + formato.form('##.###.###.###', valor_mes, "HBD") + "&nbsp;" + formato.form('###,##', porcenmes, "HBD");
                    conten += "&nbsp;" + formato.form('##.###.###.###', valor_acumulado, "HBD") + "&nbsp;" + formato.form('###,##', porcenacu, "HBD");
                    conten += "&nbsp;" + formato.form('##.###.###.###', ppto_acumulado, "HBD") + "&nbsp;" + formato.form('###,##', porcenppto, "HBD");
                    conten += "<br>";
                }
                if (intensa == true) conten += '</b>';
                conten += '</div>'
            }

            stat = tablaLineas.getNext();
        }

        fs.writeSync(fiche, conten, 0);
        fs.closeSync(fiche);

        res.send('');

    });

});

module.exports = router;
