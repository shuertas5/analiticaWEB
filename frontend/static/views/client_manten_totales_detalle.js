// -----------------------------------------------------------------
// Cliente: Mantenimiento Detalle de Totales de Lineas Analiticas
// -----------------------------------------------------------------

import AbstractView from "./abstractview.js";

export default class extends AbstractView {
    
    constructor () {
        super();
        this.setTitle('Mantenimiento Detalle de Totales de Lineas Analiticas');
    }

    async getHtml(url) {

        var content="";
        $.ajax({
            type: 'GET',
            //url: '/manten_totales_detalle',
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
            }
        });
 
        return content;

    }
}