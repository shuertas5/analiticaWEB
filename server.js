const { Console } = require('console');
const express = require('express');
const path = require('path');
const fs = require('fs')
const pug = require('pug');
const url = require('url');
const session = require('express-session');

var cookieParser = require('cookie-parser');
var logger = require('morgan');

const puerto = 8090;

const app = express();

app.use(session({
    secret: 'satreu2018',
    resave: false,
    saveUninitialized: true
}));

app.use('/static', express.static(path.resolve(__dirname, 'frontend', 'static')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.basedir = app.get('views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css2', express.static(__dirname + '/frontend/static/css'));
app.use('/treu', express.static(__dirname + '/treu'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/local', express.static(__dirname + '/local'));
app.use('/temporal', express.static(__dirname + '/temporal'));
app.use('/frontend', express.static(__dirname + '/frontend'));
app.use('/img_cliente', express.static(__dirname + '/img_cliente'));
app.use('/views', express.static(__dirname + '/views'));

app.listen(puerto, () => {
    console.log(`Escuchando el puerto: ${puerto}`);
});

// ---------------------------------
// Rutas de pantallas
// ---------------------------------

var seleccion_tipos_hojas_Router = require('./routes/server_seleccion_tipos_hojas.js');
var seleccion_hojas_Router = require('./routes/server_seleccion_hojas.js');
var seleccion_lineas_Router = require('./routes/server_seleccion_lineas.js');
var seleccion_origenes_diario_Router = require('./routes/server_seleccion_origenes_diario.js');
var utilidades_Router = require('./routes/server_utilidades.js');
var principalRouter = require('./routes/server_principal.js');
var parametros_app_Router = require('./routes/server_parametros_app.js');
var configuracion_app_Router = require('./routes/server_configuracion_app.js');
var manten_tipos_hojas_Router = require('./routes/server_manten_tipos_hojas.js');
var manten_tipos_hojas_detalle_Router = require('./routes/server_manten_tipos_hojas_detalle.js');
var manten_hojas_Router = require('./routes/server_manten_hojas.js');
var manten_hojas_detalle_Router = require('./routes/server_manten_hojas_detalle.js');
var manten_lineas_Router = require('./routes/server_manten_lineas.js');
var manten_lineas_detalle_Router = require('./routes/server_manten_lineas_detalle.js');
var manten_totales_Router = require('./routes/server_manten_totales.js');
var manten_totales_detalle_Router = require('./routes/server_manten_totales_detalle.js');
var manten_adicionales_Router = require('./routes/server_manten_adicionales.js');
var manten_adicionales_detalle_Router = require('./routes/server_manten_adicionales_detalle.js');
var manten_origenes_diario_Router = require('./routes/server_manten_origenes_diario.js');
var manten_origenes_diario_detalle_Router = require('./routes/server_manten_origenes_diario_detalle.js');
var mascaras_cuentas_Router = require('./routes/server_mascaras_cuentas.js');
var importar_movimientos_Router = require('./routes/server_importar_movimientos.js');
var sumar_movimientos_diario_Router = require('./routes/server_sumar_movimientos_diario.js');
var importar_imagenes_Router = require('./routes/server_importar_imagenes.js');
var importar_ficheros_analitica_Router = require('./routes/server_importar_ficheros_analitica.js');
var reparto_ppto_hoja_linea_Router = require('./routes/server_reparto_ppto_hoja_linea.js');
var reparto_ppto_hoja_linea_detalle_Router = require('./routes/server_reparto_ppto_hoja_linea_detalle.js');
var reparto_ppto_hojas_Router = require('./routes/server_reparto_ppto_hojas.js');
var reparto_ppto_hojas_detalle_Router = require('./routes/server_reparto_ppto_hojas_detalle.js');
var reparto_ppto_global_Router = require('./routes/server_reparto_ppto_global.js');
var reparto_ppto_global_detalle_Router = require('./routes/server_reparto_ppto_global_detalle.js');
var correcciones_analiticas_Router = require('./routes/server_correcciones_analiticas.js');
var correcciones_analiticas_detalle_Router = require('./routes/server_correcciones_analiticas_detalle.js');
var introducir_valores_adicionales_Router = require('./routes/server_introducir_valores_adicionales.js');
var introducir_valores_adicionales_detalle_Router = require('./routes/server_introducir_valores_adicionales_detalle.js');
var introducir_valores_presupuesto_Router = require('./routes/server_introducir_valores_presupuesto.js');
var introducir_valores_presupuesto_detalle_Router = require('./routes/server_introducir_valores_presupuesto_detalle.js');
var treu_impresion_final_Router = require('./routes/server_treu_impresion_final.js');
var manten_asignaciones_Router = require('./routes/server_manten_asignaciones.js');
var manten_asignaciones_detalle_Router = require('./routes/server_manten_asignaciones_detalle.js');
var manten_notas_ppto_Router = require('./routes/server_manten_notas_ppto.js');
var manten_notas_ppto_detalle_Router = require('./routes/server_manten_notas_ppto_detalle.js');
var consulta_analitica_Router = require('./routes/server_consulta_analitica.js');
var consulta_presupuesto_Router = require('./routes/server_consulta_presupuesto.js');
var cargar_importacion_analitica_Router = require('./routes/server_cargar_importacion_analitica.js');
var imprimir_presupuesto_Router = require('./routes/server_imprimir_presupuesto.js');
var imprimir_analitica_Router = require('./routes/server_imprimir_analitica.js');
var imprimir_analitica_en_tramite_Router = require('./routes/server_imprimir_analitica_en_tramite.js');
var consulta_analitica_en_tramite_Router = require('./routes/server_consulta_analitica_en_tramite.js');
var calcular_presupuesto_Router = require('./routes/server_calcular_presupuesto.js');
var consulta_reparto_ppto_lineas_Router = require('./routes/server_consulta_reparto_lineas.js');
var consulta_reparto_ppto_hojas_Router = require('./routes/server_consulta_reparto_hojas.js');
var consulta_reparto_ppto_global_Router = require('./routes/server_consulta_reparto_global.js');
var generar_aplicacion_Router = require('./routes/server_generar_aplicacion.js');
var borrados_presupuestos_Router = require('./routes/server_borrados_presupuestos.js');
var duplicado_hoja_analitica_Router = require('./routes/server_duplicado_hoja_analitica.js');
var borrado_hoja_analitica_Router = require('./routes/server_borrado_hoja_analitica.js');
var calcular_analitica_Router = require('./routes/server_calcular_analitica.js');
var borrado_calculo_analitica_Router = require('./routes/server_borrado_calculo_analitica.js');
var cierre_calculo_analitica_Router = require('./routes/server_cierre_calculo_analitica.js');
var reapertura_cierre_analitica_Router = require('./routes/server_reapertura_cierre_analitica.js');
var consulta_historico_analitica_Router = require('./routes/server_consulta_historico_analitica.js');
var imprimir_historico_analitica_Router = require('./routes/server_imprimir_historico_analitica.js');
var consulta_historico_presupuesto_Router = require('./routes/server_consulta_historico_presupuesto.js');
var imprimir_historico_presupuesto_Router = require('./routes/server_imprimir_historico_presupuesto.js');
var index_Router = require('./routes/server_index.js');

app.use('/seleccion_tipos_hojas', seleccion_tipos_hojas_Router);
app.use('/seleccion_hojas', seleccion_hojas_Router);
app.use('/seleccion_lineas', seleccion_lineas_Router);
app.use('/seleccion_origenes_diario', seleccion_origenes_diario_Router);
app.use('/utilidades', utilidades_Router);
app.use('/principal', principalRouter);
app.use('/parametros_app', parametros_app_Router);
app.use('/configuracion_app', configuracion_app_Router);
app.use('/manten_tipos_hojas', manten_tipos_hojas_Router);
app.use('/manten_tipos_hojas_detalle', manten_tipos_hojas_detalle_Router);
app.use('/manten_hojas', manten_hojas_Router);
app.use('/manten_hojas_detalle', manten_hojas_detalle_Router);
app.use('/manten_lineas', manten_lineas_Router);
app.use('/manten_lineas_detalle', manten_lineas_detalle_Router);
app.use('/manten_totales', manten_totales_Router);
app.use('/manten_totales_detalle', manten_totales_detalle_Router);
app.use('/manten_adicionales', manten_adicionales_Router);
app.use('/manten_adicionales_detalle', manten_adicionales_detalle_Router);
app.use('/manten_origenes_diario', manten_origenes_diario_Router);
app.use('/manten_origenes_diario_detalle', manten_origenes_diario_detalle_Router);
app.use('/mascaras_cuentas', mascaras_cuentas_Router);
app.use('/importar_movimientos', importar_movimientos_Router);
app.use('/sumar_movimientos_diario', sumar_movimientos_diario_Router);
app.use('/importar_imagenes', importar_imagenes_Router);
app.use('/importar_ficheros_analitica', importar_ficheros_analitica_Router);
app.use('/reparto_ppto_hoja_linea', reparto_ppto_hoja_linea_Router);
app.use('/reparto_ppto_hoja_linea_detalle', reparto_ppto_hoja_linea_detalle_Router);
app.use('/reparto_ppto_hojas', reparto_ppto_hojas_Router);
app.use('/reparto_ppto_hojas_detalle', reparto_ppto_hojas_detalle_Router);
app.use('/reparto_ppto_global', reparto_ppto_global_Router);
app.use('/reparto_ppto_global_detalle', reparto_ppto_global_detalle_Router);
app.use('/correcciones_analiticas', correcciones_analiticas_Router);
app.use('/correcciones_analiticas_detalle', correcciones_analiticas_detalle_Router);
app.use('/introducir_valores_adicionales', introducir_valores_adicionales_Router);
app.use('/introducir_valores_adicionales_detalle', introducir_valores_adicionales_detalle_Router);
app.use('/introducir_valores_presupuesto', introducir_valores_presupuesto_Router);
app.use('/introducir_valores_presupuesto_detalle', introducir_valores_presupuesto_detalle_Router);
app.use('/treu_impresion_final', treu_impresion_final_Router);
app.use('/manten_asignaciones', manten_asignaciones_Router);
app.use('/manten_asignaciones_detalle', manten_asignaciones_detalle_Router);
app.use('/manten_notas_ppto', manten_notas_ppto_Router);
app.use('/manten_notas_ppto_detalle', manten_notas_ppto_detalle_Router);
app.use('/consulta_analitica', consulta_analitica_Router);
app.use('/consulta_presupuesto', consulta_presupuesto_Router);
app.use('/cargar_importacion_analitica', cargar_importacion_analitica_Router);
app.use('/imprimir_presupuesto', imprimir_presupuesto_Router);
app.use('/imprimir_analitica', imprimir_analitica_Router);
app.use('/imprimir_analitica_en_tramite', imprimir_analitica_en_tramite_Router);
app.use('/consulta_analitica_en_tramite', consulta_analitica_en_tramite_Router);
app.use('/calcular_presupuesto', calcular_presupuesto_Router);
app.use('/consulta_reparto_ppto_lineas', consulta_reparto_ppto_lineas_Router);
app.use('/consulta_reparto_ppto_hojas', consulta_reparto_ppto_hojas_Router);
app.use('/consulta_reparto_ppto_global', consulta_reparto_ppto_global_Router);
app.use('/generar_aplicacion', generar_aplicacion_Router);
app.use('/borrados_presupuestos', borrados_presupuestos_Router);
app.use('/duplicado_hoja_analitica', duplicado_hoja_analitica_Router);
app.use('/borrado_hoja_analitica', borrado_hoja_analitica_Router);
app.use('/calcular_analitica', calcular_analitica_Router);
app.use('/borrado_calculo_analitica', borrado_calculo_analitica_Router);
app.use('/cierre_calculo_analitica', cierre_calculo_analitica_Router);
app.use('/reapertura_cierre_analitica', reapertura_cierre_analitica_Router);
app.use('/consulta_historico_analitica', consulta_historico_analitica_Router);
app.use('/imprimir_historico_analitica', imprimir_historico_analitica_Router);
app.use('/consulta_historico_presupuesto', consulta_historico_presupuesto_Router);
app.use('/imprimir_historico_presupuesto', imprimir_historico_presupuesto_Router);
app.use('/index', index_Router);

app.get('/principal', principalRouter);
app.get('/seleccion_tipos_hojas', seleccion_tipos_hojas_Router);
app.get('/seleccion_hojas', seleccion_hojas_Router);
app.get('/seleccion_lineas', seleccion_lineas_Router);
app.get('/seleccion_origenes_diario', seleccion_origenes_diario_Router);
app.get('/utilidades', utilidades_Router);
app.get('/parametros_app', parametros_app_Router);
app.get('/configuracion_app', configuracion_app_Router);
app.get('/manten_tipos_hojas', manten_tipos_hojas_Router);
app.get('/manten_tipos_hojas_detalle', manten_tipos_hojas_detalle_Router);
app.get('/manten_hojas', manten_hojas_Router);
app.get('/manten_hojas_detalle', manten_hojas_detalle_Router);
app.get('/manten_lineas', manten_lineas_Router);
app.get('/manten_lineas_detalle', manten_lineas_detalle_Router);
app.get('/manten_totales', manten_totales_Router);
app.get('/manten_totales_detalle', manten_totales_detalle_Router);
app.get('/manten_adicionales', manten_adicionales_Router);
app.get('/manten_adicionales_detalle', manten_adicionales_detalle_Router);
app.get('/manten_origenes_diario', manten_origenes_diario_Router);
app.get('/manten_origenes_diario_detalle', manten_origenes_diario_detalle_Router);
app.get('/mascaras_cuentas', mascaras_cuentas_Router);
app.get('/importar_movimientos', importar_movimientos_Router);
app.get('/sumar_movimientos_diario', sumar_movimientos_diario_Router);
app.get('/importar_imagenes', importar_imagenes_Router);
app.get('/importar_ficheros_analitica', importar_ficheros_analitica_Router);
app.get('/reparto_ppto_hoja_linea', reparto_ppto_hoja_linea_Router);
app.get('/reparto_ppto_hoja_linea_detalle', reparto_ppto_hoja_linea_detalle_Router);
app.get('/reparto_ppto_hojas', reparto_ppto_hojas_Router);
app.get('/reparto_ppto_hojas_detalle', reparto_ppto_hojas_detalle_Router);
app.get('/reparto_ppto_global', reparto_ppto_global_Router);
app.get('/reparto_ppto_global_detalle', reparto_ppto_global_detalle_Router);
app.get('/correcciones_analiticas', correcciones_analiticas_Router);
app.get('/correcciones_analiticas_detalle', correcciones_analiticas_detalle_Router);
app.get('/introducir_valores_adicionales', introducir_valores_adicionales_Router);
app.get('/introducir_valores_adicionales_detalle', introducir_valores_adicionales_detalle_Router);
app.get('/introducir_valores_presupuesto', introducir_valores_presupuesto_Router);
app.get('/introducir_valores_presupuesto_detalle', introducir_valores_presupuesto_detalle_Router);
app.get('/treu_impresion_final', treu_impresion_final_Router);
app.get('/manten_asignaciones', manten_asignaciones_Router);
app.get('/manten_asignaciones_detalle', manten_asignaciones_detalle_Router);
app.get('/manten_notas_ppto', manten_notas_ppto_Router);
app.get('/manten_notas_ppto_detalle', manten_notas_ppto_detalle_Router);
app.get('/consulta_analitica', consulta_analitica_Router);
app.get('/consulta_presupuesto', consulta_presupuesto_Router);
app.get('/cargar_importacion_analitica', cargar_importacion_analitica_Router);
app.get('/imprimir_presupuesto', imprimir_presupuesto_Router);
app.get('/imprimir_analitica', imprimir_analitica_Router);
app.get('/imprimir_analitica_en_tramite', imprimir_analitica_en_tramite_Router);
app.get('/consulta_analitica_en_tramite', consulta_analitica_en_tramite_Router);
app.get('/calcular_presupuesto', calcular_presupuesto_Router);
app.get('/consulta_reparto_ppto_lineas', consulta_reparto_ppto_lineas_Router);
app.get('/consulta_reparto_ppto_hojas', consulta_reparto_ppto_hojas_Router);
app.get('/consulta_reparto_ppto_global', consulta_reparto_ppto_global_Router);
app.get('/generar_aplicacion', generar_aplicacion_Router);
app.get('/borrados_presupuestos', borrados_presupuestos_Router);
app.get('/duplicado_hoja_analitica', duplicado_hoja_analitica_Router);
app.get('/borrado_hoja_analitica', borrado_hoja_analitica_Router);
app.get('/calcular_analitica', calcular_analitica_Router);
app.get('/borrado_calculo_analitica', borrado_calculo_analitica_Router);
app.get('/cierre_calculo_analitica', cierre_calculo_analitica_Router);
app.get('/reapertura_cierre_analitica', reapertura_cierre_analitica_Router);
app.get('/consulta_historico_analitica', consulta_historico_analitica_Router);
app.get('/imprimir_historico_analitica', imprimir_historico_analitica_Router);
app.get('/consulta_historico_presupuesto', consulta_historico_presupuesto_Router);
app.get('/imprimir_historico_presupuesto', imprimir_historico_presupuesto_Router);
app.get('/index', index_Router);

app.post('/utilidades', utilidades_Router);
app.post('/manten_tipos_hojas_detalle', manten_tipos_hojas_detalle_Router);
app.post('/manten_hojas_detalle', manten_hojas_detalle_Router);
app.post('/manten_lineas_detalle', manten_lineas_detalle_Router);
app.post('/manten_totales_detalle', manten_totales_detalle_Router);
app.post('/manten_adicionales_detalle', manten_adicionales_detalle_Router);
app.post('/manten_origenes_diario_detalle', manten_origenes_diario_detalle_Router);
app.post('/parametros_app', parametros_app_Router);
app.post('/configuracion_app', configuracion_app_Router);
app.post('/mascaras_cuentas', mascaras_cuentas_Router);
app.post('/importar_movimientos', importar_movimientos_Router);
app.post('/sumar_movimientos_diario', sumar_movimientos_diario_Router);
app.post('/importar_imagenes', importar_imagenes_Router);
app.post('/importar_ficheros_analitica', importar_ficheros_analitica_Router);
app.post('/reparto_ppto_hoja_linea_detalle', reparto_ppto_hoja_linea_detalle_Router);
app.post('/reparto_ppto_hojas_detalle', reparto_ppto_hojas_detalle_Router);
app.post('/reparto_ppto_global_detalle', reparto_ppto_global_detalle_Router);
app.post('/correcciones_analiticas_detalle', correcciones_analiticas_detalle_Router);
app.post('/introducir_valores_adicionales_detalle', introducir_valores_adicionales_detalle_Router);
app.post('/introducir_valores_presupuesto_detalle', introducir_valores_presupuesto_detalle_Router);
app.post('/manten_asignaciones_detalle', manten_asignaciones_detalle_Router);
app.post('/manten_notas_ppto_detalle', manten_notas_ppto_detalle_Router);
app.post('/consulta_analitica', consulta_analitica_Router);
app.post('/consulta_presupuesto', consulta_presupuesto_Router);
app.post('/cargar_importacion_analitica', cargar_importacion_analitica_Router);
app.post('/imprimir_presupuesto', imprimir_presupuesto_Router);
app.post('/imprimir_analitica', imprimir_analitica_Router);
app.post('/imprimir_analitica_en_tramite', imprimir_analitica_en_tramite_Router);
app.post('/consulta_analitica_en_tramite', consulta_analitica_en_tramite_Router);
app.post('/calcular_presupuesto', calcular_presupuesto_Router);
app.post('/generar_aplicacion', generar_aplicacion_Router);
app.post('/borrados_presupuestos', borrados_presupuestos_Router);
app.post('/duplicado_hoja_analitica', duplicado_hoja_analitica_Router);
app.post('/borrado_hoja_analitica', borrado_hoja_analitica_Router);
app.post('/calcular_analitica', calcular_analitica_Router);
app.post('/borrado_calculo_analitica', borrado_calculo_analitica_Router);
app.post('/cierre_calculo_analitica', cierre_calculo_analitica_Router);
app.post('/reapertura_cierre_analitica', reapertura_cierre_analitica_Router);
app.post('/consulta_historico_analitica', consulta_historico_analitica_Router);
app.post('/imprimir_historico_analitica', imprimir_historico_analitica_Router);
app.post('/consulta_historico_presupuesto', consulta_historico_presupuesto_Router);
app.post('/imprimir_historico_presupuesto', imprimir_historico_presupuesto_Router);
app.post('/index', index_Router);

app.get('/', (req, res) => {

    //res.sendFile(path.resolve(__dirname, 'frontend', '/index'));

    var rows = [];
    var empresas = [];

    var fecha = new Date();

    var fichero;

    fichero = new treu.TreuFile("./datos_texto/empresas_analiticas.ini");
    fichero.abrirFichero("r");

    fichero.setDelimitado(true);
    fichero.setComillas(true);
    fichero.setSeparador(',');

    while (true) {

        var stat = fichero.leerRegistro();
        if (stat == false) {
            break;
        }

        var num_empre = fichero.valorNumero(1);
        var nombre = fichero.valorSerie(2);
        var pin = fichero.valorSerie(3);
        var imagen = fichero.valorSerie(4);
        var driver = fichero.valorSerie(5);
        var cadena_conexion = fichero.valorSerie(6);
        var usuario = fichero.valorSerie(7);
        var password = fichero.valorSerie(8);
        var host = fichero.valorSerie(9);
        var base_datos = fichero.valorSerie(10);

        empresas.push([num_empre, nombre, pin, imagen, driver, cadena_conexion, usuario, password, host, base_datos]);
        rows.push([num_empre, nombre, pin])
    }

    fichero.cerrarFichero();

    var content;
    fs.readFile('./views/index.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { fecha, rows: rows }));
    });

});

