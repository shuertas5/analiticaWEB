// --------------------------------------------------------------------------
// Servidor: Mantenimiento detalle de Totales de Lineas Analiticas
// --------------------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_totales = require('../tablas/tabla_totales.js');
const rutinas = require('../treu/rutinas_server.js');

router.get('/manten_totales_detalle', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var hoja = search_params.get('hoja');
    var linea = search_params.get('linea');
    var titulo_hoja;
    var titulo;
    var ref_hoja;
    var ref_linea;
    var titulo_hoja;
    var num_compo = 0;

    var rows = [];
    var rows_coef = [];
    var rows_hojas = [];
    var rows_lineas = [];
    var rows_mas_menos = [];

    const acceso = require("./procedimientos_varios");
    var db = acceso.accesoDB(req.session.empresa);

    const fichero = "./frontend/static/css/index.css";

    var titulo_boton;
    var color_boton;

    var tablaTotales = new tabla_totales.TablaTotales(db);
    var tablaHojas = new tabla_hojas.TablaHojas(db);

    if (opcion != null && opcion != undefined) {

        if (opcion == 'alta') {
            disabled_clave = false;
            disabled_campos = false;
            titulo_boton = "Grabar";
            color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");
        }

        if (opcion == 'consulta') {
            disabled_clave = true;
            disabled_campos = true;
            titulo_boton = "Grabar";
            color_boton = rutinas.getStyle(fichero, ".clase_boton_consulta");
        }

        if (opcion == 'modificacion') {
            disabled_clave = true;
            disabled_campos = false;
            titulo_boton = "Grabar";
            color_boton = rutinas.getStyle(fichero, ".clase_boton_modificacion");
        }

        if (opcion == 'baja') {
            disabled_clave = true;
            disabled_campos = true;
            titulo_boton = "Dar de Baja";
            color_boton = rutinas.getStyle(fichero, ".clase_boton_baja");
        }

        await tablaHojas.getByPrimaryIndex(hoja).then(stat2 => {
            if (stat2 == true) {
                titulo_hoja = tablaHojas.getTitulo();
            }
            else {
                titulo_hoja = "";
            }
        });

        await tablaTotales.getByPrimaryIndex(hoja, linea).then(stat => {

            if (stat == true) {
                num_compo = tablaTotales.getNumComponentes();
                rows_coef = tablaTotales.getCoeficientes();
                rows_hojas = tablaTotales.getHojasComponentes();
                rows_lineas = tablaTotales.getLineasComponentes();
                rows_mas_menos = tablaTotales.getMasComponentes();
                for (var i = 1; i <= num_compo; i++) {
                    var obj = new Object();
                    obj.coef = rows_coef[i - 1];
                    obj.hojas = rows_hojas[i - 1];
                    obj.lineas = rows_lineas[i - 1];
                    obj.mas_menos = rows_mas_menos[i - 1];
                    rows.push(obj);
                }
            }
            else {
                num_compo = 0;
                rows = [];
            }

        });

        var content;
        fs.readFile('./views/manten_totales_detalle.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { opcion, disabled_campos, disabled_clave, titulo_boton, color_boton, hoja, titulo_hoja, linea, num_compo, rows: rows }));
        });
    }
});

router.post('/manten_totales_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaTotales = new tabla_totales.TablaTotales(db);

    var coeficientes = [];
    var mas_menos = [];
    var hojax = [];
    var lineax = [];
    var borrar = [];

    var borr;

    var opcion = req.body.opcion;
    var num_compo = req.body.num_compo;
    var hoja = req.body.hoja;
    var linea = req.body.linea;

    for (var i = 1; i <= num_compo; i++) {
        var masca = "COEF" + i;
        coeficientes.push(req.body[masca]);
        masca = "MAS_MENOS" + i;
        mas_menos.push(req.body[masca]);
        masca = "HOJA" + i;
        hojax.push(req.body[masca]);
        masca = "LINEA" + i;
        lineax.push(req.body[masca]);
        masca = "BORRAR" + i;
        if (req.body[masca] == undefined) {
            borr = false;
        }
        else {
            borr = true;
        }
        borrar.push(borr);
    }

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    if (opcion == 'alta') {

        var stat;
        async function prim() {
            stat = await tablaLineas.getByPrimaryIndex(hoja, linea);
        }

        prim().then(async response => {

            if (stat == false) {

                descri_error += "-- Numero de Linea No Existe en la Hoja\r\n";
                errores = true;

            }
            else {

                var de_totales = tablaLineas.getDeTotales();

                if (de_totales == false) {
                    descri_error += "-- Numero de Linea No es de Totales.\r\n";
                    errores = true;
                }
            }

            for (var s = 0; s < num_compo; s++) {
                if (borrar[s] == false) {
                    await tablaLineas.getByPrimaryIndex(hojax[s], lineax[s]).then(stat3 => {
                        if (stat3 == false) {
                            descri_error += "-- Numero de Hoja/Linea: " + hojax[s] + " / " + lineax[s] + " No Existe.\r\n";
                            errores = true;
                        }
                    });
                }
            }

            var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
            fs.writeSync(fiche, descri_error, 0);
            fs.closeSync(fiche);

            if (errores == false) {

                var num_real = num_compo;
                for (var i = num_compo - 1; i >= 0; i--) {
                    if (borrar[i] == true) {
                        coeficientes.splice(i, 1);
                        mas_menos.splice(i, 1);
                        hojax.splice(i, 1);
                        lineax.splice(i, 1);
                        borrar.splice(i, 1);
                        num_real--;
                    }
                }

                if (linea !== 0) {
                    tablaTotales.registroBlanco();
                    tablaTotales.setHoja(hoja);
                    tablaTotales.setLinea(linea);
                    tablaTotales.setNumComponentes(num_real);
                    tablaTotales.setCoeficientes(num_real, coeficientes);
                    tablaTotales.setHojasComponentes(num_real, hojax);
                    tablaTotales.setLineasComponentes(num_real, lineax);
                    tablaTotales.setMasComponentes(num_real, mas_menos);
                    tablaTotales.insertRow();
                }
            }

            res.send('');

        });

    }

    if (opcion == 'modificacion') {

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.closeSync(fiche);

        var num_real = num_compo;
        for (var i = num_compo - 1; i >= 0; i--) {
            if (borrar[i] == true) {
                coeficientes.splice(i, 1);
                mas_menos.splice(i, 1);
                hojax.splice(i, 1);
                lineax.splice(i, 1);
                borrar.splice(i, 1);
                num_real--;
            }
        }

        for (var s = 0; s < num_compo; s++) {
            if (borrar[s] == false) {
                await tablaLineas.getByPrimaryIndex(hojax[s], lineax[s]).then(stat3 => {
                    if (stat3 == false) {
                        descri_error += "-- Numero de Hoja/Linea " + hojax[s] + " / " + lineax[s] + " No Existe.\r\n";
                        errores = true;
                    }
                })
            }
        }

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);

        if (errores == false) {

            tablaTotales.registroBlanco();
            tablaTotales.setHoja(hoja);
            tablaTotales.setLinea(linea);
            tablaTotales.setNumComponentes(num_real);
            tablaTotales.setCoeficientes(num_real, coeficientes);
            tablaTotales.setHojasComponentes(num_real, hojax);
            tablaTotales.setLineasComponentes(num_real, lineax);
            tablaTotales.setMasComponentes(num_real, mas_menos);
            tablaTotales.updateRow(hoja, linea);

        }

        res.send('');
    }

    if (opcion == 'baja') {

        tablaTotales.deleteByPrimaryIndex(hoja, linea);

        res.send('');

    }

});

module.exports = router;
