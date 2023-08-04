// --------------------------------------------------------------
// Servidor: Cierre Calculo Analitica
// --------------------------------------------------------------

var express = require('express');
var router = express.Router();
const fs = require('fs')
const pug = require('pug');
const TablaSQL = require('../tablas/TablaSQL');
const tabla_indicadores = require('../tablas/tabla_indicadores.js');
const tabla_hojas = require('../tablas/tabla_hojas.js');
const tabla_cifras = require('../tablas/tabla_cifras.js');
const tabla_cifras_extras = require('../tablas/tabla_cifras_extras.js');
const tabla_historico_cifras = require('../tablas/tabla_historico_cifras.js');
const tabla_historico_cifras_extras = require('../tablas/tabla_historico_cifras_extras.js');
const tabla_presupuesto = require('../tablas/tabla_presupuesto.js');
const tabla_historico_presupuesto = require('../tablas/tabla_historico_presupuesto.js');
const tabla_parametros_app = require('../tablas/tabla_parametros_app');
const tabla_adicionales_costes = require('../tablas/tabla_adicionales_costes.js');
const tabla_adicionales_correcciones = require('../tablas/tabla_adicionales_correcciones.js');
const tabla_adicionales_estadisticos = require('../tablas/tabla_adicionales_estadisticos.js');
const tabla_acumulados_estadisticos = require('../tablas/tabla_acumulados_estadisticos.js');
const tabla_correcciones_especiales = require('../tablas/tabla_correcciones_especiales');
const tabla_adicionales_costes_copia = require('../tablas/tabla_adic_costes_copia.js');
const tabla_adicionales_correcciones_copia = require('../tablas/tabla_adic_correcciones_copia.js');
const tabla_adicionales_estadisticos_copia = require('../tablas/tabla_adic_estadisticos_copia.js');
const tabla_acumulados_estadisticos_copia = require('../tablas/tabla_acum_estadisticos_copia.js');
const tabla_correcciones_especiales_copia = require('../tablas/tabla_correcciones_especiales_copia.js');
const tabla_diario_fichero = require('../tablas/tabla_diario_fichero.js');
const tabla_diario_copia = require('../tablas/tabla_diario_copia.js');
const rutinas = require('../treu/rutinas_server.js');
const formato = require('../treu/formato.js');
const fecha = require('../treu/forfecha.js');

/* GET home page. */
router.get('/cierre_calculo_analitica', async function (req, res, next) {

	const current_url = new URL(req.protocol + "://" + req.get('host') + req.originalUrl);
	const search_params = current_url.searchParams;

	var rows = [];

	const fichero = "./frontend/static/css/index.css";
	var titulo_boton = "Cierre Analítica";
	var color_boton = rutinas.getStyle(fichero, ".clase_boton_alta");

	var content;
	fs.readFile('./views/cierre_calculo_analitica.pug', function read(err, data) {
		if (err) {
			throw err;
		}
		content = data;
		res.send(pug.render(content, { color_boton, titulo_boton, rows: rows }));
	});

});

