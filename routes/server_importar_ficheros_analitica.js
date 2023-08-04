// --------------------------------------------------------------
// Servidor: Importar Ficheros Analitica
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const path = require('path');
const rutinas = require('../treu/rutinas_server.js');
const rutinasf = require('../treu/formato.js');
const ficheros = require('../treu/treu_file.js');
const treu_file = require('../treu/treu_file.js');

const multer = require('multer');
var upload = multer({ dest: path.join(__dirname, '../importar_analitica') });

/* GET home page. */
router.get('/importar_ficheros_analitica', async function (req, res, next) {

    const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    // get url parameters
    const opcion = search_params.get('opcion');
    const filex = search_params.get('fichero');

    if (opcion == 'eliminar') {
        const folder = path.join(__dirname, '../importar_analitica');
        if (fs.existsSync(folder + "/" + filex)) {
            fs.unlinkSync(folder + "/" + filex);
        }
    }

    var rows = [];
    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Subir Fichero";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

    const folder = path.join(__dirname, '../importar_analitica');

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, 0777);
    }

    fs.readdir(folder, (err, files) => {

        files.forEach(file => {
            var dateCreated = (fs.statSync(folder + "/" + file).birthtime).toLocaleDateString();
            var sizeFile = rutinasf.form("##.###.###", fs.statSync(folder + "/" + file).size, "k") + " Bytes";
            var file_enco = encodeURIComponent(file);
            rows.push({ file, dateCreated, sizeFile, file_enco });
        });

        var content;
        fs.readFile('./views/importar_ficheros_analitica.pug', function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
            res.send(pug.render(content, { titulo_boton, color_boton, rows: rows }));
        });

    });

});

router.post('/importar_ficheros_analitica', upload.single('get_fichero'), async function (req, res, next) {

    var temporal = "temporal";
    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var descri_error = "";

    if (req.file != undefined) {

        var originalname = req.file.originalname;
        var camino = req.file.destination;

        fs.rename(req.file.path, camino + "/" + originalname, (err) => {
            if (err != null) console.log(err);
        });
        
    }
    else {
        descri_error += "-- Fichero No Existe\r\n";
        var fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
        fs.writeSync(fiche, descri_error, 0);
        fs.closeSync(fiche);
    }

    res.sendStatus(200);

});

module.exports = router;
