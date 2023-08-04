// --------------------------------------------------------------
// Servidor: Importar Movimientos Diario Contabilidad
// --------------------------------------------------------------

const rutinas = require('../treu/rutinas_server.js');

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_mascaras_cuentas = require('../tablas/tabla_mascaras_cuentas.js');
const tabla_diario_fichero = require('../tablas/tabla_diario_fichero.js');
const tabla_origenes_diario = require('../tablas/tabla_origenes_diario.js');
const treu = require("../treu/treu_file.js");
const treurut = require("../treu/rutinas_server.js");

const multer = require('multer');
var upload = multer({ dest: path.join(__dirname, '../temporal') });

/* GET home page. */
router.get('/importar_movimientos', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    // get url parameters
    const mensaje = search_params.get('mensaje');
    var mensa_style;

    if (mensaje != null) {
        mensa_style = "display: inline;color: green;font-size: 1.2em;"
    }
    else {
        mensa_style = "display: none;"
    }

    var rows = [];
    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Subir Fichero";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");
    var color_formato = rutinas.getStyle(fichero, ".boton_formato");

    const folder = path.join(__dirname, '../temporal');

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, 0777);
    }

    var content;
    fs.readFile('./views/importar_movimientos.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { titulo_boton, color_boton, color_formato, mensa_style }));
    });

});

router.post('/importar_movimientos', upload.single('get_fichero'), async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    // get url parameters
    const origen = search_params.get('ORIGEN_DIARIO');

    const acceso = require("./procedimientos_varios");
    var db = acceso.accesoDB(req.session.empresa);

    var temporal = "temporal";
    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    var tablaOrigenesDiario = new tabla_origenes_diario.TablaOrigenesDiario(db);

    var stat;
    async function prim() {
        stat = await tablaOrigenesDiario.getByPrimaryIndex(origen);
    }

    prim().then(async response => {

        if (stat == false) {

            descri_error += "-- Origen de Diario No Existe\r\n";
            errores = true;

        }

    }).then(async rex => {

        if (req.file == undefined) {
            descri_error += "-- Fichero No Existe\r\n";
            errores = true;
        }

        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);

        if (errores == false) {

            var filex = "movimientos.txt"

            const folder = path.join(__dirname, '../temporal');
            if (fs.existsSync(folder + "/" + filex)) {
                fs.unlinkSync(folder + "/" + filex);
            }

            var originalname = req.file.originalname;
            var camino = req.file.destination;

            fs.rename(req.file.path, camino + "/movimientos.txt", (err) => {
                if (err != null) console.log(err);
            });

            // Carga de movimientos en la Base de Datos

            var mascaras = [];
            var num_mascaras = 0;

            var tablaMascarasCuentas = new tabla_mascaras_cuentas.TablaMascarasCuentas(db);

            await tablaMascarasCuentas.getByPrimaryIndex().then(stat => {

                if (stat == true) {
                    num_mascaras = tablaMascarasCuentas.getNumMascaras();
                    mascaras = tablaMascarasCuentas.getMascaras();
                }
                else {
                    num_mascaras = 0;
                    mascaras = [];
                }

            });

            var cuenta;
            var subcuenta;
            var referencia;
            var descripcion;
            var importe;
            var signo;
            var fecha;

            var tablaDiarioFichero = new tabla_diario_fichero.TablaDiarioFichero(db);

            tablaDiarioFichero.borrarDatosOrigen(origen);

            var fichero;
            var secuen = 0;

            fichero = new treu.TreuFile("./temporal/movimientos.txt");
            fichero.abrirFichero("r");

            fichero.setDelimitado(true);
            fichero.setComillas(true);

            stat = fichero.leerRegistro();

            while (stat == true) {

                cuenta = fichero.valorSerie(1);
                subcuenta = fichero.valorSerie(2);
                referencia = fichero.valorSerie(3);
                descripcion = fichero.valorSerie(4);
                importe = fichero.valorNumero(5);
                signo = fichero.valorSerie(6);
                fecha = fichero.valorFecha(7, "A");

                var pasa = false;
                for (var s = 0; s < num_mascaras; s++) {
                    var len = mascaras[s].length;
                    if (cuenta.substring(0, len) == mascaras[s]) {
                        pasa = true;
                        break;
                    }

                }

                if (pasa == true) {
                    
                    secuen++;

                    tablaDiarioFichero.registroBlanco();
                    tablaDiarioFichero.setOrigen(origen);
                    tablaDiarioFichero.setSecuencia(secuen);
                    tablaDiarioFichero.setCuenta(cuenta);
                    tablaDiarioFichero.setSubCuenta(subcuenta);
                    tablaDiarioFichero.setReferencia(referencia);
                    tablaDiarioFichero.setDescripcion(descripcion);
                    tablaDiarioFichero.setImporte(importe);
                    tablaDiarioFichero.setSigno(signo);
                    tablaDiarioFichero.setFecha(treurut.reformat_fecha(fecha));
                    tablaDiarioFichero.insertRow();
                }

                stat = fichero.leerRegistro();
            }

            fichero.cerrarFichero();

        }

        res.sendStatus(200);

    });

});

module.exports = router;
