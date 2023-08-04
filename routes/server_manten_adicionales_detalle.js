var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const tabla_adicionales_costes = require('../tablas/tabla_adicionales_costes');
const tabla_adicionales_estadisticos = require('../tablas/tabla_adicionales_estadisticos');
const tabla_adicionales_correcciones = require('../tablas/tabla_adicionales_correcciones');
const tabla_acumulados_estadisticos = require('../tablas/tabla_acumulados_estadisticos');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_hojas = require('../tablas/tabla_hojas');
const tabla_lineas = require('../tablas/tabla_lineas');
const rutinas = require('../treu/rutinas_server.js');
const TablaSQL = require('../tablas/TablaSQL');
const impresion = require('../treu/treu_print_courier_pdf.js');
const formato = require('../treu/formato.js');
const fecha = require('../treu/forfecha.js');

router.get('/manten_adicionales_detalle', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var tipo_adicional = search_params.get('tipo_adicional');
    var ordenacion = search_params.get('ordenacion');
    var indice = search_params.get('indice');
    var titulo;
    var hoja;
    var linea;
    var blanca;
    var orden;

    if (tipo_adicional == 'costes') {
        color_titulo = 'red';
    }
    else if (tipo_adicional == 'estadisticos') {
        color_titulo = 'green';
    }
    else if (tipo_adicional == 'acum_estadisticos') {
        color_titulo = 'green';
    }
    else if (tipo_adicional == 'correcciones') {
        color_titulo = 'blue';
    }

    if (opcion != null && opcion != undefined && opcion != 'imprimir') {

        const acceso = require("./procedimientos_varios")

        var db = acceso.accesoDB(req.session.empresa);

        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaAdicionalesCostes = new tabla_adicionales_costes.TablaAdicionalesCostes(db);
        var tablaAdicionalesEstadisticos = new tabla_adicionales_estadisticos.TablaAdicionalesEstadisticos(db);
        var tablaAdicionalesCorrecciones = new tabla_adicionales_correcciones.TablaAdicionalesCorrecciones(db);
        var tablaAcumuladosEstadisticos = new tabla_acumulados_estadisticos.TablaAcumuladosEstadisticos(db);

        var campos = {};
        var disabled_clave = true;
        var disabled_campos = true;

        var stat;
        async function prim() {
            if (opcion != 'alta') {
                if (tipo_adicional == 'costes') {
                    stat = await tablaAdicionalesCostes.getByPrimaryIndex(indice);
                }
                else if (tipo_adicional == 'estadisticos') {
                    stat = await tablaAdicionalesEstadisticos.getByPrimaryIndex(indice);
                }
                else if (tipo_adicional == 'correcciones') {
                    stat = await tablaAdicionalesCorrecciones.getByPrimaryIndex(indice);
                }
                else if (tipo_adicional == 'acum_estadisticos') {
                    stat = await tablaAcumuladosEstadisticos.getByPrimaryIndex(indice);
                }
            }
        }

        prim().then(async response => {

            if (stat == true) {
                if (tipo_adicional == 'costes') {
                    titulo = tablaAdicionalesCostes.getTitulo();
                    hoja = tablaAdicionalesCostes.getHoja();
                    linea = tablaAdicionalesCostes.getLinea();
                    blanca = tablaAdicionalesCostes.getBlanca();
                    orden = tablaAdicionalesCostes.getOrden();
                }
                else if (tipo_adicional == 'estadisticos') {
                    titulo = tablaAdicionalesEstadisticos.getTitulo();
                    hoja = tablaAdicionalesEstadisticos.getHoja();
                    linea = tablaAdicionalesEstadisticos.getLinea();
                    blanca = tablaAdicionalesEstadisticos.getBlanca();
                    orden = tablaAdicionalesEstadisticos.getOrden();
                }
                else if (tipo_adicional == 'correcciones') {
                    titulo = tablaAdicionalesCorrecciones.getTitulo();
                    hoja = tablaAdicionalesCorrecciones.getHoja();
                    linea = tablaAdicionalesCorrecciones.getLinea();
                    blanca = tablaAdicionalesCorrecciones.getBlanca();
                    orden = tablaAdicionalesCorrecciones.getOrden();
                }
                else if (tipo_adicional == 'acum_estadisticos') {
                    titulo = tablaAcumuladosEstadisticos.getTitulo();
                    hoja = tablaAcumuladosEstadisticos.getHoja();
                    linea = tablaAcumuladosEstadisticos.getLinea();
                    blanca = tablaAcumuladosEstadisticos.getBlanca();
                    orden = tablaAcumuladosEstadisticos.getOrden();
                }
                campos = { indice, hoja, linea, titulo, blanca, orden };
            }

            const fichero = "./frontend/static/css/index.css";

            var titulo_boton;
            var color_boton;
            var titulo_tipo;

            if (opcion == 'alta') {
                disabled_clave = false;
                disabled_campos = false;
                indice = 0;
                titulo = "";
                hoja = 0;
                linea = 0;
                blanca = false;
                orden = "";
                campos = { indice, hoja, linea, titulo, blanca, orden };
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

            if (tipo_adicional == '') {
                titulo_tipo = '';
            }
            else if (tipo_adicional == 'costes') {
                titulo_tipo = ' Adicionales de Costes';
            }
            else if (tipo_adicional == 'estadisticos') {
                titulo_tipo = ' Adicionales Estadisticos';
            }
            else if (tipo_adicional == 'acum_estadisticos') {
                titulo_tipo = ' Acumulados Estadisticos';
            }
            else if (tipo_adicional == 'correcciones') {
                titulo_tipo = ' Adicionales de Corrección';
            }

            var content;
            fs.readFile('./views/manten_adicionales_detalle.pug', async function read(err, data) {
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
                res.send(pug.render(content, { tipo_adicional, ordenacion, titulo_tipo, color_titulo, titulo_boton, color_boton, opcion: opcion, disabled_clave: disabled_clave, disabled_campos: disabled_campos, campos: campos }));
            });
        });
    }

});

