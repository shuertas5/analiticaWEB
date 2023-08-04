var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const tabla_configuracion_app = require('../tablas/tabla_configuracion_app.js');

/* GET home page. */
router.get('/principal', async function (req, res, next) {

    var escudo_pantalla;
    var ancho_escudo_pantalla;
    var alto_escudo_pantalla;

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var tablaConfiguracionApp = new tabla_configuracion_app.TablaConfiguracionApp(db);

    await tablaConfiguracionApp.getByPrimaryIndex().then(stat2 => {

        if (stat2 == true) {

            escudo_pantalla = tablaConfiguracionApp.getEscudoPantallaPrincipal();
            ancho_escudo_pantalla = tablaConfiguracionApp.getAnchoEscudoPantallaPrincipal();
            alto_escudo_pantalla = tablaConfiguracionApp.getAltoEscudoPantallaPrincipal();

        }
        else {
            escudo_pantalla = "";
            ancho_escudo_pantalla = 0;
            alto_escudo_pantalla = 0;
        }

        escudo_pantalla= '../img_cliente/'+escudo_pantalla;

    }).then(response => {

        var content;
        fs.readFile('./views/principal.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, {escudo_pantalla,ancho_escudo_pantalla,alto_escudo_pantalla}));
        });
    });
});

module.exports = router;