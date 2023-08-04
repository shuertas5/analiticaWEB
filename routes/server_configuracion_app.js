// --------------------------------------------------------------
// Servidor: Configuracion de la Aplicacion
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const tabla_configuracion_app = require('../tablas/tabla_configuracion_app.js');
const rutinas = require('../treu/rutinas_server.js');

/* GET home page. */
router.get('/configuracion_app', async function (req, res, next) {

    var escudo_portada;
    var ancho_escudo_portada;
    var alto_escudo_portada;
    var escudo_pantalla;
    var ancho_escudo_pantalla;
    var alto_escudo_pantalla;
 
    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaConfiguracionApp = new tabla_configuracion_app.TablaConfiguracionApp(db);
 
    var escudos = [];

    escudos.push('-- Seleccione Imagen --');

    const folder = path.join(__dirname, '../img_cliente');

    fs.readdir(folder, (err, files) => {

        files.forEach(file => {
            var file_enco = file;
            escudos.push(file_enco);
        });

    });

    await tablaConfiguracionApp.getByPrimaryIndex().then(stat2 => {

        if (stat2 == true) {

            escudo_portada = tablaConfiguracionApp.getEscudoPortada();
            ancho_escudo_portada = tablaConfiguracionApp.getAnchoEscudoPortada();
            alto_escudo_portada = tablaConfiguracionApp.getAltoEscudoPortada();

            escudo_pantalla = tablaConfiguracionApp.getEscudoPantallaPrincipal();
            ancho_escudo_pantalla = tablaConfiguracionApp.getAnchoEscudoPantallaPrincipal();
            alto_escudo_pantalla = tablaConfiguracionApp.getAltoEscudoPantallaPrincipal();
       }
        else {

            escudo_portada = "";
            ancho_escudo_portada = 40;
            alto_escudo_portada = 40;

            escudo_pantalla = "";
            ancho_escudo_pantalla = 40;
            alto_escudo_pantalla = 40;
        }

        campos = { escudos, escudo_portada, ancho_escudo_portada,alto_escudo_portada, escudo_pantalla, ancho_escudo_pantalla, alto_escudo_pantalla};

    }).then(reponse => {

        const fichero = "./frontend/static/css/index.css";

        var titulo_boton = "Grabar";
        var color_boton = rutinas.getStyle(fichero, ".clase_boton_modificacion");

        var content;
        fs.readFile('./views/configuracion_app.pug', async function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { titulo_boton, color_boton, campos: campos }));
        });
    });
});

router.post('/configuracion_app', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaConfiguracionApp = new tabla_configuracion_app.TablaConfiguracionApp(db);
 
    var escudo_portada = req.body.ESCUDO_PORTADA;
    var ancho_escudo_portada = req.body.ANCHO_ESCUDO_PORTADA;
    var alto_escudo_portada = req.body.ALTO_ESCUDO_PORTADA;
    var escudo_pantalla = req.body.ESCUDO_PANTALLA;
    var ancho_escudo_pantalla = req.body.ANCHO_ESCUDO_PANTALLA;
    var alto_escudo_pantalla = req.body.ALTO_ESCUDO_PANTALLA;

    var temporal = "temporal";

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = '';
    var errores = false;

    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
    fs.writeSync(fiche, descri_error, 0);
    fs.closeSync(fiche);

    if (errores == false) {

        var existe;

        await tablaConfiguracionApp.getByPrimaryIndex().then(stat2 => {

            if (stat2 == true) {
                existe = true;
            } else {
                existe = false;
            }

            tablaConfiguracionApp.registroBlanco();
            tablaConfiguracionApp.setUno();
            tablaConfiguracionApp.setEscudoPortada(escudo_portada);
            tablaConfiguracionApp.setAnchoEscudoPortada(ancho_escudo_portada);
            tablaConfiguracionApp.setAltoEscudoPortada(alto_escudo_portada);
            tablaConfiguracionApp.setEscudoPantallaPrincipal(escudo_pantalla);
            tablaConfiguracionApp.setAnchoEscudoPantallaPrincipal(ancho_escudo_pantalla);
            tablaConfiguracionApp.setAltoEscudoPantallaPrincipal(alto_escudo_pantalla);
            if (existe == true)
                tablaConfiguracionApp.updateRow();
            else
                tablaConfiguracionApp.insertRow();
        });

    }

    res.send('');

});

module.exports = router;
