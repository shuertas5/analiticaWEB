import Principal from "../views/client_principal.js";
import Manten_Tipos_Hojas from "../views/client_manten_tipos_hojas.js";
import Manten_Tipos_Hojas_Detalle from "../views/client_manten_tipos_hojas_detalle.js";
import Parametros_App from "../views/client_parametros_app.js";
import Configuracion_App from "../views/client_configuracion_app.js";
import Manten_Hojas from "../views/client_manten_hojas.js";
import Manten_Hojas_Detalle from "../views/client_manten_hojas_detalle.js";
import Manten_Lineas from "../views/client_manten_lineas.js";
import Manten_Lineas_Detalle from "../views/client_manten_lineas_detalle.js";
import Manten_Totales from "../views/client_manten_totales.js";
import Manten_Totales_Detalle from "../views/client_manten_totales_detalle.js";
import Manten_Adicionales from "../views/client_manten_adicionales.js";
import Manten_Adicionales_Detalle from "../views/client_manten_adicionales_detalle.js";
import Manten_Origenes_Diario from "../views/client_manten_origenes_diario.js";
import Manten_Origenes_Diario_Detalle from "../views/client_manten_origenes_diario_detalle.js";
import Mascaras_Cuentas from "../views/client_mascaras_cuentas.js";
import Importar_Movimientos from "../views/client_importar_movimientos.js";
import Sumar_Movimientos_Diario from "../views/client_sumar_movimientos_diario.js";
import Importar_Imagenes from "../views/client_importar_imagenes.js";
import Importar_Ficheros_Analitica from "../views/client_importar_ficheros_analitica.js";
import Reparto_Ppto_Hoja_Linea from "../views/client_reparto_ppto_hoja_linea.js";
import Reparto_Ppto_Hoja_Linea_Detalle from "../views/client_reparto_ppto_hoja_linea_detalle.js";
import Reparto_Ppto_Hojas from "../views/client_reparto_ppto_hojas.js";
import Reparto_Ppto_Hojas_Detalle from "../views/client_reparto_ppto_hojas_detalle.js";
import Reparto_Ppto_Global from "../views/client_reparto_ppto_global.js";
import Reparto_Ppto_Global_Detalle from "../views/client_reparto_ppto_global_detalle.js";
import Correcciones_Analiticas from "../views/client_correcciones_analiticas.js";
import Correcciones_Analiticas_Detalle from "../views/client_correcciones_analiticas_detalle.js";
import Introducir_Valores_Adicionales from "../views/client_introducir_valores_adicionales.js";
import Introducir_Valores_Adicionales_Detalle from "../views/client_introducir_valores_adicionales_detalle.js";
import Introducir_Valores_Presupuesto from "../views/client_introducir_valores_presupuesto.js";
import Introducir_Valores_Presupuesto_Detalle from "../views/client_introducir_valores_presupuesto_detalle.js";
import Treu_Impresion_Final from "../views/client_treu_impresion_final.js";
import Manten_Asignaciones from "../views/client_manten_asignaciones.js";
import Manten_Asignaciones_Detalle from "../views/client_manten_asignaciones_detalle.js";
import Manten_Notas_Ppto from "../views/client_manten_notas_ppto.js";
import Manten_Notas_Ppto_Detalle from "../views/client_manten_notas_ppto_detalle.js";
import Consulta_Analitica from "../views/client_consulta_analitica.js";
import Consulta_Presupuesto from "../views/client_consulta_presupuesto.js";
import Cargar_Importacion_Analitica from "../views/client_cargar_importacion_analitica.js";
import Imprimir_Presupuesto from "../views/client_imprimir_presupuesto.js";
import Imprimir_Analitica from "../views/client_imprimir_analitica.js";
import Imprimir_Analitica_Tramite from "../views/client_imprimir_analitica_en_tramite.js";
import Consulta_Analitica_Tramite from "../views/client_consulta_analitica_en_tramite.js";
import Calcular_Presupuesto from "../views/client_calcular_presupuesto.js";
import Generar_Aplicacion from "../views/client_generar_aplicacion.js";
import Borrados_Presupuestos from "../views/client_borrados_presupuestos.js";
import Duplicado_Hoja_Analitica from "../views/client_duplicado_hoja_analitica.js";
import Borrado_Hoja_Analitica from "../views/client_borrado_hoja_analitica.js";
import Calcular_Analitica from "../views/client_calcular_analitica.js";
import Borrado_Calculo_Analitica from "../views/client_borrado_calculo_analitica.js";
import Cierre_Calculo_Analitica from "../views/client_cierre_calculo_analitica.js";
import Reapertura_Cierre_Analitica from "../views/client_reapertura_cierre_analitica.js";
import Consulta_Historico_Analitica from "../views/client_consulta_historico_analitica.js";
import Imprimir_Historico_Analitica from "../views/client_imprimir_historico_analitica.js";
import Consulta_Historico_Presupuesto from "../views/client_consulta_historico_presupuesto.js";
import Imprimir_Historico_Presupuesto from "../views/client_imprimir_historico_presupuesto.js";
import Index from "../views/client_index.js";

var url = "";

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
}

