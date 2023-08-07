// --------------------------------------------------------------
// Cliente: Mascaras de Cuentas a Procesar
// --------------------------------------------------------------

import AbstractView from "./abstractview.js";
import $ from "/treu/jquery.module.js";

export default class extends AbstractView {

    constructor() {
        super();
        this.setTitle('Mascaras de Cuentas');
    }

    async getHtml(url) {

        var content="";
        $.ajax({
            type: 'GET',
            //url: '/mascaras_cuentas',
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