function cabecera(imp, titbas, tipo_adicional, hoja) {

    //fecha = date_format(date_create(_SESSION['jornada']), "d/m/Y");

    var fechax = new Date();

    imp.print(" " + rutinas.acoplarserie(titbas, 35) + " - ENTRADA DATOS ADICIONALES - " + rutinas.repcar(' ', 4));
    imp.print(fecha.forfecha("B", fechax, ""));
    imp.printre(' ', 4);
    imp.print(rutinas.repcar(' ', 4) + "Pag: ");
    imp.print(formato.form("##", hoja, "t"));
    imp.linea();

    imp.print(rutinas.repcar('-', 98));
    imp.linea();

    imp.print("    INDICE  HOJA / LINEA  TITULO ADICIONAL " + rutinas.repcar('-', 13));
    imp.print("  IMPORTE --------  ");
    imp.linea();

    imp.print(rutinas.repcar('-', 98));
    imp.linea();
    imp.linea();

    imp.print("  Tipo de Adicional: ");
    imp.setNegrita(true);
    imp.print(tipo_adicional);
    imp.setNegrita(false);
    imp.linea();
    imp.linea();

}

router.post('/manten_adicionales_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaAdicionalesCostes = new tabla_adicionales_costes.TablaAdicionalesCostes(db);
    var tablaAdicionalesEstadisticos = new tabla_adicionales_estadisticos.TablaAdicionalesEstadisticos(db);
    var tablaAdicionalesCorrecciones = new tabla_adicionales_correcciones.TablaAdicionalesCorrecciones(db);
    var tablaAcumuladosEstadisticos = new tabla_acumulados_estadisticos.TablaAcumuladosEstadisticos(db);
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);

    var opcion = req.body.opcion;

    if (opcion != 'imprimir') {
        var tipo_adicional = req.body.tipo_adicional;
        var ordenacion = req.body.ordenacion;
        var indice = req.body.INDICE;
        var orden = req.body.ORDEN;
        var titulo = req.body.TITULO_ADICIONAL;
        var hoja = req.body.HOJA;
        var linea = req.body.LINEA;
        var blanca = req.body.BLANCA;
    }

    if (blanca == undefined) {
        blanca = false;
    }
    else {
        blanca = true;
    }

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    var estadistica = false;
    var de_totales = false;
    var linea_blanca = false;
    var linea_sumable = false;
    var linea_novisible = false;

    var permite_en_novisible;

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

                estadistica = tablaLineas.getEstadistica();
                de_totales = tablaLineas.getDeTotales();
                linea_blanca = tablaLineas.getBlanca();
                linea_sumable = tablaLineas.getSumable();
                linea_novisible = tablaLineas.getInvisible();

            }

            var stat2;
            async function prim2() {
                stat2 = await tablaParametrosApp.getByPrimaryIndex();
            }

            prim2().then(async response => {

                permite_en_novisible = tablaParametrosApp.getCargosLineaNoVisible();

                if (tipo_adicional == 'costes') {

                    if (estadistica == true) {
                        descri_error += "-- Costes no pueden ir a lineas estadisticas\r\n";
                        errores = true;
                    }
                    if (linea_blanca == true) {
                        descri_error += "-- Costes no pueden ir a lineas blancas\r\n";
                        errores = true;
                    }
                    if (de_totales == true) {
                        descri_error += "-- Costes no pueden ir a lineas de Totales\r\n";
                        errores = true;
                    }
                    if (linea_sumable == false) {
                        descri_error += "-- Costes deben ir a lineas Sumables\r\n";
                        errores = true;
                    }
                    if (linea_novisible == true && permite_en_novisible == false) {
                        descri_error += "-- Costes deben ir a lineas Visibles\r\n";
                        errores = true;
                    }

                }

                if (tipo_adicional == 'estadisticos') {

                    if (linea_blanca == true) {
                        descri_error += "-- Datos Estadisticos no pueden ir a lineas blancas\r\n";
                        errores = true;
                    }
                    if (de_totales == true) {
                        descri_error += "-- Datos Estadisticos no pueden ir a lineas de Totales\r\n";
                        errores = true;
                    }
                    if (linea_novisible == true && permite_en_novisible == false) {
                        descri_error += "-- Datos Estadisticos deben ir a lineas Visibles\r\n";
                        errores = true;
                    }
                }

                if (tipo_adicional == 'acum_estadisticos') {

                    if (linea_blanca == true) {
                        descri_error += "-- Datos Acum. Estadisticos no pueden ir a lineas blancas\r\n";
                        errores = true;
                    }
                    if (de_totales == true) {
                        descri_error += "-- Datos Acum. Estadisticos no pueden ir a lineas de Totales\r\n";
                        errores = true;
                    }
                    if (linea_sumable == true) {
                        descri_error += "-- Datos Acum. Estadisticos no pueden ir a lineas Sumables\r\n";
                        errores = true;
                    }
                    if (linea_novisible == true && permite_en_novisible == false) {
                        descri_error += "-- Datos Acum. Estadisticos deben ir a lineas Visibles\r\n";
                        errores = true;
                    }
                }

                if (tipo_adicional == 'correcciones') {

                    if (estadistica == true) {
                        descri_error += "-- Las Correcciones no pueden ir a lineas estadisticas\r\n";
                        errores = true;
                    }
                    if (linea_blanca == true) {
                        descri_error += "-- Las Correcciones no pueden ir a lineas blancas\r\n";
                        errores = true;
                    }
                    if (de_totales == true) {
                        descri_error += "-- Las Correcciones no pueden ir a lineas de Totales\r\n";
                        errores = true;
                    }
                    if (linea_sumable == false) {
                        descri_error += "-- Las Correcciones deben ir a lineas Sumables\r\n";
                        errores = true;
                    }
                    if (linea_novisible == true && permite_en_novisible == false) {
                        descri_error += "--Las Correcciones deben ir a lineas Visibles\r\n";
                        errores = true;
                    }
                }

                var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
                fs.writeSync(fiche, descri_error, 0);
                fs.closeSync(fiche);

                if (errores == false) {

                    if (tipo_adicional == 'costes') {

                        tablaAdicionalesCostes.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
                        tablaAdicionalesCostes.setOrdenBy('INDICE DESC');
                        await tablaAdicionalesCostes.open().then(response => {

                            stat = tablaAdicionalesCostes.getFirst();

                            if (stat == false) {
                                indice = 1;
                            }
                            else {
                                indice = tablaAdicionalesCostes.getIndice() + 1;
                            }

                            tablaAdicionalesCostes.registroBlanco();
                            tablaAdicionalesCostes.setIndice(indice);
                            tablaAdicionalesCostes.setHoja(hoja);
                            tablaAdicionalesCostes.setLinea(linea);
                            tablaAdicionalesCostes.setTitulo(titulo);
                            tablaAdicionalesCostes.setBlanca(blanca);
                            tablaAdicionalesCostes.setOrden(orden);
                            tablaAdicionalesCostes.setGrabada(false);
                            tablaAdicionalesCostes.insertRow();

                        });
                    }

                    if (tipo_adicional == 'estadisticos') {

                        tablaAdicionalesEstadisticos.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
                        tablaAdicionalesEstadisticos.setOrdenBy('INDICE DESC');
                        await tablaAdicionalesEstadisticos.open().then(response => {

                            stat = tablaAdicionalesEstadisticos.getFirst();

                            if (stat == false) {
                                indice = 1;
                            }
                            else {
                                indice = tablaAdicionalesEstadisticos.getIndice() + 1;
                            }

                            tablaAdicionalesEstadisticos.registroBlanco();
                            tablaAdicionalesEstadisticos.setIndice(indice);
                            tablaAdicionalesEstadisticos.setHoja(hoja);
                            tablaAdicionalesEstadisticos.setLinea(linea);
                            tablaAdicionalesEstadisticos.setTitulo(titulo);
                            tablaAdicionalesEstadisticos.setBlanca(blanca);
                            tablaAdicionalesEstadisticos.setOrden(orden);
                            tablaAdicionalesEstadisticos.setGrabada(false);
                            tablaAdicionalesEstadisticos.insertRow();

                        });
                    }

                    if (tipo_adicional == 'acum_estadisticos') {

                        tablaAcumuladosEstadisticos.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
                        tablaAcumuladosEstadisticos.setOrdenBy('INDICE DESC');
                        await tablaAcumuladosEstadisticos.open().then(response => {

                            stat = tablaAcumuladosEstadisticos.getFirst();

                            if (stat == false) {
                                indice = 1;
                            }
                            else {
                                indice = tablaAcumuladosEstadisticos.getIndice() + 1;
                            }

                            tablaAcumuladosEstadisticos.registroBlanco();
                            tablaAcumuladosEstadisticos.setIndice(indice);
                            tablaAcumuladosEstadisticos.setHoja(hoja);
                            tablaAcumuladosEstadisticos.setLinea(linea);
                            tablaAcumuladosEstadisticos.setTitulo(titulo);
                            tablaAcumuladosEstadisticos.setBlanca(blanca);
                            tablaAcumuladosEstadisticos.setOrden(orden);
                            tablaAcumuladosEstadisticos.setGrabada(false);
                            tablaAcumuladosEstadisticos.insertRow();

                        });
                    }

                    if (tipo_adicional == 'correcciones') {

                        tablaAdicionalesCorrecciones.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
                        tablaAdicionalesCorrecciones.setOrdenBy('INDICE DESC');
                        await tablaAdicionalesCorrecciones.open().then(response => {

                            stat = tablaAdicionalesCorrecciones.getFirst();

                            if (stat == false) {
                                indice = 1;
                            }
                            else {
                                indice = tablaAdicionalesCorrecciones.getIndice() + 1;
                            }

                            tablaAdicionalesCorrecciones.registroBlanco();
                            tablaAdicionalesCorrecciones.setIndice(indice);
                            tablaAdicionalesCorrecciones.setHoja(hoja);
                            tablaAdicionalesCorrecciones.setLinea(linea);
                            tablaAdicionalesCorrecciones.setTitulo(titulo);
                            tablaAdicionalesCorrecciones.setBlanca(blanca);
                            tablaAdicionalesCorrecciones.setOrden(orden);
                            tablaAdicionalesCorrecciones.setGrabada(false);
                            tablaAdicionalesCorrecciones.insertRow();

                        });
                    }
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

                descri_error += "-- Numero de Linea No Existe en la Hoja\r\n";
                errores = true;

            }
            else {

                estadistica = tablaLineas.getEstadistica();
                de_totales = tablaLineas.getDeTotales();
                linea_blanca = tablaLineas.getBlanca();
                linea_sumable = tablaLineas.getSumable();
                linea_novisible = tablaLineas.getInvisible();

            }

            var stat2;
            async function prim2() {
                stat2 = await tablaParametrosApp.getByPrimaryIndex();
            }

            prim2().then(async response => {

                permite_en_novisible = tablaParametrosApp.getCargosLineaNoVisible();

                if (tipo_adicional == 'costes') {

                    if (estadistica == true) {
                        descri_error += "-- Costes no pueden ir a lineas estadisticas\r\n";
                        errores = true;
                    }
                    if (linea_blanca == true) {
                        descri_error += "-- Costes no pueden ir a lineas blancas\r\n";
                        errores = true;
                    }
                    if (de_totales == true) {
                        descri_error += "-- Costes no pueden ir a lineas de Totales\r\n";
                        errores = true;
                    }
                    if (linea_sumable == false) {
                        descri_error += "-- Costes deben ir a lineas Sumables\r\n";
                        errores = true;
                    }
                    if (linea_novisible == true && permite_en_novisible == false) {
                        descri_error += "-- Costes deben ir a lineas Visibles\r\n";
                        errores = true;
                    }

                }

                if (tipo_adicional == 'estadisticos') {

                    if (linea_blanca == true) {
                        descri_error += "-- Datos Estadisticos no pueden ir a lineas blancas\r\n";
                        errores = true;
                    }
                    if (de_totales == true) {
                        descri_error += "-- Datos Estadisticos no pueden ir a lineas de Totales\r\n";
                        errores = true;
                    }
                    if (linea_novisible == true && permite_en_novisible == false) {
                        descri_error += "-- Datos Estadisticos deben ir a lineas Visibles\r\n";
                        errores = true;
                    }
                }

                if (tipo_adicional == 'acum_estadisticos') {

                    if (linea_blanca == true) {
                        descri_error += "-- Datos Acum. Estadisticos no pueden ir a lineas blancas\r\n";
                        errores = true;
                    }
                    if (de_totales == true) {
                        descri_error += "-- Datos Acum. Estadisticos no pueden ir a lineas de Totales\r\n";
                        errores = true;
                    }
                    if (linea_sumable == true) {
                        descri_error += "-- Datos Acum. Estadisticos no pueden ir a lineas Sumables\r\n";
                        errores = true;
                    }
                    if (linea_novisible == true && permite_en_novisible == false) {
                        descri_error += "-- Datos Acum. Estadisticos deben ir a lineas Visibles\r\n";
                        errores = true;
                    }
                }

                if (tipo_adicional == 'correcciones') {

                    if (estadistica == true) {
                        descri_error += "-- Las Correcciones no pueden ir a lineas estadisticas\r\n";
                        errores = true;
                    }
                    if (linea_blanca == true) {
                        descri_error += "-- Las Correcciones no pueden ir a lineas blancas\r\n";
                        errores = true;
                    }
                    if (de_totales == true) {
                        descri_error += "-- Las Correcciones no pueden ir a lineas de Totales\r\n";
                        errores = true;
                    }
                    if (linea_sumable == false) {
                        descri_error += "-- Las Correcciones deben ir a lineas Sumables\r\n";
                        errores = true;
                    }
                    if (linea_novisible == true && permite_en_novisible == false) {
                        descri_error += "-- Las Correcciones deben ir a lineas Visibles\r\n";
                        errores = true;
                    }
                }

                var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
                fs.writeSync(fiche, descri_error, 0);
                fs.closeSync(fiche);

                if (errores == false) {

                    if (tipo_adicional == 'costes') {
                        tablaAdicionalesCostes.registroBlanco();
                        tablaAdicionalesCostes.setHoja(hoja);
                        tablaAdicionalesCostes.setLinea(linea);
                        tablaAdicionalesCostes.setTitulo(titulo);
                        tablaAdicionalesCostes.setBlanca(blanca);
                        tablaAdicionalesCostes.setOrden(orden);
                        tablaAdicionalesCostes.setGrabada(false);
                        tablaAdicionalesCostes.updateRow(indice);
                    }

                    if (tipo_adicional == 'estadisticos') {
                        tablaAdicionalesEstadisticos.registroBlanco();
                        tablaAdicionalesEstadisticos.setHoja(hoja);
                        tablaAdicionalesEstadisticos.setLinea(linea);
                        tablaAdicionalesEstadisticos.setTitulo(titulo);
                        tablaAdicionalesEstadisticos.setBlanca(blanca);
                        tablaAdicionalesEstadisticos.setOrden(orden);
                        tablaAdicionalesEstadisticos.setGrabada(false);
                        tablaAdicionalesEstadisticos.updateRow(indice);
                    }

                    if (tipo_adicional == 'acum_estadisticos') {
                        tablaAcumuladosEstadisticos.registroBlanco();
                        tablaAcumuladosEstadisticos.setHoja(hoja);
                        tablaAcumuladosEstadisticos.setLinea(linea);
                        tablaAcumuladosEstadisticos.setTitulo(titulo);
                        tablaAcumuladosEstadisticos.setBlanca(blanca);
                        tablaAcumuladosEstadisticos.setOrden(orden);
                        tablaAcumuladosEstadisticos.setGrabada(false);
                        tablaAcumuladosEstadisticos.updateRow(indice);
                    }

                    if (tipo_adicional == 'correcciones') {
                        tablaAdicionalesCorrecciones.registroBlanco();
                        tablaAdicionalesCorrecciones.setHoja(hoja);
                        tablaAdicionalesCorrecciones.setLinea(linea);
                        tablaAdicionalesCorrecciones.setTitulo(titulo);
                        tablaAdicionalesCorrecciones.setBlanca(blanca);
                        tablaAdicionalesCorrecciones.setOrden(orden);
                        tablaAdicionalesCorrecciones.setGrabada(false);
                        tablaAdicionalesCorrecciones.updateRow(indice);
                    }
                }
            });

            res.send('');
        });
    }

    if (opcion == 'baja') {

        if (tipo_adicional == 'costes') {
            tablaAdicionalesCostes.deleteByPrimaryIndex(indice);
        }
        if (tipo_adicional == 'estadisticos') {
            tablaAdicionalesEstadisticos.deleteByPrimaryIndex(indice);
        }
        if (tipo_adicional == 'acum_estadisticos') {
            tablaAcumuladosEstadisticos.deleteByPrimaryIndex(indice);
        }
        if (tipo_adicional == 'correcciones') {
            tablaAdicionalesCorrecciones.deleteByPrimaryIndex(indice);
        }

        res.send('');

    }

    if (opcion == 'imprimir') {

        var nombre_empresa;
        var hoja;

        var indice;
        var hoja_ana;
        var linea_ana;
        var titulo;
        var blanca;

        var tablaHojas = new tabla_hojas.TablaHojas(db);
        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaAdicionalesCostes = new tabla_adicionales_costes.TablaAdicionalesCostes(db);
        var tablaAdicionalesEstadisticos = new tabla_adicionales_estadisticos.TablaAdicionalesEstadisticos(db);
        var tablaAdicionalesCorrecciones = new tabla_adicionales_correcciones.TablaAdicionalesCorrecciones(db);
        var tablaAcumuladosEstadisticos = new tabla_acumulados_estadisticos.TablaAcumuladosEstadisticos(db);
        var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);

        const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
        const search_params = current_url.searchParams;

        var vector_texto = req.body.data;
        var vector_datos_impresora = req.body.data_impre;

        //var vector_texto = search_params.get('data');
        //var vector_datos_impresora = search_params.get('data_impre');

        //var vector_texto = $_POST['data'];
        //var vector_datos_impresora = $_POST['data_impre'];

        var tipo_adicional = rutinas.leer_lista_campos(vector_texto, 'tipo_adicional');

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
            if (tipo_adicional == 'costes') {
                await tablaAdicionalesCostes.open();
            }
            else if (tipo_adicional == 'estadisticos') {
                await tablaAdicionalesEstadisticos.open();
            }
            else if (tipo_adicional == 'correcciones') {
                await tablaAdicionalesCorrecciones.open();
            }
            else if (tipo_adicional == 'acum_estadisticos') {
                await tablaAcumuladosEstadisticos.open();
            }
        }

        if (tipo_adicional == 'costes') {
            tablaAdicionalesCostes.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
            tablaAdicionalesCostes.setOrdenBy('ORDEN');
        }
        else if (tipo_adicional == 'estadisticos') {
            tablaAdicionalesEstadisticos.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
            tablaAdicionalesEstadisticos.setOrdenBy('ORDEN');
        }
        else if (tipo_adicional == 'correcciones') {
            tablaAdicionalesCorrecciones.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
            tablaAdicionalesCorrecciones.setOrdenBy('ORDEN');
        }
        else if (tipo_adicional == 'acum_estadisticos') {
            tablaAcumuladosEstadisticos.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
            tablaAcumuladosEstadisticos.setOrdenBy('ORDEN');
        }

        primx().then(response => {

            var imp = new impresion.Treu_print_courier_pdf();

            imp.resetcondi();
            imp.setOrientacion("V");
            imp.setSizeFont(9);

            var aper = imp.aperturaSilenciosa2(vector_datos_impresora);

            if (aper == true) {

                hoja = 1;
                cabecera(imp, nombre_empresa, tipo_adicional, hoja);

                var stat2;

                if (tipo_adicional == 'costes') {
                    stat2 = tablaAdicionalesCostes.getFirst();
                }
                else if (tipo_adicional == 'estadisticos') {
                    stat2 = tablaAdicionalesEstadisticos.getFirst();
                }
                else if (tipo_adicional == 'correcciones') {
                    stat2 = tablaAdicionalesCorrecciones.getFirst();
                }
                else if (tipo_adicional == 'acum_estadisticos') {
                    stat2 = tablaAcumuladosEstadisticos.getFirst();
                }

                while (stat2 == true) {

                    var hayspa = imp.hayespacio(2);

                    if (hayspa != true) {
                        hoja++;
                        imp.hoja();
                        cabecera(imp, nombre_empresa, tipo_adicional, hoja);
                    }

                    if (tipo_adicional == 'costes') {
                        hoja_ana = tablaAdicionalesCostes.getHoja();
                        linea_ana = tablaAdicionalesCostes.getLinea();
                        indice = tablaAdicionalesCostes.getIndice();
                        titulo = tablaAdicionalesCostes.getTitulo();
                        blanca = tablaAdicionalesCostes.getBlanca();
                    }
                    else if (tipo_adicional == 'estadisticos') {
                        hoja_ana = tablaAdicionalesEstadisticos.getHoja();
                        linea_ana = tablaAdicionalesEstadisticos.getLinea();
                        indice = tablaAdicionalesEstadisticos.getIndice();
                        titulo = tablaAdicionalesEstadisticos.getTitulo();
                        blanca = tablaAdicionalesEstadisticos.getBlanca();
                    }
                    else if (tipo_adicional == 'correcciones') {
                        hoja_ana = tablaAdicionalesCorrecciones.getHoja();
                        linea_ana = tablaAdicionalesCorrecciones.getLinea();
                        indice = tablaAdicionalesCorrecciones.getIndice();
                        titulo = tablaAdicionalesCorrecciones.getTitulo();
                        blanca = tablaAdicionalesCorrecciones.getBlanca();
                    }
                    else if (tipo_adicional == 'acum_estadisticos') {
                        hoja_ana = tablaAcumuladosEstadisticos.getHoja();
                        linea_ana = tablaAcumuladosEstadisticos.getLinea();
                        indice = tablaAcumuladosEstadisticos.getIndice();
                        titulo = tablaAcumuladosEstadisticos.getTitulo();
                        blanca = tablaAcumuladosEstadisticos.getBlanca();
                    }

                    // Imprimimos la Linea

                    if (blanca == false) {
                        imp.printre(' ', 4);
                        imp.print(formato.form('##.###', indice, ""));
                        imp.printre(' ', 3);
                        imp.print(formato.form('##', hoja_ana, '0'));
                        imp.print('  /  ');
                        imp.print(formato.form('###', linea_ana, '0'));
                        imp.printre(' ', 3);
                        imp.print(rutinas.acoplarserie(titulo, 30));
                        imp.printre(' ', 2);
                        imp.printre('_', 16);
                        imp.linea();
                        imp.linea();
                    }
                    else {
                        imp.printre(' ', 26);
                        imp.setNegrita(true);
                        imp.print(rutinas.acoplarserie(titulo, 30));
                        imp.setNegrita(false);
                        imp.linea();
                        imp.linea();
                    }

                    if (tipo_adicional == 'costes') {
                        stat2 = tablaAdicionalesCostes.getNext();
                    }
                    else if (tipo_adicional == 'estadisticos') {
                        stat2 = tablaAdicionalesEstadisticos.getNext();
                    }
                    else if (tipo_adicional == 'correcciones') {
                        stat2 = tablaAdicionalesCorrecciones.getNext();
                    }
                    else if (tipo_adicional == 'acum_estadisticos') {
                        stat2 = tablaAcumuladosEstadisticos.getNext();
                    }
                }
            }

            imp.cierre();

            res.send('');

        });

    }

});

module.exports = router;
