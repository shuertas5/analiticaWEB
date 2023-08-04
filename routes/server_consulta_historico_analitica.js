// --------------------------------------------------------------
// Servidor: Consulta Historico Analitica
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_historico_presupuesto = require('../tablas/tabla_historico_presupuesto.js');
const tabla_historico_cifras = require('../tablas/tabla_historico_cifras.js');
const tabla_historico_cifras_extras = require('../tablas/tabla_historico_cifras_extras.js');
const tabla_parametros_app = require('../tablas/tabla_parametros_app.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');
const fecha = require('../treu/forfecha.js');

/* GET home page. */
router.get('/consulta_historico_analitica', async function (req, res, next) {

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
    var anno_actual = anno_en_curso;
    var meses = Array();
    var annos = Array();
    var annos_str = Array();
    var hoja = 0;

    for (var i = 1; i <= 12; i++) {
        var fec = new Date("2000-" + i + "-01");
        var mes_letra = fecha.forfecha('Ml', fec, "");
        meses.push(formato.form('##', i, "0") + ' ' + mes_letra);
    }

    var an = anno_actual;
    for (var i = 0; i < 15; i++) {
        an--;
        annos_str.push(formato.form('####', an, "0"));
        annos.push(an);
    }

    var rows = [];

    var content;
    fs.readFile('./views/consulta_historico_analitica.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { hoja, mes_actual, meses, anno_actual, annos, annos_str, rows: rows }));
    });

});

