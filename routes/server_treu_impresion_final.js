// --------------------------------------------------------------
// Servidor: Previsualizacion Impresion
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const rutinas = require('../treu/rutinas_server.js');

/* GET home page. */
router.get('/treu_impresion_final', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    // get url parameters
    const id_fichero = search_params.get('id_fichero');
    var retornar = search_params.get('retornar');
    var aprevis = search_params.get('aprevis');
    var aprevis_pdf = search_params.get('aprevis_pdf');
    var valor = 1;

    var stats = fs.statSync(id_fichero);
    var fileSizeInBytes = stats.size;

    if (fileSizeInBytes > 10) {

        var content;
        fs.readFile('./views/treu_impresion_final.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { id_fichero, valor, retornar, aprevis, aprevis_pdf }));
        });
        
    }
    else {
        res.send('');
    }
    
});

module.exports = router;
