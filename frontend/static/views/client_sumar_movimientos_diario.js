// --------------------------------------------------------------
// Cliente: Sumar de Movimientos Diario Contable
// --------------------------------------------------------------

import AbstractView from "./abstractview.js";
import $ from "/treu/jquery.module.js";

export default class extends AbstractView {

    constructor() {
        super();
        this.setTitle('Sumar Movimientos Contables');
    }

    async getHtml(url) {

        var content = "";
        $.ajax({
            type: 'GET',
            //url: '/sumar_movimientos_diario',
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