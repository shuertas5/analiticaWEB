// --------------------------------------------------------------
// Servidor: Mantenimiento detalle Hojas Analiticas
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const tabla_tipos_hojas = require('../tablas/tabla_tipos_hojas.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const rutinas = require('../treu/rutinas_server.js');
const { response } = require('express');

/* GET home page. */
router.get('/manten_hojas_detalle', function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var hoja = search_params.get('hoja');
    var titulo;
    var hoja_externa;
    var tipo_hoja;
    var invisible;
    var linea_resultado;
    var linea_facturacion;

    if (opcion != null && opcion != undefined) {

        const acceso = require("./procedimientos_varios")

        var db = acceso.accesoDB(req.session.empresa);

        var tablaHojas = new tabla_hojas.TablaHojas(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        var stat;
        async function prim() {
            if (opcion != 'alta') {
                stat = await tablaHojas.getByPrimaryIndex(hoja);
            }
        }

        prim().then(async response => {

            if (stat == true) {
                titulo = tablaHojas.getTitulo();
                hoja_externa = tablaHojas.getHojaExterna();
                tipo_hoja = tablaHojas.getTipoHoja();
                invisible = tablaHojas.getInvisible();
                linea_resultado = tablaHojas.getLineaResultado();
                linea_facturacion = tablaHojas.getLineaFacturacion();
                campos = { hoja, titulo, hoja_externa, tipo_hoja, invisible, linea_resultado, linea_facturacion };
            }

            const fichero = "./frontend/static/css/index.css";

            var titulo_boton;
            var color_boton;

            if (opcion == 'alta') {
                disabled_clave = false;
                disabled_campos = false;
                hoja = 0;
                titulo = "";
                hoja_externa = "";
                tipo_hoja = "";
                invisible = false;
                linea_resultado = 0;
                linea_facturacion = 0;
                campos = { hoja, titulo, hoja_externa, tipo_hoja, invisible, linea_resultado, linea_facturacion };
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
            fs.readFile('./views/manten_hojas_detalle.pug', async function read(err, data) {
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
                res.send(pug.render(content, { dis_campos, titulo_boton, color_boton, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
            });
        });
    }
});

router.post('/manten_hojas_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaTiposHojas = new tabla_tipos_hojas.TablaTiposHojas(db);

    var opcion = req.body.opcion;
    var hoja = req.body.NUM_HOJA;
    var titulo = req.body.TITULO_HOJA;
    var hoja_externa = req.body.HOJA_EXTERNA;
    var tipo_hoja = req.body.TIPO_HOJA;
    var invisible = req.body.INVISIBLE;
    var linea_resultado = req.body.LINEA_RESULTADO;
    var linea_facturacion = req.body.LINEA_FACTURACION;

    if (invisible == undefined) {
        invisible = false;
    }
    else {
        invisible = true;
    }

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    if (opcion == 'alta') {

        var stat;
        async function prim() {
            stat = await tablaHojas.getByPrimaryIndex(hoja);
        }

        prim().then(async response => {

            if (stat == true) {

                descri_error += "-- Clave de Numero de Hoja Ya Existe\r\n";
                errores = true;

            }

            var stat2;
            async function prim2() {
                stat2 = await tablaTiposHojas.getByPrimaryIndex(tipo_hoja);
            }

            prim2().then(async response => {

                if (stat2 == false) {

                    descri_error += "-- Clave de Tipo de Hoja No Existe\r\n";
                    errores = true;

                }

                if (hoja == 0) {

                    descri_error += "-- Numero de Hoja = 0 No Valida\r\n";
                    errores = true;
    
                }
    
                var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
                fs.writeSync(fiche, descri_error, 0);
                fs.closeSync(fiche);

                if (errores == false) {

                    if (hoja !== 0) {
                        tablaHojas.registroBlanco();
                        tablaHojas.setHoja(hoja);
                        tablaHojas.setTitulo(titulo);
                        tablaHojas.setHojaExterna(hoja_externa);
                        tablaHojas.setTipoHoja(tipo_hoja);
                        tablaHojas.setInvisible(invisible);
                        tablaHojas.setLineaResultado(linea_resultado);
                        tablaHojas.setLineaFacturacion(linea_facturacion);
                        tablaHojas.insertRow();
                    }
                }

                res.send('');

            });

        });

    }

    if (opcion == 'modificacion') {

        var stat;
        async function prim2() {
            stat = await tablaTiposHojas.getByPrimaryIndex(tipo_hoja);
        }

        prim2().then(async response => {

            if (stat == false) {

                descri_error += "-- Clave de Tipo de Hoja No Existe\r\n";
                errores = true;

            }

            var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
            fs.writeSync(fiche, descri_error, 0);
            fs.closeSync(fiche);

            if (errores == false) {

                tablaHojas.registroBlanco();
                tablaHojas.setTitulo(titulo);
                tablaHojas.setHojaExterna(hoja_externa);
                tablaHojas.setTipoHoja(tipo_hoja);
                tablaHojas.setInvisible(invisible);
                tablaHojas.setLineaResultado(linea_resultado);
                tablaHojas.setLineaFacturacion(linea_facturacion);
                tablaHojas.updateRow(hoja);

            }

            res.send('');
        })
    }

    if (opcion == 'baja') {

        tablaHojas.deleteByPrimaryIndex(hoja);

        res.send('');

    }

});

module.exports = router;
