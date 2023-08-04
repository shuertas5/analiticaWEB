const formato = require("./formato.js")
const treu = require('./treu_file.js');
const rutinas = require('./rutinas_server.js');
const fs = require('fs')

global.window = { document: { createElementNS: () => { return {} } } };
global.navigator = {};
global.btoa = () => { };

const jspdf = require('jspdf');

class Treu_print_courier_pdf {

    MAXLINEASPREVISUALIZACION = 55000;
    FICHERO_MAX_LINEAS_HOJA = 70;
    SOLO_VERTICAL = 1;
    SOLO_HORIZONTAL = 2;
    VERTICAL_HORIZONTAL = 3;

    imp_pdf;

    posix = 0;
    posiy = 0;
    altura_font = 5;

    orientacionfija;
    apaisada = false;

    compacto = 0;

    ennegrita = false;
    encursiva = false;

    font;
    fontregular;
    fontnegrita;
    fontcursiva;
    fontnegritacursiva;

    MargenIzquierdo = 4;
    MargenDerecho = 4;
    MargenSuperior = 2;
    MargenInferior = 2;

    InMargenIzquierdo = 4;
    InMargenDerecho = 4;
    InMargenSuperior = 2;
    InMargenInferior = 2;

    avanx;
    avany;

    poslinea = 1;
    numlineas = 0;

    colorx;

    caminofile;
    lineaspagina;

    carpetalistados;

    afichero = false;
    aprevisualizacion = false;
    aficheropdf = false;
    aprevisualizacionpdf = false;

    fichero;
    texto_list = "";

    tabulaactivo;
    tabulapos;

    estaabierta;
    font_size = 12;

    buffersalida;
    opcionLayout = 3;

    impresionEnBuffer;
    //char buffer[][][];
    //boolean bufferbold[][][];
    maxhojabuffer;
    maxcolubuffer;
    maxfilabuffer;
    buffposh;
    buffposx;
    buffposy;

    nimpreso;
    impresoimag = Array();

    namePrinter;

    constructor(ori) {
        var strori = 'portrait';
        if (ori != undefined) {
            if (ori == "V") {
                strori = 'portrait';
            }
            else {
                strori = 'landscape';
            }
        }
        this.imp_pdf = new jspdf.jsPDF({
            orientation: strori,
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
        });
        this.compacto = 0;

        /*const regular_base64 = fs.readFileSync("./treu/CourierPrime-Regular.base64")
        const bold_base64 = fs.readFileSync("./treu/CourierPrime-Bold.base64")
        const italic_base64 = fs.readFileSync("./treu/CourierPrime-Italic.base64")
        const bold_italic_base64 = fs.readFileSync("./treu/CourierPrime-BoldItalic.base64")

        this.imp_pdf.addFileToVFS('./treu/CourierPrime-Regular.ttf', regular_base64.toString());
        this.imp_pdf.addFileToVFS('./treu/CourierPrime-Bold.ttf', bold_base64.toString());
        this.imp_pdf.addFileToVFS('./treu/CourierPrime-Italic.ttf', italic_base64.toString());
        this.imp_pdf.addFileToVFS('./treu/CourierPrime-BoldItalic.ttf', bold_italic_base64.toString());
       
        this.imp_pdf.addFont('./treu/CourierPrime-Regular.ttf', 'CourierPrime-Regular','regular');
        this.imp_pdf.addFont('./treu/CourierPrime-Bold.ttf', 'CourierPrime-Bold','bold');
        this.imp_pdf.addFont('./treu/CourierPrime-Italic.ttf', 'CourierPrime-Italic','italic');
        this.imp_pdf.addFont('./treu/CourierPrime-BoldItalic.ttf', 'CourierPrime-BoldItalic', 'bolditalic');*/

    }

