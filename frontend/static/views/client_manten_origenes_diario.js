// --------------------------------------------------------------
// Cliente: Mantenimiento Origenes de Diario
// --------------------------------------------------------------

import AbstractView from "./abstractview.js";

export default class extends AbstractView {
    
    constructor () {
        super();
        this.setTitle('Mantenimiento de Origenes de Diario');
    }

    async getHtml(url) {

        var respuesta="";
        $.ajax({
            type: 'GET',
            //url: '/manten_origenes_diario',
            url: url,
            async: false,
            success: function (response) {
               //alert(response);
               respuesta=response;
            },
            error: function (xhr, status, err) {
                console.log(xhr.responseText);
            }
        });
 
        return respuesta;

    }
}