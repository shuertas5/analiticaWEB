// --------------------------------------------------------------
// Servidor: Mantenimiento detalle de Lineas Analiticas
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const rutinas = require('../treu/rutinas_server.js');

router.get('/manten_lineas_detalle', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);

    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    var hoja = search_params.get('hoja');
    var linea = search_params.get('linea');
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
    var tipoacumulado;

    var titulo_hoja;

    if (opcion != null && opcion != undefined) {

        const acceso = require("./procedimientos_varios")

        var db = acceso.accesoDB(req.session.empresa);

        var tablaLineas = new tabla_lineas.TablaLineas(db);
        var tablaHojas = new tabla_hojas.TablaHojas(db);

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
                    stat = await tablaLineas.getByPrimaryIndex(hoja, linea);
                }
            }

            prim().then(async response => {

                if (stat == true) {

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
                    campos = { hoja, linea, titulo, ref_hoja, ref_linea, invisible, pasadas_calculo, de_totales, intensa, blanca, sumable, estadistica, con_decimales, caracterblanco, no_acumulable, con_porcentaje, reduccionamillares, lineademargen, lineadereparto, tipoacumulado };
                }

                const fichero = "./frontend/static/css/index.css";

                var titulo_boton;
                var color_boton;

                if (opcion == 'alta') {
                    disabled_clave = false;
                    disabled_campos = false;
                    linea = 0;
                    titulo = "";
                    ref_hoja = 0;
                    ref_linea = 0;
                    invisible = false;
                    pasadas_calculo = 1;
                    de_totales = false;
                    intensa = false;
                    blanca = false;
                    sumable = true;
                    estadistica = false;
                    con_decimales = true;
                    caracterblanco = ' ';
                    no_acumulable = false;
                    con_porcentaje = true;
                    reduccionamillares = true;
                    lineademargen = false;
                    lineadereparto = false;
                    tipoacumulado = 1;
                    campos = { hoja, linea, titulo, ref_hoja, ref_linea, invisible, pasadas_calculo, de_totales, intensa, blanca, sumable, estadistica, con_decimales, caracterblanco, no_acumulable, con_porcentaje, reduccionamillares, lineademargen, lineadereparto, tipoacumulado };
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
                fs.readFile('./views/manten_lineas_detalle.pug', async function read(err, data) {
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

router.post('/manten_lineas_detalle', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);

    var opcion = req.body.opcion;
    var hoja = req.body.HOJA;
    var linea = req.body.NUM_LINEA;
    var titulo = req.body.TITULO_LINEA;
    var ref_hoja = req.body.REF_HOJA;
    var ref_linea = req.body.REF_LINEA;
    var invisible = req.body.INVISIBLE;
    var pasadas_calculo = req.body.PASADA_CALCULO;
    var caracterblanco = req.body.CARACTER_BLANCO;
    var de_totales = req.body.DE_TOTALES;
    var intensa = req.body.INTENSA;
    var blanca = req.body.BLANCA;
    var sumable = req.body.SUMABLE;
    var estadistica = req.body.ESTADISTICA;
    var con_decimales = req.body.CON_DECIMALES;
    var no_acumulable = req.body.NO_ACUMULABLE;
    var con_porcentaje = req.body.CON_PORCENTAJE;
    var reduccionamillares = req.body.REDUCCION_A_MILLARES;
    var lineademargen = req.body.LINEA_DE_MARGEN;
    var lineadereparto = req.body.LINEA_DE_REPARTO;
    var tipoacumulado = req.body.TIPO_ACUMULADO;

    if (invisible == undefined) {
        invisible = false;
    }
    else {
        invisible = true;
    }

    if (de_totales == undefined) {
        de_totales = false;
    }
    else {
        de_totales = true;
    }

    if (intensa == undefined) {
        intensa = false;
    }
    else {
        intensa = true;
    }

    if (blanca == undefined) {
        blanca = false;
    }
    else {
        blanca = true;
    }

    if (sumable == undefined) {
        sumable = false;
    }
    else {
        sumable = true;
    }

    if (estadistica == undefined) {
        estadistica = false;
    }
    else {
        estadistica = true;
    }

    if (con_decimales == undefined) {
        con_decimales = false;
    }
    else {
        con_decimales = true;
    }

    if (no_acumulable == undefined) {
        no_acumulable = false;
    }
    else {
        no_acumulable = true;
    }

    if (con_porcentaje == undefined) {
        con_porcentaje = false;
    }
    else {
        con_porcentaje = true;
    }

    if (reduccionamillares == undefined) {
        reduccionamillares = false;
    }
    else {
        reduccionamillares = true;
    }

    if (lineademargen == undefined) {
        lineademargen = false;
    }
    else {
        lineademargen = true;
    }

    if (lineadereparto == undefined) {
        lineadereparto = false;
    }
    else {
        lineadereparto = true;
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

            if (stat == true) {

                descri_error += "-- Numero de Linea Ya Existe en la Hoja\r\n";
                errores = true;

            }

            if (linea == 0) {

                descri_error += "-- Numero de Linea = 0 No Valida\r\n";
                errores = true;

            }

            var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
            fs.writeSync(fiche, descri_error, 0);
            fs.closeSync(fiche);

            if (errores == false) {

                if (linea !== 0) {
                    tablaLineas.registroBlanco();
                    tablaLineas.setHoja(hoja);
                    tablaLineas.setLinea(linea);
                    tablaLineas.setTitulo(titulo);
                    tablaLineas.setRefHoja(ref_hoja);
                    tablaLineas.setRefLinea(ref_linea);
                    tablaLineas.setInvisible(invisible);
                    tablaLineas.setPasadaCalculo(pasadas_calculo);
                    tablaLineas.setCaracterBlanco(caracterblanco);
                    tablaLineas.setDeTotales(de_totales);
                    tablaLineas.setIntensa(intensa);
                    tablaLineas.setBlanca(blanca);
                    tablaLineas.setSumable(sumable);
                    tablaLineas.setEstadistica(estadistica);
                    tablaLineas.setConDecimales(con_decimales);
                    tablaLineas.setNoAcumulable(no_acumulable);
                    tablaLineas.setConPorcentaje(con_porcentaje);
                    tablaLineas.setReduccionAMillares(reduccionamillares);
                    tablaLineas.setLineaDeMargen(lineademargen);
                    tablaLineas.setLineaDeReparto(lineadereparto);
                    tablaLineas.setTipoAcumulado(tipoacumulado);
                    tablaLineas.insertRow();
                }
            }

            res.send('');

        });

    }

    if (opcion == 'modificacion') {

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.closeSync(fiche);

        if (errores == false) {

            tablaLineas.registroBlanco();
            tablaLineas.setTitulo(titulo);
            tablaLineas.setRefHoja(ref_hoja);
            tablaLineas.setRefLinea(ref_linea);
            tablaLineas.setInvisible(invisible);
            tablaLineas.setPasadaCalculo(pasadas_calculo);
            tablaLineas.setCaracterBlanco(caracterblanco);
            tablaLineas.setDeTotales(de_totales);
            tablaLineas.setIntensa(intensa);
            tablaLineas.setBlanca(blanca);
            tablaLineas.setSumable(sumable);
            tablaLineas.setEstadistica(estadistica);
            tablaLineas.setConDecimales(con_decimales);
            tablaLineas.setNoAcumulable(no_acumulable);
            tablaLineas.setConPorcentaje(con_porcentaje);
            tablaLineas.setReduccionAMillares(reduccionamillares);
            tablaLineas.setLineaDeMargen(lineademargen);
            tablaLineas.setLineaDeReparto(lineadereparto);
            tablaLineas.setTipoAcumulado(tipoacumulado);
            tablaLineas.updateRow(hoja, linea);

        }

        res.send('');
    }

    if (opcion == 'baja') {

        tablaLineas.deleteByPrimaryIndex(hoja,linea);

        res.send('');

    }

});

module.exports = router;
