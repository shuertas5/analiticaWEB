/* ================================================================
   Rutina para Formatear Numeros
   ================================================================ */

   function form(format, numero, opcion) {

    var minimo, conespacios, blancos, relle, carelle, detras, paren, americano;
    var lon, contx, i, dec, num, forma2, forma, punto, car, ln, recortar, salida, interno;
    var ib, a, loni;

    lon = format.length;

    minimo = false;
    detras = false;
    paren = false;
    relle = false;
    blancos = false;
    carelle = ' ';
    americano = false;
    conespacios = true;
    recortar = false;

    ln = opcion.length;
    for (i = 1; i <= ln; i++) {
        car = opcion.substring(i - 1, i);
        if (car == 'm') minimo = true;
        if (car == 'k') conespacios = false;
        if (car == 'B') blancos = true;
        if (car == '0' || car == '*') {
            relle = true;
            carelle = car;
        }
        if (car == 'D') detras = true;
        if (car == 'P') paren = true;
        if (car == 'A') americano = true;
        if (car == 'R') recortar = true;
    }

    if (minimo == true) relle = false;
    if (americano == false) {
        coma = ',';
        punto = '.';
    } else {
        coma = '.';
        punto = ',';
    }

    for (i = 1, contx = 0, dec = 0; i <= lon; i++, contx++) {
        if (format.charAt(lon - i) == coma) {
            dec = contx;
            break;
        }
    }

    if (numero < 0) {
        numero = -1 * numero;
        negativo = true;
    } else {
        negativo = false;
    }

    num = Math.round(numero * Math.pow(10, dec));
    forma2 = '' + num;

    forma = '';
    //for (i=1; i<=lon; i++) forma+=' ';
    loni = forma2.length;

    ib = 1;
    blan = false;
    for (i = 1; i <= lon; i++, ib++) {
        if (i <= dec) {
            if (ib <= loni) {
                car = forma2.charAt(loni - ib);
                forma = car + forma;
            } else {
                blan = true;
                forma = '0' + forma;
            }
        }
        if (i == dec) {
            i++;
            forma = coma + forma;
            if (blan == true || ib == loni) {
                i++;
                forma = '0' + forma;
            }
            continue;
        }
        if (i > dec) {
            if (ib <= loni) {
                car = forma2.charAt(loni - ib);
                carx = format.charAt(lon - i);
                if (carx == punto) {
                    forma = punto + forma;
                    ib--;
                } else {
                    forma = car + forma;
                }
            }
        }
    }

    ib--;
    lleno = false;
    if (ib > forma2.length) lleno = false;
    if (ib == forma2.length) {
        if (negativo == true) {
            if (detras == false) {
                lleno = true;
            }
            if (paren == true) {
                lleno = true;
            }
        }
    }

    recortado = "";
    if (ib < forma2.length) {
        lleno = true;
        recortado = forma;
    }

    a = 0;
    if (lleno == true) {
        forma = '';
        for (i = 1; i <= lon; i++) {
            forma += '*';
        }
        if (negativo == false) {
            if (detras == true || paren == true) {
                forma += ' ';
                recortado += ' '
            }
        }
        else {
            if (detras == true || paren == true) {
                forma += ' ';
                recortado += '-'
            }
        }
    } else {
        if (num < 0.001 && num > -0.001 && blancos == true) {
            forma = '';
            for (i = 1; i <= lon; i++) {
                forma += ' ';
            }
        } else {
            if (minimo == true && dec > 0) {
                for (i = dec + 1; i > 0; i--) {
                    car = forma.charAt(forma.length - 1);
                    if (car == '0' || car == ',' || car == '.') {
                        forma = forma.substring(0, forma.length - 1);
                    } else {
                        break;
                    }
                }
            }
        }
        if (negativo == true) {
            if (detras == true) {
                forma = forma + '-';
                a = 1;
            } else {
                if (paren == false) forma = '-' + forma; else forma = '(' + forma;
            }
            if (paren == true) forma += ')';
        }
        if (negativo == false && (detras == true || paren == true)) {
            forma += ' ';
            a = 1;
        }
    }

    if (relle == true) {
        if (negativo == false || detras == true) {
            var ll = forma.length;
            for (var i = 1; i <= (lon - ll + a); i++) {
                forma = carelle + forma;
            }
        } else {
            car = forma.charAt(0);
            forma = forma.substring(1, forma.length);
            var ll = forma.length;
            for (var i = 1; i <= lon - ll + a - 1; i++) {
                forma = carelle + forma;
            }
            forma = car + forma;
        }
    }

    if (conespacios == true) {
        var ll = forma.length;
        for (i = 1; i <= lon - ll + a; i++) {
            forma = ' ' + forma;
        }
    }

    if (recortar == 1 && forma.charAt(0) == '*') {
        salida = recortado;
    } else {
        salida = forma;
    }

    return salida;
}