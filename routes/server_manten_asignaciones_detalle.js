var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const tabla_asignaciones = require('../tablas/tabla_asignaciones');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_hojas = require('../tablas/tabla_hojas');
const tabla_lineas = require('../tablas/tabla_lineas');
const rutinas = require('../treu/rutinas_server.js');
const TablaSQL = require('../tablas/TablaSQL');
const impresion = require('../treu/treu_print_courier_pdf.js');
const formato = require('../treu/formato.js');
const fecha = require('../treu/forfecha.js');

router.get('/manten_asignaciones_detalle', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var ordenacion = search_params.get('ordenacion');
    var cuenta = search_params.get('cuenta');
    var subcuenta = search_params.get('subcuenta');
    var buscar_cuenta = search_params.get('buscar_cuenta');
    var hoja;
    var linea;

    if (opcion != null && opcion != undefined && opcion != 'imprimir') {

        const acceso = require("./procedimientos_varios")

        var db = acceso.accesoDB(req.session.empresa);

        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaAsignaciones = new tabla_asignaciones.TablaAsignaciones(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        var stat;
        async function prim() {
            if (opcion != 'alta') {
                stat = await tablaAsignaciones.getByPrimaryIndex(cuenta, subcuenta);
            }
        }

        prim().then(async response => {

            if (stat == true) {
                titulo = tablaAsignaciones.getTitulo();
                hoja = tablaAsignaciones.getHoja();
                linea = tablaAsignaciones.getLinea();
                campos = { cuenta, subcuenta, hoja, linea, titulo };
            }

            const fichero = "./frontend/static/css/index.css";

            var titulo_boton;
            var color_boton;
            var titulo_tipo;

            if (opcion == 'alta') {
                disabled_clave = false;
                disabled_campos = false;
                cuenta = "";
                subcuenta = "";
                titulo = "";
                hoja = 0;
                linea = 0;
                campos = { cuenta, subcuenta, hoja, linea, titulo };
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
            fs.readFile('./views/manten_asignaciones_detalle.pug', async function read(err, data) {
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
                res.send(pug.render(content, { ordenacion, buscar_cuenta, titulo_boton, color_boton, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
            });
        });
    }

});

function cabecera(imp, titbas, hoja) {

    //fecha = date_format(date_create(_SESSION['jornada']), "d/m/Y");

    var fechax = new Date();

    imp.print(" " + rutinas.acoplarserie(titbas, 35) + " - ASIGNACIONES CUENTAS - " + rutinas.repcar(' ', 12));
    imp.print(fecha.forfecha("B", fechax, ""));
    imp.printre(' ', 4);
    imp.print(rutinas.repcar(' ', 4) + "Pag: ");
    imp.print(formato.form("##", hoja, "t"));
    imp.linea();

    imp.print(rutinas.repcar('-', 98));
    imp.linea();

    imp.print(" CUENTA ------------- SUBCUENTA  TITULO ----------------------- HOJA / LINEA TITULO LINEA ------- ");
    imp.linea();

    imp.print(rutinas.repcar('-', 98));
    imp.linea();
    imp.linea();

}

router.post('/manten_asignaciones_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaAsignaciones = new tabla_asignaciones.TablaAsignaciones(db);
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);

    var opcion = req.body.opcion;

    if (opcion != 'imprimir') {
        var ordenacion = req.body.ordenacion;
        var buscar_cuenta = req.body.buscar_cuenta;
        var cuenta = req.body.CUENTA;
        var subcuenta = req.body.SUBCUENTA;
        var titulo = req.body.TITULO_CUENTA;
        var hoja = req.body.HOJA;
        var linea = req.body.LINEA;
    }

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    var permite_subcta_vacia;

    if (opcion == 'alta') {

        var stat0;
        async function prim0() {
            stat0 = await tablaAsignaciones.getByPrimaryIndex(cuenta, subcuenta);
        }

        var stat;
        async function prim() {
            stat = await tablaLineas.getByPrimaryIndex(hoja, linea);
        }

        await prim0().then(async respon => {

            if (stat0 == true) {

                descri_error += "-- Numero de Cuenta/SubCuenta ya tiene Asignacion\r\n";
                errores = true;

            }
        });

        await prim().then(async response => {

            if (stat == false) {

                descri_error += "-- Numero de Linea No Existe\r\n";
                errores = true;

            }

            if (cuenta == "") {

                descri_error += "-- Cuenta en Blanco. No Válida\r\n";
                errores = true;
            
            }

            var stat2;
            async function prim2() {
                stat2 = await tablaParametrosApp.getByPrimaryIndex();
            }

            prim2().then(async response => {

                permite_subcta_vacia = tablaParametrosApp.getAdmiteSubctaVacia();

                if (permite_subcta_vacia == false && subcuenta == '') {
                    descri_error += "-- La Subcuenta no puede ser Blanca\r\n";
                    errores = true;
                }

                var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
                fs.writeSync(fiche, descri_error, 0);
                fs.closeSync(fiche);

                if (errores == false) {

                    tablaAsignaciones.registroBlanco();
                    tablaAsignaciones.setCuenta(cuenta);
                    tablaAsignaciones.setSubCuenta(subcuenta);
                    tablaAsignaciones.setTitulo(titulo);
                    tablaAsignaciones.setHoja(hoja);
                    tablaAsignaciones.setLinea(linea);
                    tablaAsignaciones.insertRow();

                }
            });

            res.send('');

        });

    }

    if (opcion == 'modificacion') {

        var stat;
        async function prim() {
            stat = await tablaLineas.getByPrimaryIndex(hoja, linea);
        }

        prim().then(async response => {

            if (stat == false) {

                descri_error += "-- Numero de Linea No Existe\r\n";
                errores = true;

            }

            var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
            fs.writeSync(fiche, descri_error, 0);
            fs.closeSync(fiche);

            if (errores == false) {

                tablaAsignaciones.registroBlanco();
                tablaAsignaciones.setTitulo(titulo);
                tablaAsignaciones.setHoja(hoja);
                tablaAsignaciones.setLinea(linea);
                tablaAsignaciones.updateRow(cuenta, subcuenta);

            }
        });

        res.send('');
    }

    if (opcion == 'baja') {

        tablaAsignaciones.deleteByPrimaryIndex(cuenta, subcuenta);
        res.send('');

    }

    if (opcion == 'imprimir') {

        var hoja;
        var ordenacion;

        var cuenta;
        var subcuenta;
        var hoja_cuen;
        var linea_cuen;
        var titulo;

        var titulo_linea;

        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaAsignaciones = new tabla_asignaciones.TablaAsignaciones(db);
        var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);

        const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
        const search_params = current_url.searchParams;

        var vector_texto = req.body.data;
        var vector_datos_impresora = req.body.data_impre;

        //var vector_texto = search_params.get('data');
        //var vector_datos_impresora = search_params.get('data_impre');

        //var vector_texto = $_POST['data'];
        //var vector_datos_impresora = $_POST['data_impre'];

        var ordenacion = rutinas.leer_lista_campos(vector_texto, 'ordenacion');

        await tablaParametrosApp.getByPrimaryIndex().then(stat => {
            if (stat == true) {
                nombre_empresa = tablaParametrosApp.getTituloEmpresa();
            }
            else {
                nombre_empresa = "";
            }
        })

        var stat;
        async function primx() {
            await tablaAsignaciones.open();
        }

        tablaAsignaciones.addFirstCuenta(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
        if (ordenacion == '1') {
            tablaAsignaciones.setOrdenBy('CUENTA,SUBCUENTA');
        }
        else {
            tablaAsignaciones.setOrdenBy('HOJA,LINEA');
        }

        var antecuenta="";
        var antesubcuenta="";
        var antelinea=0;
        var antehoja=0;

        primx().then(async response => {

            var imp = new impresion.Treu_print_courier_pdf();

            imp.resetcondi();
            imp.setOrientacion("V");
            imp.setSizeFont(9);

            var aper = imp.aperturaSilenciosa2(vector_datos_impresora);

            if (aper == true) {

                hoja = 1;
                cabecera(imp, nombre_empresa, hoja);

                var stat2;

                stat2 = tablaAsignaciones.getFirst();

                while (stat2 == true) {

                    var hayspa = imp.hayespacio(2);

                    if (hayspa != true) {
                        hoja++;
                        imp.hoja();
                        cabecera(imp, nombre_empresa, hoja);
                    }

                    hoja_cuen = tablaAsignaciones.getHoja();
                    linea_cuen = tablaAsignaciones.getLinea();
                    cuenta = tablaAsignaciones.getCuenta();
                    subcuenta = tablaAsignaciones.getSubCuenta();
                    titulo = tablaAsignaciones.getTitulo();

                    await tablaLineas.getByPrimaryIndex(hoja_cuen, linea_cuen).then(st => {
                        if (st == true) {
                            titulo_linea = tablaLineas.getTitulo();
                        }
                        else {
                            titulo_linea = "";
                        }
                    })

                    if (ordenacion=='1') {
                        if (antecuenta!='') {
                            if (cuenta!=antecuenta) {
                                imp.linea();
                            }
                        }
                    }
                    
                    if (ordenacion=='2') {
                        if (antehoja!=0) {
                            if (hoja_cuen!=antehoja || linea_cuen!=antelinea) {
                                imp.linea();
                            }
                        }
                    }

                    antecuenta=cuenta;
                    antesubcuenta = subcuenta;
                    antehoja = hoja_cuen;
                    antelinea= linea_cuen;

                    // Imprimimos la Linea

                    imp.printre(' ', 1);
                    imp.print(rutinas.acoplarserie(cuenta, 20));
                    imp.printre(' ', 1);
                    imp.print(rutinas.acoplarserie(subcuenta, 10));
                    imp.printre(' ', 1);
                    imp.print(rutinas.acoplarserie(titulo, 30));
                    imp.printre(' ', 2);
                    imp.print(formato.form('##', hoja_cuen, '0'));
                    imp.print('  /  ');
                    imp.print(formato.form('###', linea_cuen, '0'));
                    imp.printre(' ', 2);
                    imp.print(rutinas.acoplarserie(titulo_linea, 20));
                    imp.linea();

                    stat2 = tablaAsignaciones.getNext();
                }
            }

            imp.cierre();

            res.send('');

        });

    }

});

module.exports = router;
