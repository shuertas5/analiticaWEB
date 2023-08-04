// --------------------------------------------------------------
// Servidor: Duplicado de Hoja Analitica
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_parametros_app = require('../tablas/tabla_parametros_app.js');
const tabla_lineas = require('../tablas/tabla_lineas.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_totales = require('../tablas/tabla_totales.js');
const tabla_cifras = require('../tablas/tabla_cifras.js');
const tabla_cifras_extras = require('../tablas/tabla_cifras_extras.js');
const tabla_presupuesto = require('../tablas/tabla_presupuesto.js');
const tabla_historico_cifras = require('../tablas/tabla_historico_cifras.js');
const tabla_historico_cifras_extras = require('../tablas/tabla_historico_cifras_extras.js');
const tabla_historico_presupuesto = require('../tablas/tabla_historico_presupuesto.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');

/* GET home page. */
router.get('/duplicado_hoja_analitica', async function (req, res, next) {

	const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
	const search_params = current_url.searchParams;

	var rows = [];

	const fichero = "./frontend/static/css/index.css";
	var titulo_boton = "Duplicar Hoja";
	var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

	var tipo_borrado = '0';
	var borrado = '1';

	var content;
	fs.readFile('./views/duplicado_hoja_analitica.pug', function read(err, data) {
		if (err) {
			throw err;
		}
		content = data;
		res.send(pug.render(content, { color_boton, titulo_boton, tipo_borrado, borrado, rows: rows }));
	});

});

router.post('/duplicado_hoja_analitica', async function (req, res, next) {

	const acceso = require("./procedimientos_varios")
	var db = acceso.accesoDB(req.session.empresa);

	var stat;

	var temporal = "temporal";
	var retorno = "temporal";

	var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
	fs.closeSync(fiche);

	fiche = fs.openSync("./" + retorno + "/retorno.html", "w");
	fs.closeSync(fiche);

	var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
	var tablaHojas = new tabla_hojas.TablaHojas(db);
	var tablaLineas = new tabla_lineas.TablaLineas(db);
	var tablaLineasCopia = new tabla_lineas.TablaLineas(db);
	var tablaPresupuesto = new tabla_presupuesto.TablaPresupuesto(db);
	var tablaTotales = new tabla_totales.TablaTotales(db);
	var tablaCifras = new tabla_cifras.TablaCifras(db);
	var tablaCifrasExtras = new tabla_cifras_extras.TablaCifrasExtras(db);
	var tablaHistoricoCifras = new tabla_historico_cifras.TablaHistoricoCifras(db);
	var tablaHistoricoCifrasExtras = new tabla_historico_cifras_extras.TablaHistoricoCifrasExtras(db);
	var tablaHistoricoPresupuesto = new tabla_historico_presupuesto.TablaHistoricoPresupuesto(db);

	var hoja_origen = req.body.HOJA_ORIGEN;
	var hoja_destino = req.body.HOJA_DESTINO;
	var copia_con_cifras = req.body.COPIA_CON_CIFRAS

	if (copia_con_cifras == undefined) {
		copia_con_cifras = false;
	}
	else {
		copia_con_cifras = true;
	}

	var descri_error = '';
	var errores = false;

	var linea;
	var titulo;
	var refhoja;
	var reflinea;
	var invisible;
	var pasadascalculo;
	var detotales;
	var intensa;
	var blanca;
	var sumable;
	var estadistica;
	var condecimales;
	var caracterblanco;
	var noacumulable;
	var conporcentaje;
	var reduccionamillares;
	var lineademargen;
	var lineadereparto;
	var tipo_acumulado;

	var nlineas;

	var anno_actu;

	var numcomponentes;
	var coeficientes = new Array(45);
	var hojascomp = new Array(45);
	var lineascomp = new Array(45);
	var mascomp = new Array(45);

	await tablaParametrosApp.getByPrimaryIndex().then(ret => {

		if (ret == true) {
			anno_actu = tablaParametrosApp.getAnnoEnCurso();
		}

	});

	await tablaHojas.getByPrimaryIndex(hoja_origen).then(sta => {

		if (sta == false) {
			descri_error += "-- Numero de Hoja Origen NO Existe.\r\n";
			errores = true;
		}

	});

	await tablaHojas.getByPrimaryIndex(hoja_destino).then(sta => {

		if (sta == false) {
			descri_error += "-- Numero de Hoja Destino NO Existe.\r\n";
			errores = true;
		}

	});

	if (hoja_destino == hoja_origen) {
		descri_error += "-- Numero de Hoja Origen ha de ser Diferente al destino.\r\n";
		errores = true;
	}

	if (errores == true) {
		fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
		fs.writeSync(fiche, descri_error, 0);
		fs.closeSync(fiche);
		res.send('');
	}
	else {

		retorno = "temporal";
		var conten = "";

		fiche = fs.openSync("./" + retorno + "/retorno.html", "w");

		tablaLineas.addFirstHoja(TablaSQL.TablaSQL.BTR_EQ, hoja_origen);

		await tablaLineas.open().then(async ret => {

			nlineas = 0;

			avance = 0;

			stat = tablaLineas.getFirst();

			while (stat == true) {

				linea = tablaLineas.getLinea();
				titulo = tablaLineas.getTitulo();
				refhoja = tablaLineas.getRefHoja();
				reflinea = tablaLineas.getRefLinea();
				invisible = tablaLineas.getInvisible();
				pasadascalculo = tablaLineas.getPasadaCalculo();
				detotales = tablaLineas.getDeTotales();
				intensa = tablaLineas.getIntensa();
				blanca = tablaLineas.getBlanca();
				sumable = tablaLineas.getSumable();
				estadistica = tablaLineas.getEstadistica();
				condecimales = tablaLineas.getConDecimales();
				caracterblanco = "" + tablaLineas.getCaracterBlanco();
				noacumulable = tablaLineas.getNoAcumulable();
				conporcentaje = tablaLineas.getConPorcentaje();
				reduccionamillares = tablaLineas.getReduccionAMillares();
				lineademargen = tablaLineas.getLineaDeMargen();
				lineadereparto = tablaLineas.getLineaDeReparto();
				tipo_acumulado = tablaLineas.getTipoAcumulado();

				if (refhoja == hoja_origen) {
					hojagrab = hoja_destino;
				}
				else {
					hojagrab = refhoja;
				}

				await tablaLineasCopia.getByPrimaryIndex(hoja_destino, linea).then(stat => {

					if (stat == false) {
						tablaLineasCopia.registroBlanco();
						tablaLineasCopia.setHoja(hoja_destino);
						tablaLineasCopia.setLinea(linea);
						tablaLineasCopia.setTitulo(titulo);
						tablaLineasCopia.setRefHoja(hojagrab);
						tablaLineasCopia.setRefLinea(reflinea);
						tablaLineasCopia.setInvisible(invisible);
						tablaLineasCopia.setPasadaCalculo(pasadascalculo);
						tablaLineasCopia.setDeTotales(detotales);
						tablaLineasCopia.setIntensa(intensa);
						tablaLineasCopia.setBlanca(blanca);
						tablaLineasCopia.setSumable(sumable);
						tablaLineasCopia.setEstadistica(estadistica);
						tablaLineasCopia.setConDecimales(condecimales);
						tablaLineasCopia.setCaracterBlanco(caracterblanco.charAt(0));
						tablaLineasCopia.setNoAcumulable(noacumulable);
						tablaLineasCopia.setConPorcentaje(conporcentaje);
						tablaLineasCopia.setReduccionAMillares(reduccionamillares);
						tablaLineasCopia.setLineaDeMargen(lineademargen);
						tablaLineasCopia.setLineaDeReparto(lineadereparto);
						tablaLineasCopia.setTipoAcumulado(tipo_acumulado);
						tablaLineasCopia.insertRow();
					}
					else {
						tablaLineasCopia.registroBlanco();
						tablaLineasCopia.setTitulo(titulo);
						tablaLineasCopia.setRefHoja(hojagrab);
						tablaLineasCopia.setRefLinea(reflinea);
						tablaLineasCopia.setInvisible(invisible);
						tablaLineasCopia.setPasadaCalculo(pasadascalculo);
						tablaLineasCopia.setDeTotales(detotales);
						tablaLineasCopia.setIntensa(intensa);
						tablaLineasCopia.setBlanca(blanca);
						tablaLineasCopia.setSumable(sumable);
						tablaLineasCopia.setEstadistica(estadistica);
						tablaLineasCopia.setConDecimales(condecimales);
						tablaLineasCopia.setCaracterBlanco(caracterblanco.charAt(0));
						tablaLineasCopia.setNoAcumulable(noacumulable);
						tablaLineasCopia.setConPorcentaje(conporcentaje);
						tablaLineasCopia.setReduccionAMillares(reduccionamillares);
						tablaLineasCopia.setLineaDeMargen(lineademargen);
						tablaLineasCopia.setLineaDeReparto(lineadereparto);
						tablaLineasCopia.setTipoAcumulado(tipo_acumulado);
						tablaLineasCopia.updateRow();
					}

					nlineas++;

				});

				if (detotales == true) {

					await tablaTotales.getByPrimaryIndex(hoja_origen, linea).then(async stat => {

						if (stat == true) {
							numcomponentes = tablaTotales.getNumComponentes();
							coeficientes = tablaTotales.getCoeficientes();
							hojascomp = tablaTotales.getHojasComponentes();
							lineascomp = tablaTotales.getLineasComponentes();
							mascomp = tablaTotales.getMasComponentes();
						}
						else {
							numcomponentes = 0;
							for (var i = 1; i <= 45; i++) {
								coeficientes[i-1] = 0.0;
								hojascomp[i-1] = 0;
								lineascomp[i-1] = 0;
								mascomp[i-1] = "+";
							}
						}

						for (var i = 1; i <= 45; i++) {
							if (hojascomp[i-1] == hoja_origen) hojascomp[i-1] = hoja_destino;
						}

						await tablaTotales.getByPrimaryIndex(hoja_destino, linea).then(sta => {

							if (sta == false) {
								tablaTotales.registroBlanco();
								tablaTotales.setHoja(hoja_destino);
								tablaTotales.setLinea(linea);
								tablaTotales.setNumComponentes(numcomponentes);
								tablaTotales.setCoeficientes(numcomponentes, coeficientes);
								tablaTotales.setHojasComponentes(numcomponentes, hojascomp);
								tablaTotales.setLineasComponentes(numcomponentes, lineascomp);
								tablaTotales.setMasComponentes(numcomponentes, mascomp);
								tablaTotales.insertRow();
							}
							else {
								tablaTotales.registroBlanco();
								tablaTotales.setNumComponentes(numcomponentes);
								tablaTotales.setCoeficientes(numcomponentes, coeficientes);
								tablaTotales.setHojasComponentes(numcomponentes, hojascomp);
								tablaTotales.setLineasComponentes(numcomponentes, lineascomp);
								tablaTotales.setMasComponentes(numcomponentes, mascomp);
								tablaTotales.updateRow();
							}
						});

					});
				}

				// Grabacion de las cifras

				if (copia_con_cifras == true) {

					// TablaCifras

					await tablaCifras.getByPrimaryIndex(hoja_origen, linea).then(async sta => {

						if (sta == true) {

							cifras = tablaCifras.getCifras();
							mescalculo = tablaCifras.getMesCalculo();
							cerrada = tablaCifras.getCerrada();

							await tablaCifras.getByPrimaryIndex(hoja_destino, linea).then(ret => {

								if (ret == false) {
									tablaCifras.registroBlanco();
									tablaCifras.setHoja(hoja_destino);
									tablaCifras.setLinea(linea);
									tablaCifras.setCifras(cifras);
									tablaCifras.setMesCalculo(mescalculo);
									tablaCifras.setCerrada(cerrada);
									tablaCifras.insertRow();
								}
								else {
									tablaCifras.registroBlanco();
									tablaCifras.setCifras(cifras);
									tablaCifras.setMesCalculo(mescalculo);
									tablaCifras.setCerrada(cerrada);
									tablaCifras.updateRow();
								}

							});

						}

					});

					// TablaCifrasExtras

					await tablaCifrasExtras.getByPrimaryIndex(hoja_origen, linea).then(async sta => {

						if (sta == true) {

							cifras = tablaCifrasExtras.getCifras();
							mescalculo = tablaCifrasExtras.getMesCalculo();
							cerrada = tablaCifrasExtras.getCerrada();

							await tablaCifrasExtras.getByPrimaryIndex(hoja_destino, linea).then(reto => {

								if (reto == false) {
									tablaCifrasExtras.registroBlanco();
									tablaCifrasExtras.setHoja(hoja_destino);
									tablaCifrasExtras.setLinea(linea);
									tablaCifrasExtras.setCifras(cifras);
									tablaCifrasExtras.setMesCalculo(mescalculo);
									tablaCifrasExtras.setCerrada(cerrada);
									tablaCifrasExtras.insertRow();
								}
								else {
									tablaCifrasExtras.registroBlanco();
									tablaCifrasExtras.setCifras(cifras);
									tablaCifrasExtras.setMesCalculo(mescalculo);
									tablaCifrasExtras.setCerrada(cerrada);
									tablaCifrasExtras.updateRow();
								}
							});

						}

					});

					// TablaPresupuesto

					await tablaPresupuesto.getByPrimaryIndex(hoja_origen, linea).then(async sta => {

						if (sta == true) {

							cifrasppto = tablaPresupuesto.getCifras();
							acumulado = tablaPresupuesto.getAcumulado();

							await tablaPresupuesto.getByPrimaryIndex(hoja_destino, linea).then(reto => {

								if (reto == false) {
									tablaPresupuesto.registroBlanco();
									tablaPresupuesto.setHoja(hoja_destino);
									tablaPresupuesto.setLinea(linea);
									tablaPresupuesto.setCifras(cifrasppto);
									tablaPresupuesto.setAcumulado(acumulado);
									tablaPresupuesto.insertRow();
								}
								else {
									tablaPresupuesto.registroBlanco();
									tablaPresupuesto.setCifras(cifrasppto);
									tablaPresupuesto.updateRow();
								}
							});

						}

					});

					var ann = anno_actu;

					for (var kk = ann - 1; kk >= ann - 40; kk--) {

						anno = kk;

						// TablaHistoricoCifras

						await tablaHistoricoCifras.getByPrimaryIndex(anno, hoja_origen, linea).then(async sta => {

							if (sta == true) {

								cifrascor = tablaHistoricoCifras.getCifras();

								await tablaHistoricoCifras.getByPrimaryIndex(anno, hoja_destino, linea).then(reto => {

									if (reto == false) {
										tablaHistoricoCifras.registroBlanco();
										tablaHistoricoCifras.setAnno(anno);
										tablaHistoricoCifras.setHoja(hoja_destino);
										tablaHistoricoCifras.setLinea(linea);
										tablaHistoricoCifras.setCifras(cifrascor);
										tablaHistoricoCifras.insertRow();
									}
									else {
										tablaHistoricoCifras.registroBlanco();
										tablaHistoricoCifras.setCifras(cifrascor);
										tablaHistoricoCifras.updateRow();
									}

								});
							}
						});

						// TablaCifrasExtras

						await tablaHistoricoCifrasExtras.getByPrimaryIndex(anno, hoja_origen, linea).then(async sta => {

							if (sta == true) {

								cifrascor = tablaHistoricoCifrasExtras.getCifras();

								await tablaHistoricoCifrasExtras.getByPrimaryIndex(anno, hoja_destino, linea).then(reto => {

									if (reto == false) {
										tablaHistoricoCifrasExtras.registroBlanco();
										tablaHistoricoCifrasExtras.setAnno(anno);
										tablaHistoricoCifrasExtras.setHoja(hoja_destino);
										tablaHistoricoCifrasExtras.setLinea(linea);
										tablaHistoricoCifrasExtras.setCifras(cifrascor);
										tablaHistoricoCifrasExtras.insertRow();
									}
									else {
										tablaHistoricoCifrasExtras.registroBlanco();
										tablaHistoricoCifrasExtras.setCifras(cifrascor);
										tablaHistoricoCifrasExtras.updateRow();
									}

								});

							}
						});

						// TablaPresupuesto

						await tablaHistoricoPresupuesto.getByPrimaryIndex(anno, hoja_origen, linea).then(async sta => {

							if (sta == true) {

								cifrasppto = tablaHistoricoPresupuesto.getCifras();
								acumulado = tablaHistoricoPresupuesto.getAcumulado();

								await tablaHistoricoPresupuesto.getByPrimaryIndex(anno, hoja_destino, linea).then(reto => {

									if (reto == false) {
										tablaHistoricoPresupuesto.registroBlanco();
										tablaHistoricoPresupuesto.setAnno(anno);
										tablaHistoricoPresupuesto.setHoja(hoja_destino);
										tablaHistoricoPresupuesto.setLinea(linea);
										tablaHistoricoPresupuesto.setCifras(cifrasppto);
										tablaHistoricoPresupuesto.setAcumulado(acumulado);
										tablaHistoricoPresupuesto.insertRow();
									}
									else {
										tablaHistoricoPresupuesto.registroBlanco();
										tablaHistoricoPresupuesto.setCifras(cifrasppto);
										tablaHistoricoPresupuesto.updateRow();
									}
								});
							}
						});

					}
				}

				avance++;

				stat = tablaLineas.getNext();
			}

		});

		conten += "<p style='color: red;'>Duplicado de la Hoja Realizado<p>";
		conten += "<p>Copiadas " + formato.form('###', nlineas, "H") + " lineas<p>";

		fs.writeSync(fiche, conten, 0);
		fs.closeSync(fiche);

		res.send('');
	}

});

module.exports = router;
