/* -------------------------------------------------------------------------
   Bifurcaciones en la Impresion de Documentos
   -------------------------------------------------------------------------
*/

function treu_impresion_bifurcaciones() {

    if ($('#treu_impresion_encargo_trabajo').val()=='imprimir_datos_adicionales') {
        treu_impresion_bifurca("/manten_adicionales_detalle?opcion=imprimir");
    }

    if ($('#treu_impresion_encargo_trabajo').val()=='imprimir_asignaciones') {
        treu_impresion_bifurca("/manten_asignaciones_detalle?opcion=imprimir");
    }

    if ($('#treu_impresion_encargo_trabajo').val()=='imprimir_presupuesto') {
        treu_impresion_bifurca("/imprimir_presupuesto");
    }

    if ($('#treu_impresion_encargo_trabajo').val()=='imprimir_analitica') {
        treu_impresion_bifurca("/imprimir_analitica");
    }

    if ($('#treu_impresion_encargo_trabajo').val()=='imprimir_analitica_en_tramite') {
        treu_impresion_bifurca("/imprimir_analitica_en_tramite");
    }

    if ($('#treu_impresion_encargo_trabajo').val()=='calcular_presupuesto') {
        treu_impresion_bifurca("/calcular_presupuesto");
    }

    if ($('#treu_impresion_encargo_trabajo').val()=='calcular_analitica') {
        treu_impresion_bifurca("/calcular_analitica");
    }

    if ($('#treu_impresion_encargo_trabajo').val()=='imprimir_historico_analitica') {
        treu_impresion_bifurca("/imprimir_historico_analitica");
    }

    if ($('#treu_impresion_encargo_trabajo').val()=='imprimir_historico_presupuesto') {
        treu_impresion_bifurca("/imprimir_historico_presupuesto");
    }

}
