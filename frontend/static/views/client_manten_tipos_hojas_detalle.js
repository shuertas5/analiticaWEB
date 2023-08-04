// --------------------------------------------------------------
// Cliente: Mantenimiento Detalle Tipos Hojas Analiticas
// --------------------------------------------------------------

import AbstractView from "./abstractview.js";

export default class extends AbstractView {

    constructor() {
        super();
        this.setTitle('Mantenimiento Detalle de Tipos de Hojas');
    }

    async getHtml(url) {

        var content = "";
        $.ajax({
            type: 'GET',
            //url: '/manten_tipos_hojas_detalle',
            url: url,
            async: false,
            success: function (response) {

                var result = response.indexOf('<script>');

                if (result != -1) {
                    content = response.substring(0, result);
                    $('#scripts_dinamicos').html(response.substring(result));
                }
                else {
                    content = response;
                    $('#scripts_dinamicos').html("");
                }

            },
            error: function (xhr, status, err) {
                console.log(xhr.responseText);
            }
        });

        return content;

    }
}
