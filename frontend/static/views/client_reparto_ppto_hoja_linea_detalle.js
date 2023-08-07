// --------------------------------------------------------------
// Cliente: Reparto Ppto Hoja Linea Detalle
// --------------------------------------------------------------

import AbstractView from "./abstractview.js";

export default class extends AbstractView {
    
    constructor () {
        super();
        this.setTitle('Reparto Presupesto Hoja Linea Detalle');
    }

    async getHtml(url) {

        var content="";
        $.ajax({
            type: 'GET',
            //url: '/reparto_ppto_hoja_linea_detalle',
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