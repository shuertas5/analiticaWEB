// --------------------------------------------------------------
// Servidor: Cargar Importacion Analitica
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_tipos_hojas = require('../tablas/tabla_tipos_hojas.js');
const tabla_totales = require('../tablas/tabla_totales.js');
const tabla_cifras = require('../tablas/tabla_cifras.js');
const tabla_cifras_extras = require('../tablas/tabla_cifras_extras.js');
const tabla_presupuesto = require('../tablas/tabla_presupuesto.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');
const ficheros_treu = require('../treu/treu_file.js');
const { TreuFile } = require('../treu/treu_file.js');

/* GET home page. */
router.get('/cargar_importacion_analitica', async function (req, res, next) {

    var rows = [];

    const fichero = "./frontend/static/css/index.css";
    var titulo_boton = "Cargar Ficheros Analitica";
    var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");
    var tipoformato = 1;

    var content;
    fs.readFile('./views/cargar_importacion_analitica.pug', function read(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        res.send(pug.render(content, { color_boton, titulo_boton, tipoformato, rows: rows }));
    });

});

router.post('/cargar_importacion_analitica', async function (req, res, next) {

    var retorno = "temporal";
    var conten = "";

    const acceso = require("./procedimientos_varios")
    var db = acceso.accesoDB(req.session.empresa);

    var stat;
    var formato_fiche = req.body.FORMATO_FICHEROS;

    var temporal = "temporal";
    var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
    fs.closeSync(fiche);

    var tablaHojas = new tabla_hojas.TablaHojas(db);
    var tablaLineas = new tabla_lineas.TablaLineas(db);
    var tablaTiposHojas = new tabla_tipos_hojas.TablaTiposHojas(db);
    var tablaTotales = new tabla_totales.TablaTotales(db);
    var tablaCifras = new tabla_cifras.TablaCifras(db);
    var tablaCifrasExtras = new tabla_cifras_extras.TablaCifrasExtras(db);
    var tablaPresupuesto = new tabla_presupuesto.TablaPresupuesto(db);

    // Grabamos el fichero de retorno.html

    var fiche = fs.openSync("./" + retorno + "/retorno.html", "w");

    conten = "";
    conten += "<br><p>";

    // --------------------------------------------------
    // Cargar Tabla de Hojas Analiticas
    // --------------------------------------------------

    var stat;
    var hoja;
    var titulohoja;
    var invisible;
    var hojaexterna;
    var tipohoja;

    tablaHojas.ejecutaSQL("DELETE FROM HOJAS").then(reto => {

        var contador;

        var fichero_hojas = new TreuFile("./importar_analitica/salida_hojas.txt");

        if (formato_fiche == '2') {
            fichero_hojas.setEncoding('latin1');
        }

        fichero_hojas.abrirFichero('r');
        fichero_hojas.setDelimitado(true);
        fichero_hojas.setAmericano(false);
        fichero_hojas.setComillas(true);

        contador = 0;

        stat = fichero_hojas.leerRegistro();

        while (stat == true) {

            hoja = fichero_hojas.valorNumero(1);
            hojaexterna = fichero_hojas.valorSerie(2);
            titulohoja = fichero_hojas.valorSerie(3);
            invisible = fichero_hojas.valorBoolean(4);
            tipohoja = fichero_hojas.valorSerie(5);

            tablaHojas.registroBlanco();
            tablaHojas.setHoja(hoja);
            tablaHojas.setHojaExterna(hojaexterna);
            tablaHojas.setTitulo(titulohoja);
            tablaHojas.setInvisible(invisible);
            tablaHojas.setTipoHoja(tipohoja);
            tablaHojas.insertRow();

            contador++;

            stat = fichero_hojas.leerRegistro();
        }

        fichero_hojas.cerrarFichero();

        conten += rutinas.acoplarseriehtml("Hojas Analiticas ", 20) + " ... " + formato.form('##.###', contador, "H") + " registros cargados<br>";

    }).then(retor => {

        // --------------------------------------------------
        // Cargar Tabla de Lineas Analiticas
        // --------------------------------------------------

        var linea;
        var titulolinea;
        var pasada_calculo;
        var intenso;
        var blanca;
        var condecimales;
        var conporcentaje;
        var hojaref;
        var linearef;
        var detotales;
        var estadistica;
        var lineainvisible;
        var caracter_blanco;
        var sumable;
        var tipo_acumulado;
        var no_acumulable;
        var reduccion_millares;
        var demargen;
        var dereparto;

        tablaLineas.ejecutaSQL("DELETE FROM LINEAS").then(reto => {

            var contador;

            var fichero_lineas = new TreuFile("./importar_analitica/salida_lineas.txt");

            if (formato_fiche == '2') {
                fichero_lineas.setEncoding('latin1');
            }
        
            fichero_lineas.abrirFichero('r');
            fichero_lineas.setDelimitado(true);
            fichero_lineas.setAmericano(false);
            fichero_lineas.setComillas(true);

            contador = 0;

            stat = fichero_lineas.leerRegistro();

            while (stat == true) {

                hoja = fichero_lineas.valorNumero(1);
                linea = fichero_lineas.valorNumero(2);
                titulolinea = fichero_lineas.valorSerie(3);
                pasada_calculo = fichero_lineas.valorNumero(4);
                intenso = fichero_lineas.valorBoolean(5);
                blanca = fichero_lineas.valorBoolean(6);
                condecimales = fichero_lineas.valorBoolean(7);
                conporcentaje = fichero_lineas.valorBoolean(8);
                hojaref = fichero_lineas.valorNumero(9);
                linearef = fichero_lineas.valorNumero(10);
                detotales = fichero_lineas.valorBoolean(11);
                estadistica = fichero_lineas.valorBoolean(12);
                lineainvisible = fichero_lineas.valorBoolean(13);
                sumable = fichero_lineas.valorBoolean(14);
                caracter_blanco = fichero_lineas.valorSerie(15);
                tipo_acumulado = fichero_lineas.valorNumero(16);
                no_acumulable = fichero_lineas.valorBoolean(17);
                reduccion_millares = fichero_lineas.valorBoolean(18);
                demargen = fichero_lineas.valorBoolean(19);
                dereparto = fichero_lineas.valorBoolean(20);

                tablaLineas.registroBlanco();
                tablaLineas.setHoja(hoja);
                tablaLineas.setLinea(linea);
                tablaLineas.setTitulo(titulolinea);
                tablaLineas.setPasadaCalculo(pasada_calculo);
                tablaLineas.setIntensa(intenso);
                tablaLineas.setBlanca(blanca);
                tablaLineas.setConDecimales(condecimales);
                tablaLineas.setConPorcentaje(conporcentaje);
                tablaLineas.setRefHoja(hojaref);
                tablaLineas.setRefLinea(linearef);
                tablaLineas.setDeTotales(detotales);
                tablaLineas.setEstadistica(estadistica);
                tablaLineas.setInvisible(lineainvisible);
                tablaLineas.setSumable(sumable);
                if (caracter_blanco.length > 0) {
                    tablaLineas.setCaracterBlanco(caracter_blanco[0]);
                }
                else {
                    tablaLineas.setCaracterBlanco('\0');
                }
                tablaLineas.setTipoAcumulado(tipo_acumulado);
                tablaLineas.setNoAcumulable(no_acumulable);
                tablaLineas.setReduccionAMillares(reduccion_millares);
                tablaLineas.setLineaDeMargen(demargen);
                tablaLineas.setLineaDeReparto(dereparto);
                tablaLineas.insertRow();

                contador++;

                stat = fichero_lineas.leerRegistro();
            }

            fichero_lineas.cerrarFichero();

            conten += rutinas.acoplarseriehtml("Lineas Analiticas ", 20) + " ... " + formato.form('##.###', contador, "H") + " registros cargados<br>";

        }).then(retor => {

            // --------------------------------------------------
            // Cargar Tabla de Tipos de Hojas Analiticas
            // --------------------------------------------------

            var tipo;
            var titulotipo;

            tablaTiposHojas.ejecutaSQL("DELETE FROM TIPOS_HOJAS").then(reto => {

                var contador;

                var fichero_tipos_hojas = new TreuFile("./importar_analitica/salida_tipos_hojas.txt");

                if (formato_fiche == '2') {
                    fichero_tipos_hojas.setEncoding('latin1');
                }
            
                fichero_tipos_hojas.abrirFichero('r');
                fichero_tipos_hojas.setDelimitado(true);
                fichero_tipos_hojas.setAmericano(false);
                fichero_tipos_hojas.setComillas(true);

                contador = 0;

                stat = fichero_tipos_hojas.leerRegistro();

                while (stat == true) {

                    tipo = fichero_tipos_hojas.valorSerie(1);
                    titulotipo = fichero_tipos_hojas.valorSerie(2);

                    tablaTiposHojas.registroBlanco();
                    tablaTiposHojas.setTipo(tipo);
                    tablaTiposHojas.setTitulo(titulotipo);
                    tablaTiposHojas.insertRow();

                    contador++;

                    stat = fichero_tipos_hojas.leerRegistro();
                }

                fichero_tipos_hojas.cerrarFichero();

                conten += rutinas.acoplarseriehtml("Tipos de Hojas", 20) + " ... " + formato.form('##.###', contador, "H") + " registros cargados<br>";

            }).then(retor => {

                // --------------------------------------------------
                // Cargar Tabla de Totales de Lineas
                // --------------------------------------------------

                var num_componentes;

                tablaTotales.ejecutaSQL("DELETE FROM TOTALES").then(reto => {

                    var fichero_totales_lineas = new TreuFile("./importar_analitica/salida_totales_lineas.txt");

                    fichero_totales_lineas.abrirFichero('r');
                    fichero_totales_lineas.setDelimitado(true);
                    fichero_totales_lineas.setAmericano(false);
                    fichero_totales_lineas.setComillas(true);

                    contador = 0;

                    stat = fichero_totales_lineas.leerRegistro();

                    while (stat == true) {

                        hoja = fichero_totales_lineas.valorNumero(1);
                        linea = fichero_totales_lineas.valorNumero(2);
                        num_componentes = fichero_totales_lineas.valorNumero(3);

                        var coeficientes = Array();
                        var hojascomp = Array();
                        var lineascomp = Array();
                        var mascomp = Array();

                        for (var i = 1; i <= num_componentes; i++) {
                            hojascomp.push(fichero_totales_lineas.valorNumero(4 + 4 * (i - 1)));
                            lineascomp.push(fichero_totales_lineas.valorNumero(5 + 4 * (i - 1)));
                            coeficientes.push(fichero_totales_lineas.valorNumero(6 + 4 * (i - 1)));
                            mascomp.push(fichero_totales_lineas.valorSerie(7 + 4 * (i - 1)));
                        }

                        tablaTotales.registroBlanco();
                        tablaTotales.setHoja(hoja);
                        tablaTotales.setLinea(linea);
                        tablaTotales.setNumComponentes(num_componentes);
                        tablaTotales.setHojasComponentes(num_componentes, hojascomp);
                        tablaTotales.setLineasComponentes(num_componentes, lineascomp);
                        tablaTotales.setCoeficientes(num_componentes, coeficientes);
                        tablaTotales.setMasComponentes(num_componentes, mascomp);
                        tablaTotales.insertRow();

                        contador++;

                        stat = fichero_totales_lineas.leerRegistro();
                    }

                    fichero_totales_lineas.cerrarFichero();

                    conten += rutinas.acoplarseriehtml("Totales de Lineas", 20) + " ... " + formato.form('##.###', contador, "H") + " registros cargados<br>";

                }).then(retor => {

                    // --------------------------------------------------
                    // Cargar Tabla de Cifras Analiticas
                    // --------------------------------------------------

                    var en_tramite;

                    tablaCifras.ejecutaSQL("DELETE FROM CIFRAS").then(reto => {

                        var contador;

                        var fichero_cifras = new TreuFile("./importar_analitica/salida_cifras.txt");

                        fichero_cifras.abrirFichero('r');
                        fichero_cifras.setDelimitado(true);
                        fichero_cifras.setAmericano(false);
                        fichero_cifras.setComillas(true);

                        contador = 0;

                        stat = fichero_cifras.leerRegistro();

                        while (stat == true) {

                            hoja = fichero_cifras.valorNumero(1);
                            linea = fichero_cifras.valorNumero(2);
                            en_tramite = fichero_cifras.valorNumero(27);

                            var cifras = Array();

                            for (var i = 1; i <= 24; i++) {
                                cifras.push(fichero_cifras.valorNumero(2 + i));
                            }

                            tablaCifras.registroBlanco();
                            tablaCifras.setHoja(hoja);
                            tablaCifras.setLinea(linea);
                            tablaCifras.setMesCalculo(en_tramite);
                            tablaCifras.setCifras(cifras);
                            tablaCifras.setCerrada(false);
                            tablaCifras.insertRow();

                            contador++;

                            stat = fichero_cifras.leerRegistro();
                        }

                        fichero_cifras.cerrarFichero();

                        conten += rutinas.acoplarseriehtml("Cifras Analiticas", 20) + " ... " + formato.form('##.###', contador, "H") + " registros cargados<br>";

                    }).then(retor => {

                        // --------------------------------------------------
                        // Cargar Tabla de Cifras Extras Analiticas
                        // --------------------------------------------------

                        tablaCifrasExtras.ejecutaSQL("DELETE FROM CIFRAS_EXT").then(reto => {

                            var contador;

                            var fichero_cifras_extras = new TreuFile("./importar_analitica/salida_cifras_extras.txt");

                            fichero_cifras_extras.abrirFichero('r');
                            fichero_cifras_extras.setDelimitado(true);
                            fichero_cifras_extras.setAmericano(false);
                            fichero_cifras_extras.setComillas(true);

                            contador = 0;

                            stat = fichero_cifras_extras.leerRegistro();

                            while (stat == true) {

                                hoja = fichero_cifras_extras.valorNumero(1);
                                linea = fichero_cifras_extras.valorNumero(2);
                                en_tramite = fichero_cifras_extras.valorNumero(27);

                                var cifras = Array();

                                for (var i = 1; i <= 24; i++) {
                                    cifras.push(fichero_cifras_extras.valorNumero(2 + i));
                                }

                                tablaCifrasExtras.registroBlanco();
                                tablaCifrasExtras.setHoja(hoja);
                                tablaCifrasExtras.setLinea(linea);
                                tablaCifrasExtras.setMesCalculo(en_tramite);
                                tablaCifrasExtras.setCifras(cifras);
                                tablaCifrasExtras.setCerrada(false);
                                tablaCifrasExtras.insertRow();

                                contador++;

                                stat = fichero_cifras_extras.leerRegistro();
                            }

                            fichero_cifras_extras.cerrarFichero();

                            conten += rutinas.acoplarseriehtml("Cifras Extras", 20) + " ... " + formato.form('##.###', contador, "H") + " registros cargados<br>";

                        }).then(retor => {

                            // --------------------------------------------------
                            // Cargar Tabla de Cifras Presupuesto
                            // --------------------------------------------------

                            tablaPresupuesto.ejecutaSQL("DELETE FROM PRESUPUESTO").then(reto => {

                                var acum_ppto;
                                var contador;

                                var fichero_cifras_ppto = new TreuFile("./importar_analitica/salida_cifras_ppto.txt");

                                fichero_cifras_ppto.abrirFichero('r');
                                fichero_cifras_ppto.setDelimitado(true);
                                fichero_cifras_ppto.setAmericano(false);
                                fichero_cifras_ppto.setComillas(true);

                                contador = 0;

                                stat = fichero_cifras_ppto.leerRegistro();

                                while (stat == true) {

                                    hoja = fichero_cifras_ppto.valorNumero(1);
                                    linea = fichero_cifras_ppto.valorNumero(2);
                                    acum_ppto = fichero_cifras_ppto.valorNumero(15);

                                    var cifras = Array();

                                    for (var i = 1; i <= 12; i++) {
                                        cifras.push(fichero_cifras_ppto.valorNumero(2 + i));
                                    }

                                    tablaPresupuesto.registroBlanco();
                                    tablaPresupuesto.setHoja(hoja);
                                    tablaPresupuesto.setLinea(linea);
                                    tablaPresupuesto.setCifras(cifras);
                                    tablaPresupuesto.setAcumulado(acum_ppto);
                                    tablaPresupuesto.insertRow();

                                    contador++;

                                    stat = fichero_cifras_ppto.leerRegistro();
                                }

                                fichero_cifras_ppto.cerrarFichero();

                                conten += rutinas.acoplarseriehtml("Cifras Presupuesto", 20) + " ... " + formato.form('##.###', contador, "H") + " registros cargados<br>";

                                conten += "<br><b>*** Importacion Terminada ***</b>";
                                conten += "<br></p>";

                                fs.writeSync(fiche, conten, 0);
                                fs.closeSync(fiche);

                                res.send('');

                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
