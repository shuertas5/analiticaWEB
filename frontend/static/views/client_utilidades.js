// --------------------------------------------------------------
// Cliente: Acceso a Utilidades
// --------------------------------------------------------------

async function utilidades(funcion, parame) {

    return new Promise(function (resolve, reject) {

        var parametros = JSON.parse(parame);

        var datos = { funcion, parametros };

        var content = "";

        $.ajax({
            type: 'POST',
            url: '/utilidades',
            async: false,
            data: {cuerpo: JSON.stringify(datos)},
            success: function (response) {
                return resolve(response);
            },
            error: function (xhr, status, err) {
            }
        });

        return content;

    });

}
