/* Rutinas de lista de campos */

function lista_campos_add(lista, campo, valor) {

    for (var valo in lista) {
        if (campo == valo) {
            return false;
        }
    }
    lista[campo] = valor;
    return true;
}

function lista_campos_remove(lista, campo) {

    for (var valo in lista) {
        if (campo == valo) {
            const index = lista.indexOf(campo);
            if (index > -1) {
                lista.splice(index, 1);
            }
            return true;
        }
    }
    return false;
}

function lista_campos_update(lista, campo, valor) {

    for (var valo in lista) {
        if (campo == valo) {
            lista[campo] = valor;
            return true;
        }
    }

    return false;
}

function lista_campos_escribir_campos(lista) {

    var salida = "";
    for (var valo in lista) {
        salida += '#[#' + valo + '#]#=>#[#' + lista[valo] + '#]#\n';
    }
    return salida;

}

function lista_campos_add_campos_standard(lista) {

    lista_campos_add(lista, 'previsualizacion', $('#treu_impresion_opcion_a_previsualizacion').val());
    lista_campos_add(lista, 'previsualizacion_pdf', $('#treu_impresion_opcion_a_previsualizacion_pdf').val());
    lista_campos_add(lista, 'afichero', $('#treu_impresion_opcion_a_fichero').val());
    lista_campos_add(lista, 'afichero_pdf', $('#treu_impresion_opcion_a_fichero_pdf').val());
    lista_campos_add(lista, 'afichero_filename', $('#treu_impresion_opcion_a_fichero_filename').val());

}
