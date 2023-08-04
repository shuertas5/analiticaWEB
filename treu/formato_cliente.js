/* ================================================================
   Rutina para Formatear Numeros
   ================================================================ */

function form(format, numero, opcion) {

    var minimo, conespacios, blancos, relle, carelle, detras, paren, americano;
    var lon, contx, i, dec, num, forma2, forma, punto, car, ln, recortar, salida, interno;
    var ib, a, loni, html;

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
    interno = false;
    html = false;

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
        if (car == 'i') interno = true;
        if (car == 'H') html = true;
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
    if (ib < forma2.length) lleno = true;

    a = 0;
    if (lleno == true) {
        forma = '';
        for (i = 1; i <= lon; i++) {
            forma += '*';
        }
        if (detras == true || paren == true) {
            forma += ' ';
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

    if (recortar == 1 && forma.charAt(0) == '*' && interno == false) {
        salida = checkeanumero(numero, format, americano, detras);
    } else {
        salida = forma;
    }

    if (html == true) {
        salida = salida.replace(/\s/g, '&nbsp;');
    }

    return salida;
}

function checkeanumero(numero, format, americano, detras) {

    var checkea;
    var longi, i, longipre, longipos, poscoma, precoma, postcoma;
    var carsal, car;
    var seleci, concoma, conmenos, salta;
    var sel, opc;
    var formatoampl;
    var coma, punto;
    var textox;
    var care;

    formatoampl = "##########";
    formatoampl = formatoampl + format;

    if (americano == false) {
        opc = "i";
    } else {
        opc = "Ai";
    }

    if (detras == true) {
        opc = opc + "D";
    }

    textox = form(formatoampl, numero, opc);

    if (americano == false) {
        coma = ',';
        punto = '.';
    } else {
        coma = '.';
        punto = ',';
    }

    longipre = 0;
    for (i = 1; i <= format.length; i++) {
        if (format.charAt(i - 1) != punto && format.charAt(i - 1) != coma)
            longipre++;
        if (format.charAt(i - 1) == coma)
            break;
    }

    longipos = 0;
    salta = false;
    for (i = 1; i <= format.length; i++) {
        if (format.charAt(i - 1) != punto && salta == true)
            longipos++;
        if (format.charAt(i - 1) == coma)
            salta = true;
    }

    if (detras == 1) {
        longipos++;
    }

    longi = longipre + longipos + 1;

    poscoma = 0;
    for (i = 1; i <= textox.length; i++) {
        if (textox.charAt(i - 1) == punto) {
            poscoma = i - 1;
            break;
        }
        if (textox.charAt(i - 1) == coma) {
            poscoma = i - 1;
            break;
        }
    }
    if (poscoma == 0) {
        poscoma = textox.length;
    }

    precoma = 0;
    for (i = 1; i <= textox.length; i++) {
        if (textox.charAt(i - 1) != punto && textox.charAt(i - 1) != coma) {
            precoma++;
        } else if (textox.charAt(i - 1) == coma) {
            break;
        }
    }

    concoma = false;
    for (i = 1; i <= textox.length; i++) {
        if (textox.charAt(i - 1) == coma || textox.charAt(i - 1) == punto) {
            concoma = true;
            break;
        }
    }

    conmenos = false;
    for (i = 1; i <= textox.length; i++) {
        if (textox.charAt(i - 1) == '-') {
            conmenos = true;
            break;
        }
    }

    care = "";
    checkea = "";
    if (precoma > longipre) {
        for (i = 1; i <= textox.length; i++) {
            if ((i - 1) >= (precoma - longipre)) {
                care = textox.charAt(i - 1);
                checkea = checkea + care;
            }
        }
        conmenos = false;
    } else {
        checkea = textox;
    }

    /*if (longipre == 1 && conmenos == true) {
      strcpy(checkea, "");
      for (i = 1; i <= strlen(textox); i++) {
        if ((i - 1) >= 1) {
      care[0] = textox[i - 1];
      strcat(checkea, care);
        }
      }
      // textox.delete(0, 1);
    }*/

    return checkea;
}
