// --------------------------------------------------------------
// Servidor: Mascaras de cuentas
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_mascaras_cuentas = require('../tablas/tabla_mascaras_cuentas.js');
const rutinas = require('../treu/rutinas_server.js');

router.get('/mascaras_cuentas', async function (req, res, next) {

    var rows = [];
    var num_mascaras = 0;

    const acceso = require("./procedimientos_varios");
    var db = acceso.accesoDB(req.session.empresa);

    var tablaMascarasCuentas = new tabla_mascaras_cuentas.TablaMascarasCuentas(db);

    await tablaMascarasCuentas.getByPrimaryIndex().then(stat => {

        if (stat == true) {
            num_mascaras = tablaMascarasCuentas.getNumMascaras();
            rows = tablaMascarasCuentas.getMascaras();
        }
        else {
            num_mascaras = 0;
            rows = [];
        }

    });

    const fichero = "./frontend/static/css/index.css";
    const titulo_boton = "Grabar";
    const color_boton = rutinas.getStyle(fichero, ".clase_boton_modificacion");

    var content;
    fs.readFile('./views/mascaras_cuentas.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { titulo_boton, color_boton, num_mascaras: num_mascaras, rows: rows }));
    });

});

router.post('/mascaras_cuentas', async function (req, res, next) {

    const acceso = require("./procedimientos_varios")

    var db = acceso.accesoDB(req.session.empresa);

    var tablaMascarasCuentas = new tabla_mascaras_cuentas.TablaMascarasCuentas(db);

    var mascaras = [];

    var num_compo = req.body.num_compo;

    for (var i = 1; i <= num_compo; i++) {
        var masca = "MASCARA" + i;
        mascaras.push(req.body[masca]);
    }

    await tablaMascarasCuentas.getByPrimaryIndex().then(stat => {

        if (stat == false) {
            tablaMascarasCuentas.registroBlanco();
            tablaMascarasCuentas.setUno(1);
            tablaMascarasCuentas.setNumMascaras(num_compo);
            tablaMascarasCuentas.setMascaras(num_compo, mascaras);
            tablaMascarasCuentas.insertRow();
        }
        else {
            tablaMascarasCuentas.registroBlanco();
            tablaMascarasCuentas.setNumMascaras(num_compo);
            tablaMascarasCuentas.setMascaras(num_compo, mascaras);
            tablaMascarasCuentas.updateRow();
        }

    });

    res.send('');

});

module.exports = router;
