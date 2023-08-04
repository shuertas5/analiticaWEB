function ajax_submit(form, temporal) {

    $(form).on('submit', function (event) {

        event.stopImmediatePropagation();
        event.preventDefault();    //prevent default action

        var btn = $(':focus');
        if (btn.prop('id') != 'submit') {
            //return;
        }

        var nuevos = "";
        var primero = true;
        var valo = "";
        var aa;

        var etiq = $(form).find('*');

        etiq.each(function (index) {

            if (primero == true) {
                valo = "";
            } else {
                valo = "&";
            }

            if ($(this).prop('tagName') == "INPUT") {
                aa = $(this);
                if (aa.attr("name") != undefined && aa.attr("type") != 'checkbox' && aa.attr("type") != 'radio') {
                    nuevos += valo + aa.attr('name') + '=' + aa.val().split(" ").join("%20");
                    primero = false;
                } else if (aa.attr("name") != undefined && aa.attr("type") == 'checkbox') {
                    if (aa.is(":checked")) {
                        nuevos += valo + aa.attr('name') + '=' + aa.val();
                        primero = false;
                    }
                } else if (aa.attr("name") != undefined && aa.attr("type") == 'radio') {
                    if (aa.is(":checked")) {
                        nuevos += valo + aa.attr('name') + '=' + aa.val();
                        primero = false;
                    }
                }
            }

            if ($(this).prop('tagName') == "SELECT") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val();
                    primero = false;
                }
            }

            if ($(this).prop('tagName') == "TREUNGC-TEXTO") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val().split(" ").join("%20");
                    primero = false;
                }
            }

            if ($(this).prop('tagName') == "TREUNGC-NUMER") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val();
                    primero = false;
                }
            }
            if ($(this).prop('tagName') == "TREUNGC-COMBODLG") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val().split(" ").join("%20");
                    primero = false;
                }
            }
            if ($(this).prop('tagName') == "TREUNGC-COMBODLGNUM") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val();
                    primero = false;
                }
            }
            if ($(this).prop('tagName') == "TREUNGC-FECHA") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val();
                    primero = false;
                }
            }
            if ($(this).prop('tagName') == "TREUNGC-TEXTAREA") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val().split(" ").join("%20");
                    primero = false;
                }
            }
            if ($(this).prop('tagName') == "TREUNGC-PASSWORD") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val().split(" ").join("%20");
                    primero = false;
                }
            }
        });

        event.preventDefault(); //prevent default action        
        var post_url = $(this).attr("action"); //get form action url
        var request_method = $(this).attr("method"); //get form GET/POST method
        //var form_data = $(this).serialize()+nuevos; //Encode form elements for submission
        var form_data = nuevos; //Encode form elements for submission

        $.ajax({
            url: post_url,
            type: request_method,
            async: false,
            data: form_data,
            dataType: 'html',
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }

            }
        }).done(function (response) { //
            leer_errores(temporal).then(() => {
                var ele = $("#mensajes_error").find('.erri');
                if (ele.length > 0) {
                    $('#mensajes_error').modal({ backdrop: 'static', keyboard: false });
                    $("#mensajes_error").modal('show');
                } else {
                    document.getElementById('accion_cancelar').click()
                }
            });

        });
    });
}

async function leer_errores(temporal) {

    var reto = false;

    getFileFromServer("/" + temporal + "/errores.txt", function (text) {
        $('.erri').remove();
        if (text === null) {
            reto = false;
        } else {
            var lines = text.split('\n');
            if ($('.errores').length == 1) {
                if (lines.length - 1 > 0) {
                    for (var line = 0; line < lines.length - 1; line++) {
                        $('.errores').append('<li class="erri list-group-item" >' + lines[line] + '</li>');
                    }
                    reto = true;
                }
                else if (lines[0].substring(0, 2) == '**') {
                    reto = true;
                }
            }
        }
    });

    return reto;
}

/* Rutinas Varias de JavaScript */

function acoplarseriehtml(ser, lon) {

    var salida, l;

    if (ser.length >= lon) {
        salida = ser.substring(0, lon);
    } else {
        l = ser.length;
        salida = ser;
        for (var i = l + 1; i <= lon; i++) {
            salida = salida + '&nbsp;';
        }
    }

    return salida;

}

function acoplarserie(ser, lon) {

    var salida, l;

    if (ser.length >= lon) {
        salida = ser.substring(0, lon);
    } else {
        l = ser.length;
        salida = ser;
        for (var i = l + 1; i <= lon; i++) {
            salida = salida + ' ';
        }
    }

    return salida;

}

function acoplarseriehtmlmax(ser, lon) {

    var salida;

    if (ser.length >= lon) {
        salida = ser.substring(0, lon);
    } else {
        salida = ser;
    }

    return salida;

}
function acoplarseriemax(ser, lon) {

    var salida;

    if (ser.length >= lon) {
        salida = ser.substring(0, lon);
    } else {
        salida = ser;
    }

    return salida;

}

