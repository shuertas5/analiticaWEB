// --------------------------------------------------------------
// Servidor: Sumar Movimientos del Diario
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_diario_fichero = require('../tablas/tabla_diario_fichero.js');
const tabla_origenes_diario = require('../tablas/tabla_origenes_diario.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');

/* GET home page. */
router.get('/sumar_movimientos_diario', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    const saltar = search_params.get('saltar');

    if (saltar == 'true') {
        res.send('');
        return;
    }

    var rows = [];

    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Sumar Diario";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

    var content;
    fs.readFile('./views/sumar_movimientos_diario.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { color_boton, titulo_boton, rows: rows }));
    });

});

router.post('/sumar_movimientos_diario', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var stat;
    var origenes = [];
    var titu_origenes = [];
    var sum_origenes = [];
    var debe_origenes = [];
    var haber_origenes = [];

    var temporal = "temporal";
    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var tablaDiarioFichero = new tabla_diario_fichero.TablaDiarioFichero(db);
    var tablaOrigenesDiario = new tabla_origenes_diario.TablaOrigenesDiario(db);

    tablaOrigenesDiario.addFirstClaveOrigen(TablaSQL.TablaSQL.BTR_NOT_EQ, '');
    tablaOrigenesDiario.setOrdenBy("CLAVE_ORIGEN");

    await tablaOrigenesDiario.open().then(async ret => {

        stat = tablaOrigenesDiario.getFirst();

        while (stat == true) {

            origenes.push(tablaOrigenesDiario.getClaveOrigen());
            titu_origenes.push(tablaOrigenesDiario.getTitulo());

            sum_origenes.push(0);
            debe_origenes.push(0);
            haber_origenes.push(0);

            stat = tablaOrigenesDiario.getNext();
        }

        var sum_otros = 0;
        var debe_otros = 0;
        var haber_otros = 0;

        var origen;
        var importe;
        var signo;

        tablaDiarioFichero.addFirstSecuencia(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        tablaDiarioFichero.setOrdenBy('SECUENCIA');

        await tablaDiarioFichero.open().then(reti => {

            stat = tablaDiarioFichero.getFirst();

            while (stat == true) {

                origen = tablaDiarioFichero.getOrigen();
                importe = tablaDiarioFichero.getImporte();
                signo = tablaDiarioFichero.getSigno();

                var encon = false;
                for (var i = 0; i < origenes.length; i++) {

                    if (origenes[i] == origen) {
                        encon = true;
                        sum_origenes[i] += 1;
                        if (signo == "D") {
                            debe_origenes[i] += importe;
                        }
                        else {
                            haber_origenes[i] += importe;
                        }
                        break;
                    }
                }

                if (encon == false) {
                    sum_otros += 1;
                    if (signo == "D") {
                        debe_otros += importe;
                    }
                    else {
                        haber_otros += importe;
                    }
                }

                stat = tablaDiarioFichero.getNext();
            }

            // Grabamos el fichero de retorno.txt

            var retorno = "temporal";
            var conten = "";

            var fiche = fs.openSync("./" + retorno + "/retorno.html", "w");
            var titu_ori;

            conten += "<p>";
            var nn = 0;

            for (var i = 0; i < origenes.length; i++) {

                nn++;

                conten += "<br>Origen: <b>" + titu_origenes[i] + "</b><br>";
                conten += "&nbsp;&nbsp;&nbsp;Num. Mov.&nbsp;&nbsp;= " + formato.form('###.###', sum_origenes[i], "H") + "<br>";
                conten += "&nbsp;&nbsp;&nbsp;Suma Debe&nbsp;&nbsp;= " + formato.form('###.###.###,##', debe_origenes[i], "H") + "&nbsp;D<br>";
                conten += "&nbsp;&nbsp;&nbsp;Suma Haber = " + formato.form('###.###.###,##', haber_origenes[i], "H") + "&nbsp;H<br>";
                conten += rutinas.repcarhtml('&nbsp;', 3) + rutinas.repcarhtml('-', 30) + "<br>";
                conten += "&nbsp;&nbsp;&nbsp;Suma Saldo = " + formato.form('###.###.###,##', Math.abs(debe_origenes[i] - haber_origenes[i]), "H") + "&nbsp;";
                if (debe_origenes[i] >= haber_origenes[i]) {
                    conten += 'D<br>';
                }
                else {
                    conten += 'H<br>';
                }
            }

            if (sum_otros > 0) {
                nn++;
                conten += "<br>Origen: <b>Otros Origenes</b><br>";
                conten += "&nbsp;&nbsp;&nbsp;Num. Mov.&nbsp;&nbsp;= " + formato.form('###.###', sum_otros, "H") + "<br>";
                conten += "&nbsp;&nbsp;&nbsp;Suma Debe&nbsp;&nbsp;= " + formato.form('###.###.###,##', debe_otros, "H") + "&nbsp;D<br>";
                conten += "&nbsp;&nbsp;&nbsp;Suma Haber = " + formato.form('###.###.###,##', haber_otros, "H") + "&nbsp;H<br>";
                conten += rutinas.repcarhtml('&nbsp;', 3) + rutinas.repcarhtml('-', 30) + "<br>";
                conten += "&nbsp;&nbsp;&nbsp;Suma Saldo = " + formato.form('###.###.###,##', Math.abs(debe_otros - haber_otros), "H") + "&nbsp;";
                if (debe_otros >= haber_otros) {
                    conten += 'D<br>';
                }
                else {
                    conten += 'H<br>';
                }
            }

            var sum_total = 0;
            var debe_total = 0;
            var haber_total = 0;

            for (var i = 0; i < origenes.length; i++) {
                sum_total += sum_origenes[i];
                debe_total += debe_origenes[i];
                haber_total += haber_origenes[i];
            }

            sum_total += sum_otros;
            debe_total += debe_otros;
            haber_total += haber_otros;

            if (nn > 1) {
                conten += "<br><b>Totales Suma Origenes</b><br>";
                conten += "&nbsp;&nbsp;&nbsp;Num. Mov.&nbsp;&nbsp;= " + formato.form('###.###', sum_total, "H") + "<br>";
                conten += "&nbsp;&nbsp;&nbsp;Suma Debe&nbsp;&nbsp;= " + formato.form('###.###.###,##', debe_total, "H") + "&nbsp;D<br>";
                conten += "&nbsp;&nbsp;&nbsp;Suma Haber = " + formato.form('###.###.###,##', haber_total, "H") + "&nbsp;H<br>";
                conten += rutinas.repcarhtml('&nbsp;', 3) + rutinas.repcarhtml('-', 30) + "<br>";
                conten += "&nbsp;&nbsp;&nbsp;Suma Saldo = " + formato.form('###.###.###,##', Math.abs(debe_total - haber_total), "H") + "&nbsp;";
                if (debe_total >= haber_total) {
                    conten += 'D<br>';
                }
                else {
                    conten += 'H<br>';
                }
            }

            conten += "</p>";

            fs.writeSync(fiche, conten, 0);
            fs.closeSync(fiche);

            res.send('');

        });
    });

});

module.exports = router;
