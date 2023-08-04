import AbstractView from "./abstractview.js";

export default class extends AbstractView {
    
    constructor () {
        super();
        this.setTitle('');
    }

    async getHtml() {

        var respuesta="";
        $.ajax({
            type: 'GET',
            url: '/principal',
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