const router = async () => {

    const routes = [
        { path: '/', view: Principal },
        { path: '/principal', view: Principal },
        { path: '/parametros_app', view: Parametros_App },
        { path: '/configuracion_app', view: Configuracion_App },
        { path: '/manten_tipos_hojas', view: Manten_Tipos_Hojas },
        { path: '/manten_tipos_hojas_detalle', view: Manten_Tipos_Hojas_Detalle },
        { path: '/manten_hojas', view: Manten_Hojas },
        { path: '/manten_hojas_detalle', view: Manten_Hojas_Detalle },
        { path: '/manten_lineas', view: Manten_Lineas },
        { path: '/manten_lineas_detalle', view: Manten_Lineas_Detalle },
        { path: '/manten_totales', view: Manten_Totales },
        { path: '/manten_totales_detalle', view: Manten_Totales_Detalle },
        { path: '/manten_adicionales', view: Manten_Adicionales },
        { path: '/manten_adicionales_detalle', view: Manten_Adicionales_Detalle },
        { path: '/manten_origenes_diario', view: Manten_Origenes_Diario },
        { path: '/manten_origenes_diario_detalle', view: Manten_Origenes_Diario_Detalle },
        { path: '/mascaras_cuentas', view: Mascaras_Cuentas },
        { path: '/importar_movimientos', view: Importar_Movimientos },
        { path: '/sumar_movimientos_diario', view: Sumar_Movimientos_Diario },
        { path: '/importar_imagenes', view: Importar_Imagenes },
        { path: '/importar_ficheros_analitica', view: Importar_Ficheros_Analitica },
        { path: '/reparto_ppto_hoja_linea', view: Reparto_Ppto_Hoja_Linea },
        { path: '/reparto_ppto_hoja_linea_detalle', view: Reparto_Ppto_Hoja_Linea_Detalle },
        { path: '/reparto_ppto_hojas', view: Reparto_Ppto_Hojas },
        { path: '/reparto_ppto_hojas_detalle', view: Reparto_Ppto_Hojas_Detalle },
        { path: '/reparto_ppto_global', view: Reparto_Ppto_Global },
        { path: '/reparto_ppto_global_detalle', view: Reparto_Ppto_Global_Detalle },
        { path: '/correcciones_analiticas', view: Correcciones_Analiticas },
        { path: '/correcciones_analiticas_detalle', view: Correcciones_Analiticas_Detalle },
        { path: '/introducir_valores_adicionales', view: Introducir_Valores_Adicionales },
        { path: '/introducir_valores_adicionales_detalle', view: Introducir_Valores_Adicionales_Detalle },
        { path: '/introducir_valores_presupuesto', view: Introducir_Valores_Presupuesto },
        { path: '/introducir_valores_presupuesto_detalle', view: Introducir_Valores_Presupuesto_Detalle },
        { path: '/treu_impresion_final', view: Treu_Impresion_Final },
        { path: '/manten_asignaciones', view: Manten_Asignaciones },
        { path: '/manten_asignaciones_detalle', view: Manten_Asignaciones_Detalle },
        { path: '/manten_notas_ppto', view: Manten_Notas_Ppto },
        { path: '/manten_notas_ppto_detalle', view: Manten_Notas_Ppto_Detalle },
        { path: '/consulta_analitica', view: Consulta_Analitica },
        { path: '/consulta_presupuesto', view: Consulta_Presupuesto },
        { path: '/cargar_importacion_analitica', view: Cargar_Importacion_Analitica },
        { path: '/imprimir_presupuesto', view: Imprimir_Presupuesto },
        { path: '/imprimir_analitica', view: Imprimir_Analitica },
        { path: '/imprimir_analitica_en_tramite', view: Imprimir_Analitica_Tramite },
        { path: '/consulta_analitica_en_tramite', view: Consulta_Analitica_Tramite },
        { path: '/calcular_presupuesto', view: Calcular_Presupuesto },
        { path: '/generar_aplicacion', view: Generar_Aplicacion },
        { path: '/borrados_presupuestos', view: Borrados_Presupuestos },
        { path: '/duplicado_hoja_analitica', view: Duplicado_Hoja_Analitica },
        { path: '/borrado_hoja_analitica', view: Borrado_Hoja_Analitica },
        { path: '/calcular_analitica', view: Calcular_Analitica },
        { path: '/borrado_calculo_analitica', view: Borrado_Calculo_Analitica },
        { path: '/cierre_calculo_analitica', view: Cierre_Calculo_Analitica },
        { path: '/reapertura_cierre_analitica', view: Reapertura_Cierre_Analitica },
        { path: '/consulta_historico_analitica', view: Consulta_Historico_Analitica },
        { path: '/imprimir_historico_analitica', view: Imprimir_Historico_Analitica },
        { path: '/consulta_historico_presupuesto', view: Consulta_Historico_Presupuesto },
        { path: '/imprimir_historico_presupuesto', view: Imprimir_Historico_Presupuesto },
        { path: '/index', view: Index },
    ];

    // Comprobar coincidencia de rutas con localizacion actual

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname == route.path
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        }
    }

    const view = new match.route.view();

    alert(url);

    document.querySelector('#app').innerHTML = await view.getHtml(url);

};

//window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {

    document.body.addEventListener('click', e => {

        if (e.target.matches('[data-link]')) {
            url = e.target.href;
            e.preventDefault();
            navigateTo(e.target.href);
        } else if (e.target.parentElement.matches('[data-link]')) {
            url = e.target.parentElement.href;
            e.preventDefault();
            navigateTo(e.target.parentElement.href);
        }

    });

    router();

});

/*window.onbeforeunload = function (e) {

    var e = e || window.event;

    // For IE and Firefox
    if (e) {
        e.returnValue = '';
    }

    // For Safari
    return '';

};*/