    setOrientacion(orien) {

        if (orien == "V") {
            this.apaisada = false;
        } else {
            this.apaisada = true;
        }

        if (this.apaisada == false) {
            this.imp_pdf.canvas.height = 297;
            this.imp_pdf.canvas.width = 210;
        }
        else {
            this.imp_pdf.canvas.height = 210;
            this.imp_pdf.canvas.width = 297;
        }

    }

    resetcondi() {
        this.MargenSuperior = this.InMargenSuperior;
        this.MargenInferior = this.InMargenInferior;
        this.MargenIzquierdo = this.InMargenIzquierdo;
        this.MargenDerecho = this.InMargenDerecho;
    }

    apertura() {

        var ret = false;

        this.estaabierta = false;
        this.numlineas = 0;

        this.carpex();

        this.poslinea = 1;
        if (this.afichero == true) {
            this.caminofile = this.carpetalistados + "/ListadoTexto.txt";
            this.lineaspagina = this.FICHERO_MAX_LINEAS_HOJA;
        }

        if (this.afichero == false && this.aprevisualizacion == false && this.aficheropdf == false && this.aprevisualizacionpdf == false) {

            this.namePrinter = "";

            this.ponerValores();
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy = this.MargenSuperior * this.altura_font;
        }

        if (this.afichero == true) {
            this.fichero = fs.openSync(this.caminofile, 'w');
        }

        if (this.aprevisualizacion == true) {
        }

        if (this.aficheropdf == true) {
            this.ponerValores();
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy = this.MargenSuperior * this.altura_font;
        }

        if (this.aprevisualizacionpdf == true) {
            this.ponerValores();
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy = this.MargenSuperior * this.altura_font;
        }

        this.estaabierta = true;

        return true;

    }

    ponerValores() {

        this.setMargenes(this.MargenSuperior, this.MargenInferior, this.MargenIzquierdo, this.MargenDerecho);

        if (this.compacto == 0) {
            this.compactar(false);
        } else if (this.compacto == 1) {
            this.compactar(true);
        } else if (this.compacto == 2) {
            this.compactarbis(true);
        }

        var orien = "";

        if (this.apaisada == true) {
            orien = "H";
        } else {
            orien = "V";
        }

        this.imp_pdf.setFont("courier", 'normal');
        this.imp_pdf.setFontSize(this.font_size);

        if (this.apaisada == false) {
            this.imp_pdf.canvas.height = 297;
            this.imp_pdf.canvas.width = 210;
        }
        else {
            this.imp_pdf.canvas.height = 210;
            this.imp_pdf.canvas.width = 297;
        }

    }

    aperturaSinDialogo() {

        var ret = false

        this.carpex();

        this.poslinea = 1;

        /*pageatributos.setColor(ColorType.COLOR);
        //printer=Toolkit.getDefaultToolkit().getPrintJob(null,name,impreatributos,pageatributos);
        URL url3 = getClass().getResource("SeleccionImpresora.fxml");
        ControllerSeleccionImpresora manpri = (ControllerSeleccionImpresora) Utilidades.inicialCrearWindowFXML(getClass(),url3,"",false,Utilidades.POSICION_VENTANA_CENTRADA);
        manpri.origenprin=this;
        Utilidades.inicialVisualizarWindowFXML(manpri.getMiStage(),true);
        if (manpri.retorno.compareTo("")==0) return false;
        namePrinter = manpri.retorno;*/

        this.ponerValores();

        this.estaabierta = true;

        return true;
    }

    leer_parametros(data_impre) {
        var aprevis = rutinas.leer_lista_campos(data_impre, 'previsualizacion');
        var aprevis_pdf = rutinas.leer_lista_campos(data_impre, 'previsualizacion_pdf');
        var afichero = rutinas.leer_lista_campos(data_impre, 'afichero');
        var afichero_pdf = rutinas.leer_lista_campos(data_impre, 'afichero_pdf');
        var file_name = rutinas.leer_lista_campos(data_impre, 'afichero_filename');
        this.aprevisualizacion = aprevis;
        this.aprevisualizacionpdf = aprevis_pdf;
        this.afichero = afichero;
        this.aficheropdf = afichero_pdf;
        this.caminofile = file_name;
    }