router.post('/consulta_historico_analitica', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaHistoricoPresupuesto = new tabla_historico_presupuesto.TablaHistoricoPresupuesto(db);
    var tablaHistoricoCifras = new tabla_historico_cifras.TablaHistoricoCifras(db);
    var tablaHistoricoCifrasExtras = new tabla_historico_cifras_extras.TablaHistoricoCifrasExtras(db);

    var hoja = req.body.HOJA;
    var mes_consu = req.body.MES;
    var anno_consu = req.body.ANNO;

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
    var anterior_acumulado;

    var valor_mes_ref;
    var valor_acumulado_ref;
    var ppto_acumulado_ref;
    var anterior_acumulado_ref;

    var mes_actual;

    tablaParametrosApp.getByPrimaryIndex().then(sti => {
        mes_actual = tablaParametrosApp.getMesEnCurso();
    });

    var temporal = "temporal";
    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var conten = "";

    var retorno = "temporal";
    var fiche = fs.openSync("./" + retorno + "/retorno.html", "w");

    conten += "<br>" + rutinas.repcarhtml('-', 134) + '<br>';
    conten += "&nbsp;LINEA TITULO LINEA ----------------- VALOR MES ------------- AÑO ANTERIOR ---------- VALOR ACUMULADO ------- PRESUPUESTO ACUM. ----- <br>"
    conten += rutinas.repcarhtml('-', 134) + '<br><br>';

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

            await tablaHistoricoCifras.getByPrimaryIndex(anno_consu, hoja, linea).then(async stati => {

                if (stati == true) {
                    valor_mes = tablaHistoricoCifras.getValorMes(mes_consu);
                    valor_acumulado = tablaHistoricoCifras.getValorAcumulado(mes_consu);
                }
                else {
                    valor_mes = 0.0;
                    valor_acumulado = 0.0;
                }

                await tablaHistoricoCifras.getByPrimaryIndex(anno_consu, ref_hoja, ref_linea).then(stati => {

                    if (stati == true) {
                        valor_mes_ref = tablaHistoricoCifras.getValorMes(mes_consu);
                        valor_acumulado_ref = tablaHistoricoCifras.getValorAcumulado(mes_consu);
                    }
                    else {
                        valor_mes_ref = 0.0;
                        valor_acumulado_ref = 0.0;
                    }

                });
            });

            await tablaHistoricoCifras.getByPrimaryIndex(anno_consu - 1, hoja, linea).then(async stati => {

                if (stati == true) {
                    anterior_acumulado = tablaHistoricoCifras.getValorAcumulado(mes_consu);
                }
                else {
                    anterior_acumulado = 0.0;
                }

                await tablaHistoricoCifras.getByPrimaryIndex(anno_consu - 1, ref_hoja, ref_linea).then(stati => {

                    if (stati == true) {
                        anterior_acumulado_ref = tablaHistoricoCifras.getValorAcumulado(mes_consu);
                    }
                    else {
                        anterior_acumulado_ref = 0.0;
                    }

                });
            });

            if (sumable == false) {

                if (tipo_acumulado == tabla_lineas.TablaLineas.ACUMULADO_DATO_EXTRA) {

                    await tablaHistoricoCifrasExtras.getByPrimaryIndex(anno_consu, hoja, linea).then(async stati => {

                        if (stati == true) {
                            valor_acumulado = tablaHistoricoCifrasExtras.getValorMes(mes_consu);
                        }
                        else {
                            valor_acumulado = 0.0;
                        }

                    });

                    await tablaHistoricoCifrasExtras.getByPrimaryIndex(anno_consu, ref_hoja, ref_linea).then(stati => {

                        if (stati == true) {
                            valor_acumulado_ref = tablaHistoricoCifrasExtras.getValorMes(mes_consu);
                        }
                        else {
                            valor_acumulado_ref = 0.0;
                        }

                    });

                    await tablaHistoricoCifrasExtras.getByPrimaryIndex(anno_consu - 1, hoja, linea).then(async stati => {

                        if (stati == true) {
                            anterior_acumulado = tablaHistoricoCifrasExtras.getValorMes(mes_consu);
                        }
                        else {
                            anterior_acumulado = 0.0;
                        }

                    });

                    await tablaHistoricoCifrasExtras.getByPrimaryIndex(anno_consu - 1, ref_hoja, ref_linea).then(stati => {

                        if (stati == true) {
                            anterior_acumulado_ref = tablaHistoricoCifrasExtras.getValorMes(mes_consu);
                        }
                        else {
                            anterior_acumulado_ref = 0.0;
                        }

                    });
                }

                if (tipo_acumulado == tabla_lineas.TablaLineas.ACUMULADO_MEDIA_ANUAL) {

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu, hoja, linea).then(async stati => {

                        if (stati == true) {
                            valor_acumulado = 0.0;
                            for (var i = 1; i <= mes_consu; i++) {
                                valor_acumulado += tablaHistoricoCifras.getValorMes(i);
                            }
                            valor_acumulado = valor_acumulado / mes_consu;
                        }
                        else {
                            valor_acumulado = 0.0;
                        }

                    });

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu, ref_hoja, ref_linea).then(async stati => {

                        if (stati == true) {
                            valor_acumulado_ref = 0.0;
                            for (var i = 1; i <= mes_consu; i++) {
                                valor_acumulado_ref += tablaHistoricoCifras.getValorMes(i);
                            }
                            valor_acumulado_ref = valor_acumulado_ref / mes_consu;
                        }
                        else {
                            valor_acumulado_ref = 0.0;
                        }

                    });

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu - 1, hoja, linea).then(async stati => {

                        if (stati == true) {
                            anterior_acumulado = 0.0;
                            for (var i = 1; i <= mes_consu; i++) {
                                anterior_acumulado += tablaHistoricoCifras.getValorMes(i);
                            }
                            anterior_acumulado = anterior_acumulado / mes_consu;
                        }
                        else {
                            anterior_acumulado = 0.0;
                        }

                    });

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu - 1, ref_hoja, ref_linea).then(async stati => {

                        if (stati == true) {
                            anterior_acumulado_ref = 0.0;
                            for (var i = 1; i <= mes_consu; i++) {
                                anterior_acumulado_ref += tablaHistoricoCifras.getValorMes(i);
                            }
                            anterior_acumulado_ref = anterior_acumulado_ref / mes_consu;
                        }
                        else {
                            anterior_acumulado_ref = 0.0;
                        }

                    });
                }

                if (tipo_acumulado == tabla_lineas.TablaLineas.ACUMULADO_MEDIA_12_MESES) {

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu, hoja, linea).then(async stati => {

                        if (stati == true) {

                            valor_acumulado = 0.0;
                            for (var i = 1; i <= mes_consu; i++) {
                                valor_acumulado += tablaHistoricoCifras.getValorMes(i);
                            }

                        }
                        else {
                            valor_acumulado = 0.0;
                        }

                    });

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu - 1, hoja, linea).then(async stati => {

                        if (stati == true) {
                            for (var i = mes_consu + 1; i <= 12; i++) {
                                valor_acumulado += tablaHistoricoCifras.getValorMes(i);
                            }
                            valor_acumulado = valor_acumulado / 12;
                        }
                        else {
                            valor_acumulado = 0.0;
                        }

                    });

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu, ref_hoja, ref_linea).then(async stati => {

                        if (stati == true) {
                            valor_acumulado_ref = 0.0;
                            for (var i = 1; i <= mes_consu; i++) {
                                valor_acumulado_ref += tablaHistoricoCifras.getValorMes(i);
                            }
                        }
                        else {
                            valor_acumulado_ref = 0.0;
                        }

                    });

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu - 1, ref_hoja, ref_linea).then(async stati => {

                        if (stati == true) {
                            for (var i = mes_consu + 1; i <= 12; i++) {
                                valor_acumulado_ref += tablaHistoricoCifras.getValorMes(i);
                            }
                            valor_acumulado_ref = valor_acumulado_ref / 12;
                        }
                        else {
                            valor_acumulado_ref = 0.0;
                        }
                    });

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu - 1, hoja, linea).then(async stati => {

                        if (stati == true) {
                            anterior_acumulado = 0.0;
                            for (var i = 1; i <= mes_consu; i++) {
                                anterior_acumulado += tablaHistoricoCifras.getValorMes(i);
                            }
                        }
                        else {
                            anterior_acumulado = 0.0;
                        }

                    });

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu - 2, hoja, linea).then(async stati => {

                        if (stati == true) {
                            for (var i = mes_consu + 1; i <= 12; i++) {
                                anterior_acumulado += tablaHistoricoCifras.getValorMes(i);
                            }
                            anterior_acumulado = anterior_acumulado / 12;
                        }
                        else {
                            anterior_acumulado = 0.0;
                        }

                    });

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu - 1, ref_hoja, ref_linea).then(async stati => {

                        if (stati == true) {
                            anterior_acumulado_ref = 0.0;
                            for (var i = 1; i <= mes_consu; i++) {
                                anterior_acumulado_ref += tablaHistoricoCifras.getValorMes(i);
                            }
                        }
                        else {
                            anterior_acumulado_ref = 0.0;
                        }

                    });

                    await tablaHistoricoCifras.getByPrimaryIndex(anno_consu - 2, ref_hoja, ref_linea).then(async stati => {

                        if (stati == true) {
                            for (var i = mes_consu + 1; i <= 12; i++) {
                                anterior_acumulado_ref += tablaHistoricoCifras.getValorMes(i);
                            }
                            anterior_acumulado_ref = valor_acumulado_ref / 12;
                        }
                        else {
                            anterior_acumulado_ref = 0.0;
                        }
                    });

                }

            }

            await tablaHistoricoPresupuesto.getByPrimaryIndex(anno_consu, hoja, linea).then(async stati => {

                if (stati == true) {
                    ppto_acumulado = tablaHistoricoPresupuesto.getValorAcumulado(mes_consu);
                }
                else {
                    ppto_acumulado = 0.0;
                }

                await tablaHistoricoPresupuesto.getByPrimaryIndex(anno_consu, ref_hoja, ref_linea).then(stati => {

                    if (stati == true) {
                        ppto_acumulado_ref = tablaHistoricoPresupuesto.getValorAcumulado(mes_consu);
                    }
                    else {
                        ppto_acumulado_ref = 0.0;
                    }

                });
            });

            var porcenmes = rutinas.treu_div(valor_mes, Math.abs(valor_mes_ref)) * 100;
            var porcenacu = rutinas.treu_div(valor_acumulado, Math.abs(valor_acumulado_ref)) * 100;
            var porcenppto = rutinas.treu_div(ppto_acumulado, Math.abs(ppto_acumulado_ref)) * 100;
            var porcenante = rutinas.treu_div(anterior_acumulado, Math.abs(anterior_acumulado_ref)) * 100;

            if (con_porcentaje == false) {
                porcenmes = 0.0;
                porcenacu = 0.0;
                porcenppto = 0.0;
                porcenante = 0.0;
            }

            var colo;
            if (intensa == true) colo = 'blue'; else colo = 'black';
            if (invisible == false) {
                conten += '<div style="color: ' + colo + ';">';
                if (intensa == true) conten += '<b>';
                if (con_decimales == true) {
                    conten += "&nbsp;&nbsp;" + formato.form('###', linea, "H") + "&nbsp;&nbsp;" + rutinas.acoplarseriehtml(titulo, 30);
                    conten += "&nbsp;" + formato.form('###.###.###,##', valor_mes, "HBD") + "&nbsp;" + formato.form('###,##', porcenmes, "HBD");
                    conten += "&nbsp;" + formato.form('###.###.###,##', anterior_acumulado, "HBD") + "&nbsp;" + formato.form('###,##', porcenante, "HBD");
                    conten += "&nbsp;" + formato.form('###.###.###,##', valor_acumulado, "HBD") + "&nbsp;" + formato.form('###,##', porcenacu, "HBD");
                    conten += "&nbsp;" + formato.form('###.###.###,##', ppto_acumulado, "HBD") + "&nbsp;" + formato.form('###,##', porcenppto, "HBD");
                    conten += "<br>";
                }
                else {
                    conten += "&nbsp;&nbsp;" + formato.form('###', linea, "H") + "&nbsp;&nbsp;" + rutinas.acoplarseriehtml(titulo, 30);
                    conten += "&nbsp;" + formato.form('##.###.###.###', valor_mes, "HBD") + "&nbsp;" + formato.form('###,##', porcenmes, "HBD");
                    conten += "&nbsp;" + formato.form('##.###.###.###', anterior_acumulado, "HBD") + "&nbsp;" + formato.form('###,##', porcenante, "HBD");
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
