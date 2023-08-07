// --------------------------------------------------------------
// Cliente: Reparto Ppto Global
// --------------------------------------------------------------

import AbstractView from "./abstractview.js";

export default class extends AbstractView {
    
    constructor () {
        super();
        this.setTitle('Reparto Presupuesto Global');
    }

    async getHtml(url) {

        var content="";
        $.ajax({
            type: 'GET',
            //url: '/reparto_ppto_global',
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