    aperturaSilenciosa2(data) {
        this.leer_parametros(data);
        return this.aperturaSilenciosa();
    }

    aperturaSilenciosa() {

        var ret = false;

        this.estaabierta = false;
        this.numlineas = 0;

        this.carpex();
        this.ponerValores();

        if (this.afichero == false && this.aprevisualizacion == false && this.aficheropdf == false && this.aprevisualizacionpdf == false) {
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy = this.MargenSuperior * this.altura_font;
            ret = true;
        }

        if (this.aficheropdf == true) {
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy = this.MargenSuperior * this.altura_font;
            ret = true;
        }

        if (this.aprevisualizacionpdf == true) {
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy = this.MargenSuperior * this.altura_font;
            ret = true;
        }

        if (this.afichero == true) {
            this.caminofile = this.carpetalistados + "/ListadoTexto.txt";
            this.lineaspagina = this.FICHERO_MAX_LINEAS_HOJA;
            this.fichero = fs.openSync(this.caminofile, 'w');
            ret = true;
        }

        if (this.aprevisualizacion == true) {
            this.lineaspagina = this.FICHERO_MAX_LINEAS_HOJA;
            this.texto_list = "";
            ret = true;
        }

        this.estaabierta = true;

        return ret;

    }

    cierre() {

        if (this.afichero == false && this.aprevisualizacion == false && this.aficheropdf == false && this.aprevisualizacionpdf == false) {
            for (var j = 1; j <= this.impresoimag.length; j++) {
                this.imprimirImagenImpreso(j);
            }
            this.caminofile = this.filecarpetagrabacion() + "/ListadoTexto.pdf";
            this.imp_pdf.close();
            fs.writeFileSync(this.caminofile, this.imp_pdf.output());
        }
        if (this.afichero == true) {
            fs.closeSync(this.fichero);
        }

        if (this.afichero == false && this.aprevisualizacion == true) {

            this.caminofile = this.carpetalistados + "/ListadoTexto.txt";
            this.fichero = fs.openSync(this.caminofile, 'w');
            fs.writeFileSync(this.fichero, this.texto_list);
            fs.closeSync(this.fichero);
        }

        if (this.aficheropdf == true) {
            for (var j = 1; j <= this.impresoimag.length; j++) {
                this.imprimirImagenImpreso(j);
            }
            this.caminofile = this.filecarpetagrabacion() + "/ListadoTexto.pdf";
            this.imp_pdf.close();
            fs.writeFileSync(this.caminofile, this.imp_pdf.output());
        }

        if (this.aprevisualizacionpdf == true) {
            for (var j = 1; j <= this.impresoimag.length; j++) {
                this.imprimirImagenImpreso(j);
            }
            this.caminofile = this.filecarpetagrabacion() + "/ListadoTexto.pdf";
            this.imp_pdf.close();
            fs.writeFileSync(this.caminofile, this.imp_pdf.output());
        }

        this.estaabierta = false;

    }

    setSizeFont(size) {
        this.font_size = size;
        this.imp_pdf.setFontSize(size);
    }

    setNegrita(boo) {

        var opc = "";
        if (boo == true) {
            this.ennegrita = true;
            opc = "bold";
            this.imp_pdf.setFont("courier", 'bold');
        }
        if (boo == false) {
            this.ennegrita = false;
            opc = 'normal';
            this.imp_pdf.setFont("courier", 'normal');
        }

        if (this.afichero == false && this.aprevisualizacion == false && this.aficheropdf == false && this.aprevisualizacionpdf == false) {
            //this.imp_pdf.setFont("courierprimedb", opc);
        }

        if (this.aficheropdf == true) {
            //this.imp_pdf.setFont("courierprimedb", opc);
        }

        if (this.aprevisualizacionpdf == true) {
            //this.imp_pdf.setFont("courierprimedb", opc);
        }

    }

