// --------------------------------------------------------------
// Servidor: Generar la Aplicacion Analitica
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_parametros_app = require('../tablas/tabla_parametros_app.js');
const tabla_indicadores = require('../tablas/tabla_indicadores.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');

/* GET home page. */
router.get('/generar_aplicacion', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    const saltar = search_params.get('saltar');

    if (saltar == 'true') {
        res.send('');
        return;
    }

    var rows = [];

    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Generar Aplicacion";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

    var content;
    fs.readFile('./views/generar_aplicacion.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { color_boton, titulo_boton, rows: rows }));
    });

});

router.post('/generar_aplicacion', async function (req, res, next) {

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

    var stat;
    var contadores = 0;
    var gene_param = false;

    var temporal = "temporal";
    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var tablaIndicadores = new tabla_indicadores.TablaIndicadores(db);
    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);

    // -----------------------------------------------------
    // Parametros de la Aplicacion
    // -----------------------------------------------------

    await tablaParametrosApp.getByPrimaryIndex().then(stat2 => {

        if (stat == false) {
            nombre_empresa = "";
            escudo_empresa = "";
            pasadas_calculo = 10;
            mes_en_curso = 1;
            anno_en_curso = 2022;
            titulo_corto = "";
            anno_ppto = 2022;
            fecha_ppto = null;
            hora_ppto = "";
            obligatoria_desc_adicional = true;
            ppto_activo = false;
            analitica_subcta_vacia = false;
            cargos_a_no_visibles = false;
            control_de_fecha = true;
            hoja_resultado = 0;
            linea_resultado = 0;
            hoja_facturacion = 0;
            linea_facturacion = 0;

            tablaParametrosApp.registroBlanco();
            tablaParametrosApp.setUno();
            tablaParametrosApp.setTituloEmpresa(nombre_empresa);
            tablaParametrosApp.setEscudoEmpresa(escudo_empresa);
            tablaParametrosApp.setMaxPasadas(pasadas_calculo);
            tablaParametrosApp.setMesEnCurso(mes_en_curso);
            tablaParametrosApp.setAnnoEnCurso(anno_en_curso);
            tablaParametrosApp.setTituloCorto(titulo_corto);
            tablaParametrosApp.setAnnoPpto(anno_ppto);
            tablaParametrosApp.setFechaPpto(fecha_ppto);
            tablaParametrosApp.setHoraPpto(hora_ppto);
            tablaParametrosApp.setObligaDescAdicional(obligatoria_desc_adicional);
            tablaParametrosApp.setPresupuestoActivo(ppto_activo);
            tablaParametrosApp.setAdmiteSubctaVacia(analitica_subcta_vacia);
            tablaParametrosApp.setCargosLineaNoVisible(cargos_a_no_visibles);
            tablaParametrosApp.setControlFechaMovimientos(control_de_fecha);
            tablaParametrosApp.setHojaResultado(hoja_resultado);
            tablaParametrosApp.setLineaResultado(linea_resultado);
            tablaParametrosApp.setHojaFacturacion(hoja_facturacion);
            tablaParametrosApp.setLineaFacturacion(linea_facturacion);
            tablaParametrosApp.insertRow();

            gene_param=true;

        }
    });

    // -----------------------------------------------------
    // Indicadores de la Aplicacion
    // -----------------------------------------------------

    await tablaIndicadores.getByPrimaryIndex(1).then(stat => {
        if (stat == false) {
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setIndice(1);
            tablaIndicadores.setTitulo("Analitica C");
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.insertRow();
            contadores++;
        }
    });

    await tablaIndicadores.getByPrimaryIndex(2).then(stat => {
        if (stat == false) {
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setIndice(2);
            tablaIndicadores.setTitulo("Analitica L");
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.insertRow();
            contadores++;
        }
    });

    await tablaIndicadores.getByPrimaryIndex(3).then(stat => {
        if (stat == false) {
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setIndice(3);
            tablaIndicadores.setTitulo("Analitica A");
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.insertRow();
            contadores++;
        }
    });

    await tablaIndicadores.getByPrimaryIndex(4).then(stat => {
        if (stat == false) {
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setIndice(4);
            tablaIndicadores.setTitulo("Analitica B");
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.insertRow();
            contadores++;
        }
    });

    await tablaIndicadores.getByPrimaryIndex(5).then(stat => {
        if (stat == false) {
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setIndice(5);
            tablaIndicadores.setTitulo("Analitica D");
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.insertRow();
            contadores++;
        }
    });

    await tablaIndicadores.getByPrimaryIndex(6).then(stat => {
        if (stat == false) {
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setIndice(6);
            tablaIndicadores.setTitulo("Analitica K");
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.insertRow();
            contadores++;
        }
    });

    await tablaIndicadores.getByPrimaryIndex(7).then(stat => {
        if (stat == false) {
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setIndice(7);
            tablaIndicadores.setTitulo("Analitica J");
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.insertRow();
            contadores++;
        }
    });

    await tablaIndicadores.getByPrimaryIndex(8).then(stat => {
        if (stat == false) {
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setIndice(8);
            tablaIndicadores.setTitulo("Presupuesto A");
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.insertRow();
            contadores++;
        }
    });

    await tablaIndicadores.getByPrimaryIndex(9).then(stat => {
        if (stat == false) {
            tablaIndicadores.registroBlanco();
            tablaIndicadores.setIndice(9);
            tablaIndicadores.setTitulo("Presupuesto B");
            tablaIndicadores.setEncendido(false);
            tablaIndicadores.insertRow();
            contadores++;
        }
    });

    // Grabamos el fichero de retorno.txt

    var retorno = "temporal";
    var conten = "";

    var fiche = fs.openSync("./" + retorno + "/retorno.html", "w");

    conten += "<br>";
    if (gene_param==true) {
        conten += "<p>- Creados los Parametros de Aplicacion<p>";
    }
    conten += "<p>- Creados " + formato.form('##', contadores, 'H') + " Contadores<p>";
    conten += "<p>Aplicacion Generada Correctamente.<p>";

    fs.writeSync(fiche, conten, 0);
    fs.closeSync(fiche);

    res.send('');

});

module.exports = router;
