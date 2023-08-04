var fs = require("fs");
var css = require('css');
var formato = require('./formato.js');
const fecha = require('./forfecha.js');
const iconv = require('iconv-lite');

function getStyle(file, className) {
    var text = fs.readFileSync(file);
    var cssText = "";
    var obj = css.parse(text);
    var sheet = obj.stylesheet;
    var classes = sheet.rules;
    for (var x = 0; x < classes.length; x++) {
        if (classes[x].selectors[0] == className) {
            for (var k = 0; k < classes[x].declarations.length; k++) {
                cssText += classes[x].declarations[k].property + ': ' + classes[x].declarations[k].value + ";";
            }
        }
    }
    return cssText;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function find_csa(arr, subarr, from_index) {

    if (typeof from_index === 'undefined') {
        from_index = 0;
    }

    var i, found, j;
    for (i = from_index; i < 1 + (arr.length - subarr.length); ++i) {
        found = true;
        for (j = 0; j < subarr.length; ++j) {
            if (arr[i + j] !== subarr[j]) {
                found = false;
                break;
            }
        }
        if (found) return i;
    }
    return -1;
};

function reformat_fecha(fechx) {
    var fech = new Date(fechx);
    var dia = fech.getDate();
    var mes = fech.getMonth() + 1;
    var anno = fech.getFullYear();
    var fechi = formato.form("####", anno, "0") + "-" + formato.form("##", mes, "0") + "-" + formato.form("##", dia, "0");
    return fechi;
}
/* Rutinas Varias de JavaScript */

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

function iniciarArray(dim) {
    var arreglo = Array();
    for (var i = 1; i <= dim; i++) {
        arreglo.push(0);
    }
    return arreglo;
}

function leer_lista_campos(vector_texto, campo) {

    var str = vector_texto;
    if (str.indexOf("#[#" + campo + "#]#") >= 0) {
        var pos = str.indexOf("#[#" + campo + "#]#");
        var pos_ini = str.indexOf('#[#', pos + ("#[#" + campo + "#]#").length);
        pos_ini += 3;
        var pos_fin = str.indexOf('#]#', pos_ini);
        return str.substring(pos_ini, pos_fin);
    }
    return "";
}

function treu_div(dividen, divisor) {
    if (Math.abs(divisor) < 0.000001) {
        return 0.0;
    }
    else {
        return dividen / divisor;
    }
}

function parseBoolean(str) {
    return /^true$/i.test(str);
}

function mesesLetras(mes, mayuscula) {

    var fec = new Date("2000-" + mes + "-01");
    var mes_letra = fecha.forfecha('Ml', fec, "");

    if (mayuscula == true) {
        mes_letra = mes_letra.toUpperCase();
    }

    return mes_letra;
}

function ajustardecimales(valo, deci) {
    var coe;
    var retor;
    var forma = "##############.";
    for (var i = 1; i <= deci; i++) {
        forma += "#";
    }
    coe = formato.form(forma, valo, "Amk");
    retor = parseFloat(coe);
    return retor;
}

function BooleantoString(valo, opc) {

    var americano;
    var sino;
    var logicoenglish;
    var logicoespanol;
    var cerouno;

    var l, i;
    var car;
    var salida;

    americano = false;
    sino = false;
    logicoenglish = true;
    logicoespanol = false;
    cerouno = false;

    l = opc.length;
    for (i = 1; i <= l; i++) {
        car = opc[i - 1];
        if (car == 'S') { sino = true; logicoenglish = false; }
        if (car == 'T') { logicoenglish = true; }
        if (car == 'V') { logicoespanol = true; logicoenglish = false; }
        if (car == '1') { cerouno = true; logicoenglish = false; }
        if (car == 'Y') { americano = true; logicoenglish = false; }
    }

    salida = "";
    if (valo == true) {
        if (americano == true) salida = "yes";
        if (sino == true) salida = "si";
        if (logicoenglish == true) salida = "true";
        if (logicoespanol == true) salida = "verdadero";
        if (cerouno == true) salida = "1";
    }
    if (valo == false) {
        if (americano == true) salida = "no";
        if (sino == true) salida = "no";
        if (logicoenglish == true) salida = "false";
        if (logicoespanol == true) salida = "falso";
        if (cerouno == true) salida = "0";
    }

    return salida;

}

module.exports = {
    getStyle, getRandomInt, find_csa, reformat_fecha,
    acoplarserie, acoplarseriehtml, acoplarseriehtmlmax, acoplarseriemax, repcarhtml,
    iniciarArray, leer_lista_campos, repcar, treu_div, parseBoolean, mesesLetras, ajustardecimales,
    BooleantoString
}
