// --------------------------------------------------------------
// Servidor: Mantenimiento detalle de Notas del Presupuesto
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_notas_ppto = require('../tablas/tabla_notas_ppto.js');
const rutinas = require('../treu/rutinas_server.js');

router.get('/manten_notas_ppto_detalle', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var hoja = search_params.get('hoja');
    var linea = search_params.get('linea');
    var nota;

    var titulo_hoja;
    var titulo_linea;

    if (opcion != null && opcion != undefined) {

        const acceso = require("./procedimientos_varios")

        var db = acceso.accesoDB(req.session.empresa);

        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaNotasPresupuesto = new tabla_notas_ppto.TablaNotasPresupuesto(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        await tablaHojas.getByPrimaryIndex(hoja).then(stat2 => {
            if (stat2 == true) {
                titulo_hoja = tablaHojas.getTitulo();
            }
            else {
                titulo_hoja = "";
            }
        }).then(reponse => {

            var stat;
            async function prim() {
                if (opcion != 'alta') {
                    stat = await tablaNotasPresupuesto.getByPrimaryIndex(hoja, linea);
                }
            }

            prim().then(async response => {

                if (stat == true) {

                    nota = tablaNotasPresupuesto.getNota();
                    campos = { hoja, linea, nota };
                }

                const fichero = "./frontend/static/css/index.css";

                var titulo_boton;
                var color_boton;

                if (opcion == 'alta') {
                    disabled_clave = false;
                    disabled_campos = false;
                    linea = 0;
                    nota = "";
                    campos = { hoja, linea, nota };
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

                var content;
                fs.readFile('./views/manten_notas_ppto_detalle.pug', async function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    var dis_campos;
                    if (disabled_campos == true) {
                        dis_campos = 'disabled';
                    }
                    else {
                        dis_campos = '';
                    }
                    content = data;
                    res.send(pug.render(content, { hoja, titulo_hoja, dis_campos, titulo_boton, color_boton, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
                });
            });

        });
    }
});

router.post('/manten_notas_ppto_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaNotasPresupuesto = new tabla_notas_ppto.TablaNotasPresupuesto(db);

    var opcion = req.body.opcion;
    var hoja = req.body.HOJA;
    var linea = req.body.LINEA;
    var nota = req.body.NOTA;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    if (opcion == 'alta') {

        var stat;
        async function prim() {
            stat = await tablaNotasPresupuesto.getByPrimaryIndex(hoja, linea);
        }

        prim().then(async response => {

            if (stat == true) {

                descri_error += "-- Numero de Nota de Hoja/Linea Ya existe\r\n";
                errores = true;

            }

            if (linea == 0) {

                descri_error += "-- Numero de Linea = 0 No Valida\r\n";
                errores = true;

            }

            await tablaLineas.getByPrimaryIndex(hoja, linea).then(st => {
                if (st == false) {
                    descri_error += "-- Numero de Linea No Existe\r\n";
                    errores = true;
                }
            }).then(respon => {

                var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
                fs.writeSync(fiche, descri_error, 0);
                fs.closeSync(fiche);

                if (errores == false) {

                    if (linea !== 0) {
                        tablaNotasPresupuesto.registroBlanco();
                        tablaNotasPresupuesto.setHoja(hoja);
                        tablaNotasPresupuesto.setLinea(linea);
                        tablaNotasPresupuesto.setNota(nota);
                        tablaNotasPresupuesto.insertRow();
                    }
                }
            });

            res.send('');

        });

    }

    if (opcion == 'modificacion') {

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.closeSync(fiche);

        if (errores == false) {

            tablaNotasPresupuesto.registroBlanco();
            tablaNotasPresupuesto.setNota(nota);
            tablaNotasPresupuesto.updateRow(hoja, linea);

        }

        res.send('');
    }

    if (opcion == 'baja') {

        tablaNotasPresupuesto.deleteByPrimaryIndex(hoja, linea);

        res.send('');

    }

});

module.exports = router;