    setCursiva(boo) {

        var opc = "";
        if (boo == true) {
            this.encursiva = true;
            opc = "italic";
            this.imp_pdf.setFont("courier", 'italic');
        }
        if (boo == false) {
            this.encursiva = false;
            opc = "normal";
            this.imp_pdf.setFont("courier", 'normal');
        }

        if (this.afichero == false && this.aprevisualizacion == false && this.aficheropdf == false && this.aprevisualizacionpdf == false) {
            //this.imp_pdf.setFont("couriertt", opc);
        }

        if (this.aficheropdf == true) {
            //this.imp_pdf.setFont("couriertt", opc);
        }

        if (this.aprevisualizacionpdf == true) {
            //this.imp_pdf.setFont("couriertt", opc);
        }

    }

    setColor(colo) {
        var b = colo % 256;
        var g = (colo / 256) % 256;
        var r = (colo / 256) / 256;
        this.colorx = colo;
        this.imp_pdf.setTextColor(r, g, b);
    }

    setGris(colo) {
        var b = colo;
        var g = (colo * 256);
        var r = (colo * 256) * 256;
        this.colorx = r + g + b;
        this.imp_pdf.setTextColor(colo);
    }

    resetColor() {
        this.colorx = this.hexdec("000000");
        this.imp_pdf.setTextColor(0, 0, 0);
    }

    print(serie) {

        var str = this.convertir(serie);

        if (this.afichero == false && this.aprevisualizacion == false && this.aficheropdf == false && this.aprevisualizacionpdf == false) {
            //str = iconv.encode(serie, 'win1252');
            //str = iconv.encode(Buffer.from(serie, 'utf8'), 'windows-1252');
            this.imp_pdf.text(str, this.posix, this.posiy);
            this.posix += this.imp_pdf.getTextWidth(serie);
        }

        if (this.afichero == true) {
            fs.writeFileSync(this.fichero, serie);
        }

        if (this.aprevisualizacion == true) {
            if (this.numlineas > this.MAXLINEASPREVISUALIZACION) return;
            this.texto_list += serie;
        }

        if (this.aficheropdf == true) {
            //str = iconv.encode(serie, 'win1252');
            //str = iconv.encode(Buffer.from(serie, 'utf8'), 'windows-1252');
            this.imp_pdf.text(str, this.posix, this.posiy);
            this.posix += this.imp_pdf.getTextWidth(str);
        }

        if (this.aprevisualizacionpdf == true) {
            //str = iconv.encode(serie, 'win1252');
            //str = iconv.encode(Buffer.from(serie, 'utf8'), 'windows-1252');
            this.imp_pdf.text(str, this.posix, this.posiy);
            this.posix += this.imp_pdf.getTextWidth(str);
        }

    }

    printre(car, num) {

        var str;

        if (this.afichero == false && this.aprevisualizacion == false && this.aficheropdf == false && this.aprevisualizacionpdf == false) {
            //str = iconv.encode(Buffer.alloc(car.length, car, 'UTF-8'), 'windows-1252');
            var sal = "";
            for (var i = 1; i <= num; i++) {
                sal += car;
            }
            this.imp_pdf.text(sal, this.posix, this.posiy);
            this.posix += this.imp_pdf.getTextWidth(sal);
        }

        if (this.afichero == true) {
            for (var i = 1; i <= num; i++) {
                fs.writeFileSync(this.fichero, car);
            }
        }

        if (this.aprevisualizacion == true) {
            if (this.numlineas > this.MAXLINEASPREVISUALIZACION) return;
            for (var i = 1; i <= num; i++) {
                this.texto_list += car;
            }
        }

        if (this.aficheropdf == true) {
            //str = iconv.encode(Buffer.alloc(car.length, car, 'UTF-8'), 'windows-1252');
            var cari = "";
            for (var i = 1; i <= num; i++) {
                cari += car;
            }
            this.imp_pdf.text(cari, this.posix, this.posiy);
            this.posix += this.imp_pdf.getTextWidth(cari);
        }

        if (this.aprevisualizacionpdf == true) {
            //str = iconv.encode(Buffer.alloc(car.length, car, 'UTF-8'), 'windows-1252');
            var cari = "";
            for (var i = 1; i <= num; i++) {
                cari += car;
            }
            this.imp_pdf.text(cari, this.posix, this.posiy);
            this.posix += this.imp_pdf.getTextWidth(cari);
        }

    }

