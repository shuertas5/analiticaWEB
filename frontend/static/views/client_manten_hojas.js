// --------------------------------------------------------------
// Cliente: Mantenimiento Hojas Analiticas
// --------------------------------------------------------------

import AbstractView from "./abstractview.js";

export default class extends AbstractView {
    
    constructor () {
        super();
        this.setTitle('Mantenimiento de Hojas Analiticas');
    }

    async getHtml(url) {

        var respuesta="";
        $.ajax({
            type: 'GET',
            //url: '/manten_hojas',
            url: url,
            async: false,
            success: function (response) {
               //alert(response);
               respuesta=response;
            },
            error: function (xhr, status, err) {
            }
        });
 
        return respuesta;

    }
}