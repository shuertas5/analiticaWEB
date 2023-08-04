// --------------------------------------------------------------
// Servidor: Mantenimiento Parametros de la Aplicacion
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const tabla_parametros_app = require('../tablas/tabla_parametros_app.js');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const rutinas = require('../treu/rutinas_server.js');

/* GET home page. */
router.get('/parametros_app', async function (req, res, next) {

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

    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaHojas = new tabla_hojas.TablaHojas(db);

    var campos = {};
    var escudos = [];

    escudos.push('-- Selecione Imagen Empresa --');

    const folder = path.join(__dirname, '../img_cliente');

    fs.readdir(folder, (err, files) => {

        files.forEach(file => {
            var file_enco = file;
            escudos.push(file_enco);
        });

    });

    await tablaParametrosApp.getByPrimaryIndex().then(stat2 => {

        if (stat2 == true) {

            nombre_empresa = tablaParametrosApp.getTituloEmpresa();
            escudo_empresa = tablaParametrosApp.getEscudoEmpresa();
            pasadas_calculo = tablaParametrosApp.getMaxPasadas();
            mes_en_curso = tablaParametrosApp.getMesEnCurso();
            anno_en_curso = tablaParametrosApp.getAnnoEnCurso();
            titulo_corto = tablaParametrosApp.getTituloCorto();
            anno_ppto = tablaParametrosApp.getAnnoPpto();
            fecha_ppto = tablaParametrosApp.getFechaPpto();
            hora_ppto = tablaParametrosApp.getHoraPpto();
            obligatoria_desc_adicional = tablaParametrosApp.getObligaDescAdicional();
            ppto_activo = tablaParametrosApp.getPresupuestoActivo();
            analitica_subcta_vacia = tablaParametrosApp.getAdmiteSubctaVacia();
            cargos_a_no_visibles = tablaParametrosApp.getCargosLineaNoVisible();
            control_de_fecha = tablaParametrosApp.getControlFechaMovimientos();
            hoja_resultado = tablaParametrosApp.getHojaResultado();
            linea_resultado = tablaParametrosApp.getLineaResultado();
            hoja_facturacion = tablaParametrosApp.getHojaFacturacion();
            linea_facturacion = tablaParametrosApp.getLineaFacturacion();

        }
        else {

            nombre_empresa = "";
            escudo_empresa = "";
            pasadas_calculo = 10;
            mes_en_curso = 1;
            anno_en_curso = 2022;
            titulo_corto = "";
            anno_ppto = 2022;
            fecha_ppto = new Date();
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

        }

        campos = { nombre_empresa, escudo_empresa, escudos, pasadas_calculo, mes_en_curso, anno_en_curso, titulo_corto, anno_ppto, fecha_ppto, hora_ppto, obligatoria_desc_adicional, ppto_activo, analitica_subcta_vacia, cargos_a_no_visibles, control_de_fecha, hoja_resultado, linea_resultado, hoja_facturacion, linea_facturacion };

    }).then(reponse => {

        const fichero = "./frontend/static/css/index.css";

        var titulo_boton = "Grabar";
        var color_boton = rutinas.getStyle(fichero, ".clase_boton_modificacion");

        var content;
        fs.readFile('./views/parametros_app.pug', async function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { titulo_boton, color_boton, campos: campos }));
        });
    });
});

router.post('/parametros_app', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);

    var nombre_empresa = req.body.NOMBRE_EMPRESA;
    var escudo_empresa = req.body.ESCUDO_EMPRESA;
    var pasadas_calculo = req.body.PASADAS_CALCULO;
    var mes_en_curso = req.body.MES_EN_CURSO;
    var anno_en_curso = req.body.ANNO_EN_CURSO;
    var titulo_corto = req.body.TIT_CORTO_EMPRESA;
    var anno_ppto = req.body.ANNO_PPTO;
    var fecha_ppto = req.body.FECHA_PPTO;
    var hora_ppto = req.body.HORA_PPTO;
    var obligatoria_desc_adicional = req.body.OBLIG_DESC_ADICIONAL;
    var ppto_activo = req.body.PPTO_ACTIVO;
    var analitica_subcta_vacia = req.body.ANALITICA_SUBCTA_VACIA;
    var cargos_a_no_visibles = req.body.CARGOS_A_NO_VISIBLES;
    var control_de_fecha = req.body.CONTROL_FECHA;
    var hoja_resultado = req.body.HOJA_RESULTADO;
    var linea_resultado = req.body.LINEA_RESULTADO;
    var hoja_facturacion = req.body.HOJA_FACTURACION;
    var linea_facturacion = req.body.LINEA_FACTURACION;

    if (obligatoria_desc_adicional == undefined) {
        obligatoria_desc_adicional = false;
    }
    else {
        obligatoria_desc_adicional = true;
    }

    if (ppto_activo == undefined) {
        ppto_activo = false;
    }
    else {
        ppto_activo = true;
    }

    if (analitica_subcta_vacia == undefined) {
        analitica_subcta_vacia = false;
    }
    else {
        analitica_subcta_vacia = true;
    }

    if (cargos_a_no_visibles == undefined) {
        cargos_a_no_visibles = false;
    }
    else {
        cargos_a_no_visibles = true;
    }

    if (control_de_fecha == undefined) {
        control_de_fecha = false;
    }
    else {
        control_de_fecha = true;
    }

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    if (mes_en_curso > 12 || mes_en_curso < 1) {

        descri_error += "-- Mes en Curso Incorrecto\r\n";
        errores = true;

    }

    if (anno_en_curso > 2100 || anno_en_curso < 2020) {

        descri_error += "-- Año en Curso Incorrecto\r\n";
        errores = true;

    }

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
    fs.writeSync(fiche, descri_error, 0);
    fs.closeSync(fiche);

    if (errores == false) {

        var existe;

        await tablaParametrosApp.getByPrimaryIndex().then(stat2 => {

            if (stat2 == true) {
                existe = true;
            } else {
                existe = false;
            }

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
            if (existe == true)
                tablaParametrosApp.updateRow();
            else
                tablaParametrosApp.insertRow();
        });

    }

    res.send('');

});

module.exports = router;