    hoja() {

        if (this.afichero == false && this.aprevisualizacion == false && this.aficheropdf == false && this.aprevisualizacionpdf == false) {
            for (var j = 1; j <= this.impresoimag.length; j++) {
                this.imprimirImagenImpreso(j);
            }
            if (this.apaisada == true) {
                this.imp_pdf.addPage('L');
                this.imp_pdf.canvas.height = 210;
                this.imp_pdf.canvas.width = 297;
            } else {
                this.imp_pdf.addPage('P');
                this.imp_pdf.canvas.height = 297;
                this.imp_pdf.canvas.width = 210;
            }
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy = this.MargenSuperior * this.altura_font;
        }

        if (this.afichero == true) {
            fs.writeFileSync(this.fichero, "\f");
        }

        if (this.aprevisualizacion == true) {
            if (this.numlineas > this.MAXLINEASPREVISUALIZACION) return;
            this.texto_list += "\f";
        }

        if (this.aficheropdf == true) {
            for (var j = 1; j <= this.impresoimag.length; j++) {
                this.imprimirImagenImpreso(j);
            }
            if (this.apaisada == true) {
                this.imp_pdf.addPage('L');
            } else {
                this.imp_pdf.addPage('P');
            }
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy = this.MargenSuperior * this.altura_font;
        }

        if (this.aprevisualizacionpdf == true) {
            for (var j = 1; j <= this.impresoimag.length; j++) {
                this.imprimirImagenImpreso(j);
            }
            if (this.apaisada == true) {
                this.imp_pdf.addPage('L');
            } else {
                this.imp_pdf.addPage('P');
            }
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy = this.MargenSuperior * this.altura_font;
        }

        this.poslinea = 1;
    }

    linea() {

        this.numlineas++;

        this.poslinea++;
        if (this.afichero == false && this.aprevisualizacion == false && this.aficheropdf == false && this.aprevisualizacionpdf == false) {
            //this.imp_pdf.text('\n', this.posix, this.posiy);
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy += this.altura_font;
        }

        if (this.afichero == true) {
            fs.writeFileSync(this.fichero, "\r");
            fs.writeFileSync(this.fichero, "\n");
        }

        if (this.aprevisualizacion == true) {
            if (this.numlineas == this.MAXLINEASPREVISUALIZACION) {
                var mensaje = "Alcanzada el Maximo de Visualizacion ";
                this.texto_list += "\r";
                this.texto_list += "\n";
                this.texto_list += "\r";
                this.texto_list += "\n";
                this.texto_list += mensaje;
            }
            this.numlineas++;
            if (this.numlineas > this.MAXLINEASPREVISUALIZACION) return;
            this.texto_list += "\r";
            this.texto_list += "\n";
        }

        if (this.aficheropdf == true) {
            //this.imp_pdf.text('\n', this.posix, this.posiy);
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy += this.altura_font;
        }

        if (this.aprevisualizacionpdf == true) {
            //this.imp_pdf.text('\n', this.posix, this.posiy);
            this.posix = this.MargenIzquierdo * this.imp_pdf.getTextWidth('m');
            this.posiy += this.altura_font;
        }

    }