function repcarhtml(car, lon) {

    var salida = "";

    for (var i = 0; i < lon; i++) {
        salida += car;
    }

    return salida;
}

function repcar(car, lon) {

    var salida = "";

    for (var i = 0; i < lon; i++) {
        salida += car;
    }

    return salida;

}

function ajax_submit_fichero(form, temporal) {

    $(form).on('submit', function (event) {

        event.stopImmediatePropagation();
        event.preventDefault();    //prevent default action

        var btn = $(':focus');
        if (btn.prop('id') != 'submit') {
            //return;
        }

        var nuevos = "";
        var primero = true;
        var valo = "";
        var aa;

        var etiq = $(form).find('*');

        etiq.each(function (index) {

            if (primero == true) {
                valo = "?";
            } else {
                valo = "&";
            }

            if ($(this).prop('tagName') == "INPUT") {
                aa = $(this);
                if (aa.attr("name") != undefined && aa.attr("type") != 'checkbox' && aa.attr("type") != 'radio') {
                    nuevos += valo + aa.attr('name') + '=' + aa.val().split(" ").join("%20");
                    primero = false;
                } else if (aa.attr("name") != undefined && aa.attr("type") == 'checkbox') {
                    if (aa.is(":checked")) {
                        nuevos += valo + aa.attr('name') + '=' + aa.val();
                        primero = false;
                    }
                } else if (aa.attr("name") != undefined && aa.attr("type") == 'radio') {
                    if (aa.is(":checked")) {
                        nuevos += valo + aa.attr('name') + '=' + aa.val();
                        primero = false;
                    }
                }
            }

            if ($(this).prop('tagName') == "SELECT") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val();
                    primero = false;
                }
            }

            if ($(this).prop('tagName') == "TREUNGC-TEXTO") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val().split(" ").join("%20");
                    primero = false;
                }
            }

            if ($(this).prop('tagName') == "TREUNGC-NUMER") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val();
                    primero = false;
                }
            }
            if ($(this).prop('tagName') == "TREUNGC-COMBODLG") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val().split(" ").join("%20");
                    primero = false;
                }
            }
            if ($(this).prop('tagName') == "TREUNGC-COMBODLGNUM") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val();
                    primero = false;
                }
            }
            if ($(this).prop('tagName') == "TREUNGC-FECHA") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val();
                    primero = false;
                }
            }
            if ($(this).prop('tagName') == "TREUNGC-TEXTAREA") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val().split(" ").join("%20");
                    primero = false;
                }
            }
            if ($(this).prop('tagName') == "TREUNGC-PASSWORD") {
                aa = $(this);
                if (aa.attr("name") != undefined) {
                    nuevos += valo + aa.attr('name') + '=' + aa.val().split(" ").join("%20");
                    primero = false;
                }
            }
        });

        var form_data = new FormData($(this)[0]);

        event.preventDefault(); //prevent default action        
        var post_url = $(this).attr("action"); //get form action url
        //var request_method = $(this).attr("method"); //get form GET/POST method
        //var form_data = $(this).serialize()+nuevos; //Encode form elements for submission

        $.ajax({
            url: post_url + nuevos,
            type: 'POST',
            async: false,
            data: form_data,
            cache: false,
            contentType: false,
            processData: false,
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
            }
        }).done(function (response) { //
            leer_errores(temporal).then(reto => {
                var ele = $("#mensajes_error").find('.erri');
                if (ele.length > 0) {
                    $('#mensajes_error').modal({ backdrop: 'static', keyboard: false });
                    $("#mensajes_error").modal('show');
                } else if (reto == true) {
                    //cancelamos; hay error;
                } else {
                    document.getElementById('accion_cancelar').click()
                }
            });
        });
    });
}

function paso_espacios_web(texto) {
    return texto.replace(/ /g, '%20');
}

function paso_espacios_html(texto) {
    return texto.replace(/ /g, "&nbsp;");
}

function setCookie(name, value1, value2, daysToExpire) {
    
    const cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(value1)}:${encodeURIComponent(value2)}`;
    
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpire);
    const expires = `expires=${expirationDate.toUTCString()}`;
  
    document.cookie = `${cookieValue}; ${expires}; path=/`;
  }
  
  function getCookie(name) {

    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            const cookieValue = cookie.substring(name.length + 1);
            const values = cookieValue.split(':');
            if (values.length === 2) {
                const value1 = decodeURIComponent(values[0]);
                const value2 = decodeURIComponent(values[1]);
                return { value1, value2 };
            }
        }
    }

    return null; // Cookie with specified name not found or invalid format
}

function deleteCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  