router.post('/cierre_calculo_analitica', async function (req, res, next) {

	const acceso = require("./procedimientos_varios")
	var db = acceso.accesoDB(req.session.empresa);

	var stat;

	var tablaHojas = new tabla_hojas.TablaHojas(db);
	var tablaIndicadores = new tabla_indicadores.TablaIndicadores(db);
	var tablaCifras = new tabla_cifras.TablaCifras(db);
	var tablaCifrasExtras = new tabla_cifras_extras.TablaCifrasExtras(db);
	var tablaHistoricoCifras = new tabla_historico_cifras.TablaHistoricoCifras(db);
	var tablaHistoricoCifrasExtras = new tabla_historico_cifras_extras.TablaHistoricoCifrasExtras(db);
	var tablaParametrosApp = new tabla_parametros_app.TablaParametrosApp(db);
	var tablaPresupuesto = new tabla_presupuesto.TablaPresupuesto(db);
	var tablaHistoricoPresupuesto = new tabla_historico_presupuesto.TablaHistoricoPresupuesto(db);
	var tablaAdicionalesCostes = new tabla_adicionales_costes.TablaAdicionalesCostes(db);
	var tablaAdicionalesCorrecciones = new tabla_adicionales_correcciones.TablaAdicionalesCorrecciones(db);
	var tablaAdicionalesEstadisticos = new tabla_adicionales_estadisticos.TablaAdicionalesEstadisticos(db);
	var tablaAcumuladosEstadisticos = new tabla_acumulados_estadisticos.TablaAcumuladosEstadisticos(db);
	var tablaCorreccionesEspeciales = new tabla_correcciones_especiales.TablaCorreccionesEspeciales(db);
	var tablaAdicionalesCostesCopia = new tabla_adicionales_costes_copia.TablaAdicCostesCopia(db);
	var tablaAdicionalesCorreccionesCopia = new tabla_adicionales_correcciones_copia.TablaAdicCorreccionesCopia(db);
	var tablaAdicionalesEstadisticosCopia = new tabla_adicionales_estadisticos_copia.TablaAdicEstadisticosCopia(db);
	var tablaAcumuladosEstadisticosCopia = new tabla_acumulados_estadisticos_copia.TablaAcumEstadisticosCopia(db);
	var tablaCorreccionesEspecialesCopia = new tabla_correcciones_especiales_copia.TablaCorreccionesEspecialesCopia(db);
	var tablaDiarioFichero = new tabla_diario_fichero.TablaDiarioFichero(db);
	var tablaDiarioCopia = new tabla_diario_copia.TablaDiarioCopia(db);

	var temporal = "temporal";
	var fiche = fs.openSync("./" + temporal + "/errores.txt", "w");
	fs.closeSync(fiche);

	// Grabamos el fichero de retorno.txt

	var retorno = "temporal";
	var conten = "";

	var descri_error = '';
	var errores = false;

	var indicadorA;
	var indicadorB;
	var indicadorK;
	var indicadorD;
	var indicadorL;

	await tablaIndicadores.getByPrimaryIndex(4).then(reto => {
		indicadorB = tablaIndicadores.getEncendido();
	});

	await tablaIndicadores.getByPrimaryIndex(3).then(reto => {
		indicadorA = tablaIndicadores.getEncendido();
	});

	await tablaIndicadores.getByPrimaryIndex(6).then(reto => {
		indicadorK = tablaIndicadores.getEncendido();
	});

	await tablaIndicadores.getByPrimaryIndex(5).then(reto => {
		indicadorD = tablaIndicadores.getEncendido();
	});

	await tablaIndicadores.getByPrimaryIndex(2).then(reto => {
		indicadorL = tablaIndicadores.getEncendido();
	});

	errores = false;

	if (indicadorL == true) {
		descri_error += "  -  Cierre No permitido. Analitica Limpiandose.\r\n";
		errores = true;
	}

	/*if (indicadorA == true) {
		descri_error += "  -  Cierre No permitido. Analitica Abriendose.\r\n";
		errores = true;
	}*/

	if (indicadorK == true) {
		descri_error += "  -  Cierre No permitido. Reapertura Analitica en Tramite.\r\n";
		errores = true;
	}

	if (indicadorD == false) {
		descri_error += "  -  Cierre No permitido. Analítica No Calculada.\r\n";
		errores = true;
	}

	if (indicadorB == true) {
		descri_error += "  -  Cierre No permitido. Cálculo Analitico A Medias.\r\n";
		errores = true;
	}

	if (errores == true) {
		fiche = fs.openSync("./" + temporal + "/errores.txt", "w")
		fs.writeSync(fiche, descri_error, 0);
		fs.closeSync(fiche);
		res.send('');
	}
	else {

		var num = 0;

		retorno = "temporal";
		var conten = "";

		var cifrasanno = new Array(12);
		var cifras = new Array(24);

		// Fijacion de los indicadores al Inicio del proceso

		await tablaIndicadores.getByPrimaryIndex(1).then(reto => {   // Indicador C
			tablaIndicadores.setEncendido(true);
			tablaIndicadores.updateRow(1);
		});

		var hoja;
		var linea;

		// -----------------------------------------
		// Proceso de Cierre de la Analitica
		// -----------------------------------------

		var num = 0;

		var mes_actu;
		var anno_actu;
		var tituloempresa;

		await tablaParametrosApp.getByPrimaryIndex().then(sta => {
			if (sta == true) {
				tituloempresa = tablaParametrosApp.getTituloEmpresa();
				mes_actu = tablaParametrosApp.getMesEnCurso();
				anno_actu = tablaParametrosApp.getAnnoEnCurso();
			}
			else {
				tituloempresa = "";
				mes_actu = 1;
				anno_actu = 2022;
			}
		});

		// Parte Cierre de lineas

		if (indicadorA == false) {

			if (mes_actu == 12) {

				await tablaHistoricoCifras.borrarAnno(anno_actu);

				tablaCifras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
				tablaCifras.setOrdenBy('HOJA,LINEA');

				await tablaCifras.open().then(reto => {

					stat = tablaCifras.getFirst();

					while (stat == true) {

						hoja = tablaCifras.getHoja();
						linea = tablaCifras.getLinea();
						cifras = tablaCifras.getCifras();
						for (i = 1; i <= 12; i++) {
							cifrasanno[i - 1] = cifras[12 + i - 1];
						}

						tablaHistoricoCifras.registroBlanco();
						tablaHistoricoCifras.setAnno(anno_actu);
						tablaHistoricoCifras.setHoja(hoja);
						tablaHistoricoCifras.setLinea(linea);
						tablaHistoricoCifras.setCifras(cifrasanno);
						tablaHistoricoCifras.insertRow();

						num++;

						stat = tablaCifras.getNext();
					}
				});

				await tablaHistoricoCifrasExtras.borrarAnno(anno_actu);

				tablaCifrasExtras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
				tablaCifrasExtras.setOrdenBy('HOJA,LINEA');

				await tablaCifrasExtras.open().then(reto => {

					stat = tablaCifrasExtras.getFirst();

					while (stat == true) {

						hoja = tablaCifrasExtras.getHoja();
						linea = tablaCifrasExtras.getLinea();
						cifras = tablaCifrasExtras.getCifras();
						for (i = 1; i <= 12; i++) {
							cifrasanno[i - 1] = cifras[12 + i - 1];
						}

						tablaHistoricoCifrasExtras.registroBlanco();
						tablaHistoricoCifrasExtras.setAnno(anno_actu);
						tablaHistoricoCifrasExtras.setHoja(hoja);
						tablaHistoricoCifrasExtras.setLinea(linea);
						tablaHistoricoCifrasExtras.setCifras(cifrasanno);
						tablaHistoricoCifrasExtras.insertRow();

						num++;

						stat = tablaCifrasExtras.getNext();
					}
				});

			}

			// Grabar Historico de Presupuesto 

			if (mes_actu == 8) {

				await tablaHistoricoPresupuesto.borrarAnno(anno_actu);

				tablaPresupuesto.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
				tablaPresupuesto.setOrdenBy('HOJA,LINEA');

				await tablaPresupuesto.open().then(reto => {

					stat = tablaPresupuesto.getFirst();

					while (stat == true) {

						hoja = tablaPresupuesto.getHoja();
						linea = tablaPresupuesto.getLinea();
						cifras = tablaPresupuesto.getCifras();
						for (i = 1; i <= 12; i++) {
							cifrasanno[i - 1] = cifras[i - 1];
						}
						acumulado = tablaPresupuesto.getAcumulado();

						tablaHistoricoPresupuesto.registroBlanco();
						tablaHistoricoPresupuesto.setAnno(anno_actu);
						tablaHistoricoPresupuesto.setHoja(hoja);
						tablaHistoricoPresupuesto.setLinea(linea);
						tablaHistoricoPresupuesto.setCifras(cifrasanno);
						tablaHistoricoPresupuesto.setAcumulado(acumulado);
						tablaHistoricoPresupuesto.insertRow();

						num++;

						stat = tablaPresupuesto.getNext();
					}

				});

			}

			// Cerrar el Mes

			tablaCifras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
			tablaCifras.setOrdenBy('HOJA,LINEA');

			await tablaCifras.open().then(reto => {

				stat = tablaCifras.getFirst();

				while (stat == true) {

					hoja = tablaCifras.getHoja();
					linea = tablaCifras.getLinea();

					cerrada = tablaCifras.getCerrada();
					mescalculo = tablaCifras.getMesCalculo();
					cifras = tablaCifras.getCifras();
					for (i = 1; i <= 23; i++) {
						cifras[i - 1] = cifras[i + 1 - 1];
					}
					cifras[23] = mescalculo;

					if (cerrada == false) {
						tablaCifras.registroBlanco();
						tablaCifras.setCifras(cifras);
						tablaCifras.setMesCalculo(0.0);
						tablaCifras.setCerrada(true);
						tablaCifras.updateRow(hoja, linea);
					}

					num++;

					stat = tablaCifras.getNext();
				}

			});

			tablaCifrasExtras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
			tablaCifrasExtras.setOrdenBy('HOJA,LINEA');

			await tablaCifrasExtras.open().then(reto => {

				stat = tablaCifrasExtras.getFirst();

				while (stat == true) {

					hoja = tablaCifrasExtras.getHoja();
					linea = tablaCifrasExtras.getLinea();

					cerrada = tablaCifrasExtras.getCerrada();
					mescalculo = tablaCifrasExtras.getMesCalculo();
					cifras = tablaCifrasExtras.getCifras();
					for (i = 1; i <= 23; i++) {
						cifras[i - 1] = cifras[i + 1 - 1];
					}
					cifras[23] = mescalculo;

					if (cerrada == false) {
						tablaCifrasExtras.registroBlanco();
						tablaCifrasExtras.setCifras(cifras);
						tablaCifrasExtras.setMesCalculo(0.0);
						tablaCifrasExtras.setCerrada(true);
						tablaCifrasExtras.updateRow(hoja, linea);
					}

					num++;

					stat = tablaCifrasExtras.getNext();
				}
			});

			// Copiar Datos a Ficheros de Copia

			tablaDiarioCopia.ejecutaSQL("DELETE FROM DIARIO_COPIA");
			tablaAdicionalesCostesCopia.ejecutaSQL("DELETE FROM ADIC_COSTES_COPIA");
			tablaAdicionalesCorreccionesCopia.ejecutaSQL("DELETE FROM ADIC_CORRECCIONES_COPIA");
			tablaAdicionalesEstadisticosCopia.ejecutaSQL("DELETE FROM ADIC_ESTADISTICOS_COPIA");
			tablaAcumuladosEstadisticosCopia.ejecutaSQL("DELETE FROM ACUM_ESTADISTICOS_COPIA");
			tablaCorreccionesEspecialesCopia.ejecutaSQL("DELETE FROM CORRECCIONES_ESPECIALES_COPIA");

			tablaDiarioFichero.addFirstCuenta(TablaSQL.TablaSQL.BTR_NOT_EQ, "");
			tablaDiarioFichero.setOrdenBy("CUENTA,SUBCUENTA");

			await tablaDiarioFichero.open().then(reto => {

				stat = tablaDiarioFichero.getFirst();

				while (stat == true) {

					origen = tablaDiarioFichero.getOrigen();
					secuen = tablaDiarioFichero.getSecuencia();
					cuenta = tablaDiarioFichero.getCuenta();
					subcuenta = tablaDiarioFichero.getSubCuenta();
					fechax = tablaDiarioFichero.getFecha();
					referencia = tablaDiarioFichero.getReferencia();
					importe = tablaDiarioFichero.getImporte();
					signo = tablaDiarioFichero.getSigno();
					descripcion = tablaDiarioFichero.getDescripcion();

					tablaDiarioCopia.registroBlanco();
					tablaDiarioCopia.setOrigen(origen);
					tablaDiarioCopia.setSecuencia(secuen);
					tablaDiarioCopia.setCuenta(cuenta);
					tablaDiarioCopia.setSubCuenta(subcuenta);
					tablaDiarioCopia.setFecha(fecha.forfecha("B",fechax,""));
					tablaDiarioCopia.setReferencia(referencia);
					tablaDiarioCopia.setImporte(importe);
					tablaDiarioCopia.setSigno(signo);
					tablaDiarioCopia.setDescripcion(descripcion);
					tablaDiarioCopia.insertRow();

					num++;

					stat = tablaDiarioFichero.getNext();
				}

			});

			tablaAdicionalesCostes.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
			tablaAdicionalesCostes.setOrdenBy('INDICE');

			await tablaAdicionalesCostes.open().then(reto => {

				stat = tablaAdicionalesCostes.getFirst();

				while (stat == true) {

					indice = tablaAdicionalesCostes.getIndice();
					importe = tablaAdicionalesCostes.getImporte();

					tablaAdicionalesCostesCopia.registroBlanco();
					tablaAdicionalesCostesCopia.setIndice(indice);
					tablaAdicionalesCostesCopia.setImporte(importe);
					tablaAdicionalesCostesCopia.insertRow();

					num++;

					stat = tablaAdicionalesCostes.getNext();
				}

			});

			tablaAdicionalesCorrecciones.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
			tablaAdicionalesCorrecciones.setOrdenBy('INDICE');

			await tablaAdicionalesCorrecciones.open().then(reto => {

				stat = tablaAdicionalesCorrecciones.getFirst();

				while (stat == true) {

					indice = tablaAdicionalesCorrecciones.getIndice();
					importe = tablaAdicionalesCorrecciones.getImporte();

					tablaAdicionalesCorreccionesCopia.registroBlanco();
					tablaAdicionalesCorreccionesCopia.setIndice(indice);
					tablaAdicionalesCorreccionesCopia.setImporte(importe);
					tablaAdicionalesCorreccionesCopia.insertRow();

					num++;

					stat = tablaAdicionalesCorrecciones.getNext();
				}

			});

			tablaAdicionalesEstadisticos.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
			tablaAdicionalesEstadisticos.setOrdenBy('INDICE');

			await tablaAdicionalesEstadisticos.open().then(reto => {

				stat = tablaAdicionalesEstadisticos.getFirst();

				while (stat == true) {

					indice = tablaAdicionalesEstadisticos.getIndice();
					importe = tablaAdicionalesEstadisticos.getImporte();

					tablaAdicionalesEstadisticosCopia.registroBlanco();
					tablaAdicionalesEstadisticosCopia.setIndice(indice);
					tablaAdicionalesEstadisticosCopia.setImporte(importe);
					tablaAdicionalesEstadisticosCopia.insertRow();

					num++;

					stat = tablaAdicionalesEstadisticos.getNext();
				}

			});

			tablaCorreccionesEspeciales.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
			tablaCorreccionesEspeciales.setOrdenBy("INDICE");

			await tablaCorreccionesEspeciales.open().then(reto => {

				stat = tablaCorreccionesEspeciales.getFirst();

				while (stat == true) {

					indice = tablaCorreccionesEspeciales.getIndice();
					importe = tablaCorreccionesEspeciales.getImporte();
					hoja = tablaCorreccionesEspeciales.getHoja();
					linea = tablaCorreccionesEspeciales.getLinea();
					causa = tablaCorreccionesEspeciales.getCausa();

					tablaCorreccionesEspecialesCopia.registroBlanco();
					tablaCorreccionesEspecialesCopia.setIndice(indice);
					tablaCorreccionesEspecialesCopia.setImporte(importe);
					tablaCorreccionesEspecialesCopia.setHoja(hoja);
					tablaCorreccionesEspecialesCopia.setLinea(linea);
					tablaCorreccionesEspecialesCopia.setCausa(causa);
					tablaCorreccionesEspecialesCopia.insertRow();

					num++;

					stat = tablaCorreccionesEspeciales.getNext();
				}

			});

			tablaAcumuladosEstadisticos.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
			tablaAcumuladosEstadisticos.setOrdenBy("INDICE");

			await tablaAcumuladosEstadisticos.open().then(reto => {

				stat = tablaAcumuladosEstadisticos.getFirst();

				while (stat == true) {

					indice = tablaAcumuladosEstadisticos.getIndice();
					hoja = tablaAcumuladosEstadisticos.getHoja();
					linea = tablaAcumuladosEstadisticos.getLinea();
					importe = tablaAcumuladosEstadisticos.getImporte();

					tablaAcumuladosEstadisticosCopia.registroBlanco();
					tablaAcumuladosEstadisticosCopia.setIndice(indice);
					tablaAcumuladosEstadisticosCopia.setHoja(hoja);
					tablaAcumuladosEstadisticosCopia.setLinea(linea);
					tablaAcumuladosEstadisticosCopia.setImporte(importe);
					tablaAcumuladosEstadisticosCopia.insertRow();

					num++;

					stat = tablaAcumuladosEstadisticos.getNext();
				}
			});

			// Fijacion de los indicadores al final del proceso

			await tablaIndicadores.getByPrimaryIndex(1).then(reto => {    // Indicador C
				tablaIndicadores.registroBlanco();
				tablaIndicadores.setEncendido(false);
				tablaIndicadores.updateRow(1);
			});

			await tablaIndicadores.getByPrimaryIndex(3).then(reto => { // Indicador A
				tablaIndicadores.registroBlanco();
				tablaIndicadores.setEncendido(true);
				tablaIndicadores.updateRow(3);
			});

		}

		// ----------------------------------------------
		// Abrir la Analitica para el siguiente mes
		// ----------------------------------------------

		tablaCifras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
		tablaCifras.setOrdenBy('HOJA,LINEA');

		await tablaCifras.open().then(reto => {

			stat = tablaCifras.getFirst();

			while (stat == true) {

				hoja = tablaCifras.getHoja();
				linea = tablaCifras.getLinea();

				tablaCifras.registroBlanco();
				tablaCifras.setCerrada(false);
				tablaCifras.updateRow(hoja, linea);

				num++;

				stat = tablaCifras.getNext();
			}

		});

		tablaCifrasExtras.addFirstHoja(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
		tablaCifrasExtras.setOrdenBy('HOJA,LINEA');

		await tablaCifrasExtras.open().then(reto => {

			stat = tablaCifrasExtras.getFirst();

			while (stat == true) {

				hoja = tablaCifrasExtras.getHoja();
				linea = tablaCifrasExtras.getLinea();

				tablaCifrasExtras.registroBlanco();
				tablaCifrasExtras.setCerrada(false);
				tablaCifrasExtras.updateRow(hoja, linea);

				num++;

				stat = tablaCifrasExtras.getNext();
			}

		});

		tablaDiarioFichero.ejecutaSQL("DELETE FROM DIARIO_FICHERO");
		tablaCorreccionesEspeciales.ejecutaSQL("DELETE FROM CORRECCIONES_ESPE");

		tablaAdicionalesCostes.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
		tablaAdicionalesCostes.setOrdenBy("INDICE");

		await tablaAdicionalesCostes.open().then(reto => {

			stat = tablaAdicionalesCostes.getFirst();

			while (stat == true) {

				var indice = tablaAdicionalesCostes.getIndice();

				tablaAdicionalesCostes.registroBlanco();
				tablaAdicionalesCostes.setImporte(0.0);
				tablaAdicionalesCostes.setGrabada(false);
				tablaAdicionalesCostes.updateRow(indice);

				num++;

				stat = tablaAdicionalesCostes.getNext();
			}
		});

		tablaAdicionalesCorrecciones.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
		tablaAdicionalesCorrecciones.setOrdenBy("INDICE");

		await tablaAdicionalesCorrecciones.open().then(reto => {

			stat = tablaAdicionalesCorrecciones.getFirst();

			while (stat == true) {

				var indice = tablaAdicionalesCorrecciones.getIndice();

				tablaAdicionalesCorrecciones.registroBlanco();
				tablaAdicionalesCorrecciones.setImporte(0.0);
				tablaAdicionalesCorrecciones.setGrabada(false);
				tablaAdicionalesCorrecciones.updateRow(indice);

				num++;

				stat = tablaAdicionalesCorrecciones.getNext();
			}
		});

		tablaAdicionalesEstadisticos.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
		tablaAdicionalesEstadisticos.setOrdenBy("INDICE");

		await tablaAdicionalesEstadisticos.open().then(reto => {

			stat = tablaAdicionalesEstadisticos.getFirst();

			while (stat == true) {

				var indice = tablaAdicionalesEstadisticos.getIndice();

				tablaAdicionalesEstadisticos.registroBlanco();
				tablaAdicionalesEstadisticos.setImporte(0.0);
				tablaAdicionalesEstadisticos.setGrabada(false);
				tablaAdicionalesEstadisticos.updateRow(indice);

				num++;

				stat = tablaAdicionalesEstadisticos.getNext();
			}
		});

		tablaAcumuladosEstadisticos.addFirstIndice(TablaSQL.TablaSQL.BTR_NOT_EQ, 0);
		tablaAcumuladosEstadisticos.setOrdenBy("INDICE");

		await tablaAcumuladosEstadisticos.open().then(reto => {

			stat = tablaAcumuladosEstadisticos.getFirst();

			while (stat == true) {

				var indice = tablaAcumuladosEstadisticos.getIndice();

				tablaAcumuladosEstadisticos.registroBlanco();
				tablaAcumuladosEstadisticos.setImporte(0.0);
				tablaAcumuladosEstadisticos.setGrabada(false);
				tablaAcumuladosEstadisticos.updateRow(indice);

				num++;

				stat = tablaAcumuladosEstadisticos.getNext();
			}

		});

		mes = mes_actu;
		anno = anno_actu;

		mes++;
		if (mes > 12) {
			mes = 1;
			anno++;
		}

		// Fijacion de los indicadores al final del proceso

		await tablaParametrosApp.startTransaccion();

		await tablaParametrosApp.getByPrimaryIndex().then(sta => {
			if (sta == true) {
				tablaParametrosApp.registroBlanco();
				tablaParametrosApp.setAnnoEnCurso(anno);
				tablaParametrosApp.setMesEnCurso(mes);
				tablaParametrosApp.updateRow();
			}
		});

		await tablaIndicadores.getByPrimaryIndex(5).then(reto => {  // Indicador D
			tablaIndicadores.registroBlanco();
			tablaIndicadores.setEncendido(false);
			tablaIndicadores.updateRow(5);
		});

		await tablaIndicadores.getByPrimaryIndex(3).then(reto => {  // Indicador A
			tablaIndicadores.registroBlanco();
			tablaIndicadores.setEncendido(false);
			tablaIndicadores.updateRow(3);
		});

		await tablaParametrosApp.endTransaccion();

		conten += "<p style='color: red;'>Se ha Cerrado la Analítica Correctamente</p>";
		conten += "<p>Datos de " + formato.form('###.###.###', num, "") + " Lineas Cerradas</p>";

		fiche = fs.openSync("./" + retorno + "/retorno.html", "w");
		fs.writeSync(fiche, conten, 0);
		fs.closeSync(fiche);

		res.send('');
	}

});

module.exports = router;