    hayespacio(numlineas) {

        var margenes;
        var max;

        max = this.imp_pdf.canvas.height;

        if (this.afichero == false && this.aprevisualizacion == false && this.aficheropdf == false && this.aprevisualizacionpdf == false) {
            margenes = (this.MargenSuperior + this.MargenInferior) * this.altura_font;
            if (this.posiy + this.altura_font * numlineas > max - margenes) {
                return false;
            } else {
                return true;
            }
        }

        if (this.afichero == true) {
            if (this.poslinea + numlineas > this.lineaspagina) return false;
        }

        if (this.aprevisualizacion == true) {
            if (this.poslinea + numlineas > this.lineaspagina) return false;
        }

        if (this.aficheropdf == true) {
            margenes = (this.MargenSuperior + this.MargenInferior) * this.altura_font;
            if (this.posiy + this.altura_font * numlineas > max - margenes) {
                return false;
            } else {
                return true;
            }
        }

        if (this.aprevisualizacionpdf == true) {
            margenes = (this.MargenSuperior + this.MargenInferior) * this.altura_font;
            if (this.posiy + this.altura_font * numlineas > max - margenes) {
                return false;
            } else {
                return true;
            }
        }

        return true;
    }

    impreafichero(camino, lineaspag) {
        this.afichero = true;
        this.aprevisualizacion = false;
        this.aficheropdf = false;
        this.aprevisualizacionpdf = false;
        this.caminofile = camino;
        this.lineaspagina = lineaspag;
    }

    impreaficheropdf(camino) {
        this.afichero = false;
        this.aprevisualizacion = false;
        this.aficheropdf = true;
        this.aprevisualizacionpdf = false;
        this.caminofile = camino;
    }

    impreafichero_sele(afile) {
        if (afile == false) {
            this.afichero = false;
            this.aprevisualizacion = false;
            this.aficheropdf = false;
            this.aprevisualizacionpdf = false;
            this.caminofile = "";
            this.lineaspagina = 0;
        } else {
            this.afichero = true;
            this.aprevisualizacion = false;
            this.aficheropdf = false;
            this.aprevisualizacionpdf = false;
            this.caminofile = "";
            this.lineaspagina = this.FICHERO_MAX_LINEAS_HOJA;
        }
    }

    setMargenes(superior, inferior, izquierdo, derecho) {

        this.MargenSuperior = superior;
        this.MargenInferior = inferior;
        this.MargenIzquierdo = izquierdo;
        this.MargenDerecho = derecho;

        //this.imp_pdf.SetMargins(izquierdo, superior, derecho);
    }

    previsualiza(aprevis, lineaspag) {
        if (aprevis == true) {
            this.afichero = false;
            this.aprevisualizacion = true;
            this.aficheropdf = false;
            this.aprevisualizacionpdf = false;
            this.lineaspagina = lineaspag;
        } else {
            this.afichero = false;
            this.aprevisualizacion = false;
            this.aficheropdf = false;
            this.aprevisualizacionpdf = false;
        }
    }

    previsualizapdf(aprevis, camino) {
        if (aprevis == true) {
            this.afichero = false;
            this.aprevisualizacion = false;
            this.aficheropdf = false;
            this.aprevisualizacionpdf = true;
            this.caminofile = camino;
        } else {
            this.afichero = false;
            this.aprevisualizacion = false;
            this.aficheropdf = false;
            this.aprevisualizacionpdf = false;
            this.caminofile = "";
        }
    }

    printImagen(ima, xcar, ycar) {

        /* if (impresionEnBuffer == true) {
             return;
         }
    
         if (formatografico == true) {
         }*/
    }

    anchoencaracteres(ancho) {
        return ancho / this.avanx;
    }

    altoencaracteres(alto) {
        return alto / this.avany;
    }

    getLinea() {
        return this.poslinea;
    }

    putcaracter(car) {

    }

    compactar(com) {
        if (com == true) this.compacto = 1;
        if (com == false) this.compacto = 0;
        if (this.compacto == 0) {
            if (this.apaisada == false) {
                this.altura_font = this.imp_pdf.canvas.height / 70.0;
            } else {
                this.altura_font = this.imp_pdf.canvas.height / 50.0;
            }
        } else {
            if (this.apaisada == false) {
                this.altura_font = this.imp_pdf.canvas.height / 85.0;
            } else {
                this.altura_font = this.imp_pdf.canvas.height / 60.0;
            }
        }
    }

    compactarbis(com) {
        if (com == true) this.compacto = 2;
        if (com == false) this.compacto = 0;
        if (this.compacto == 0) {
            if (this.apaisada == false) {
                this.altura_font = this.imp_pdf.canvas.height / 70.0;
            } else {
                this.altura_font = this.imp_pdf.canvas.height / 50.0;
            }
        } else {
            if (this.apaisada == false) {
                this.altura_font = this.imp_pdf.canvas.height / 77.0;
            } else {
                this.altura_font = this.imp_pdf.canvas.height / 54.0;
            }
        }
    }

    asignarImagenImpreso(ima) {
        this.nimpreso++;
        ima.secuencia = this.nimpreso;
        array_push(this.impresoimag, ima);
    }

    imprimirImagenImpreso(ima) {
        if (this.aprevisualizacion != true && this.afichero != true) {
            var image = this.impresoimag[ima - 1];
            this.imp_pdf.Image(image.fichero, image.xx * 10, image.yy * 10, image.ancho * 10, image.alto * 10);
        }
    }

    imprimirImagen(xx, yy, ancho, alto, fichero) {
        if (this.aprevisualizacion != true && this.afichero != true) {
            this.imp_pdf.Image(fichero, xx * 10, yy * 10, ancho * 10, alto * 10);
        }
    }

    filecarpetagrabacion() {
        //var dire_temporal_completo = "temporal/"._SESSION['clave'] + "_USER"._SESSION['id_user'];
        var dire_temporal_completo = "temporal";
        return "./" + dire_temporal_completo + "/UsuarioTreu";
    }

    carpex() {
        this.carpetalistados = this.filecarpetagrabacion();
    }

    isAbierta() {
        return this.estaabierta;
    }

    hexdec(val) {
        var hex = parseInt(val, 16);
        return hex;
    }

    convertir(ser) {
        var valo = "";
        for (var i = 1; i <= ser.length; i++) {
            var puesto = false;
            if (ser[i - 1] == 'Ñ') {
                valo += 'N';
                puesto = true;
            }
            if (ser[i - 1] == 'ñ') {
                valo += 'n'
                puesto = true;
            }
            if (ser[i - 1] == 'É') {
                valo += 'E'
                puesto = true;
            }
            if (ser[i - 1] == 'Á') {
                valo += 'A'
                puesto = true;
            }
            if (ser[i - 1] == 'Í') {
                valo += 'I'
                puesto = true;
            }
            if (ser[i - 1] == 'Ó') {
                valo += 'O'
                puesto = true;
            }
            if (ser[i - 1] == 'Ú') {
                valo += 'U'
                puesto = true;
            }
            if (ser[i - 1] == 'é') {
                valo += 'e'
                puesto = true;
            }
            if (ser[i - 1] == 'á') {
                valo += 'a'
                puesto = true;
            }
            if (ser[i - 1] == 'í') {
                valo += 'i'
                puesto = true;
            }
            if (ser[i - 1] == 'ó') {
                valo += 'o'
                puesto = true;
            }
            if (ser[i - 1] == 'ú') {
                valo += 'u'
                puesto = true;
            }
            if (ser[i - 1] == 'º') {
                valo += ' '
                puesto = true;
            }
            if (puesto == false) {
                valo += ser[i - 1];
            }
        }
        return valo;
    }

    borrarFicherosSalida() {

        var fiche = fs.openSync(this.filecarpetagrabacion() + "/ListadoTexto.pdf", "w");
        fs.closeSync(fiche);
 
        var fiche = fs.openSync(this.filecarpetagrabacion() + "/ListadoTexto.txt", "w");
        fs.closeSync(fiche);
 
    }

}

module.exports = {
    Treu_print_courier_pdf: Treu_print_courier_pdf
}