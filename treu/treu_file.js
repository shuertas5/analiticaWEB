const fs = require('fs');
const iconv = require('iconv-lite');

class TreuFile {

	MAXBUFFER = 8000;

	srcfile;    //File 
	path;       // String

	posicion = 0;
	filebuffer;    //char[] 
	salibuffer;   //StringBuffer = string
	buffer;   //byte[] 
	posbuffer;
	lonbuffer;
	grabacaracterbuffer;   //boolean 

	//canalentrada;  //FileInputStream 
	//canalsalida;  //FileOutputStream
	entrada = false;
	salida = false;

	encoding = 'utf8';

	regposi = 0;  // Nos indica la posicion en registros delimitados

	delimitado = false;
	separador = ';';
	comillas = true;
	americano = false;

	constructor(seri) {

		this.srcfile = null;
		this.path = seri;

		this.filebuffer = new Array();  //of chars
		this.salibuffer = "";

		this.buffer = new Array(this.MAXBUFFER);  //of bytes
		this.posbuffer = 1;
		this.lonbuffer = this.MAXBUFFER;
		this.grabacaracterbuffer = false;
	}

	setEncoding(enco) {
		this.encoding = enco;
	}

	setNameFile(seri) {
		this.srcfile = null;
		this.path = seri;
	}

	existe() {
		return fs.existsSync(this.path);
	}

	static existeFichero(file) {
		return fs.existsSync(file);
	}

	static existeDirectorio(directorio) {
		return fs.existsSync(directorio);
	}

	static crearDirectorio(directorio) {
		return fs.mkdir(directorio);
	}

	longitud() {
		return fs.statsSync(this.srcfile).size;
	}

	setDelimitado(boo) {
		this.delimitado = boo;
	}

	setSeparador(car) {
		this.separador = car;
	}

	setComillas(boo) {
		this.comillas = boo;
	}

	setAmericano(boo) {
		this.americano = boo;
	}

	abrirFichero(forma) {

		if (forma === "w" || forma === "a") {
			if (!this.existe()) {
				//this.srcfile.createNewFile();
			}
		}

		if (forma === "r") {
			this.posicion = 0;
			this.entrada = true;
			this.salida = false;
			this.srcfile = fs.openSync(this.path, forma);
		}

		if (forma === "w") {
			this.posicion = 0;
			this.entrada = false;
			this.salida = true;
			this.srcfile = fs.openSync(this.path, forma);
		}

		if (forma === "a") {
			this.posicion = 0;
			this.entrada = false;
			this.salida = true;
			this.srcfile = fs.openSync(this.path, 'rw');
		}
	}

	cerrarFichero() {

		if (this.entrada == true) {
			fs.closeSync(this.srcfile);
		}

		if (this.salida == true) {
			fs.closeSync(this.srcfile);
		}

	}

	getCode = (byte) => {
		const text = byte.toString(16);
		if (byte < 16) {
			return '%0' + text;
		}
		else if (byte > 127) {
			return '';
		}
		return '%' + text;
	};

	toString_code = (bytes) => {
		var result = '';
		for (var i = 0; i < bytes.length; ++i) {
			result += this.getCode(bytes[i]);
		}
		return decodeURIComponent(result);
	};

	toString = (bytes) => {
		var result = '';
		for (var i = 0; i < bytes.length; ++i) {
			result += String.fromCharCode(bytes[i]);
		}
		return result;
	};

	toString_ANSI(bytes) {
		var result = '';
		for (var i = 0; i < bytes.length; ++i) {
			if (bytes[i] <= 127) {
				result += String.fromCharCode(bytes[i]);
			}
			else if (bytes[i] == 209) {
				result += 'Ñ';
			}
			else if (bytes[i] == 241) {
				result += 'ñ';
			}
			else if (bytes[i] == 186) {
				result += 'º';
			}
			else if (bytes[i] == 193) {
				result += 'Á';
			}
			else if (bytes[i] == 201) {
				result += 'É';
			}
			else if (bytes[i] == 205) {
				result += 'Í';
			}
			else if (bytes[i] == 211) {
				result += 'Ó';
			}
			else if (bytes[i] == 218) {
				result += 'Ú';
			}
			else if (bytes[i] == 225) {
				result += 'á';
			}
			else if (bytes[i] == 233) {
				result += 'é';
			}
			else if (bytes[i] == 237) {
				result += 'í';
			}
			else if (bytes[i] == 243) {
				result += 'ó';
			}
			else if (bytes[i] == 250) {
				result += 'ú';
			}
		}
		return result;
	}

	leerRegistro() {

		var car;
		var posi;
		var buffer = Buffer.alloc(1);
		var byteArray = new Array();
		var con_retorno = false;

		if (this.entrada == false) {
			return false;
		}

		posi = -1;

		//if (this.canalentrada.readableLength == 0) return false;

		car = '\0'.charCodeAt(0);
		var red = fs.readSync(this.srcfile, buffer, 0, 1, this.posicion);

		car = buffer[0];

		if (red == false) return false;

		this.posicion++;

		while (car != "\n".charCodeAt(0)) {

			posi++;

			if (car == '\0'.charCodeAt(0)) {
				car = ' '.charCodeAt(0);
			}

			if (car == '\r'.charCodeAt(0)) {
				car = '\0'.charCodeAt(0);
				con_retorno = true;
			}
			else {
				byteArray.push(car);
			}

			var red = fs.readSync(this.srcfile, buffer, 0, 1, this.posicion);
			car = buffer[0];

			if (red == false) break;

			this.posicion++;
		}

		if (posi == -1) return false;

		var sal;
		if (this.encoding == 'utf8') {
			sal = this.toString(byteArray);
		}
		else if (this.encoding == 'latin1') {
			sal = this.toString_ANSI(byteArray);
		}
		this.filebuffer = sal;
		this.regposi = 0;

		return true;
	}

	leerRegistroCifrado() {

		var car;
		var posi;
		var buffer = Buffer.alloc(1);
		var byteArray = Array();
		var byteArraycar = Array();
		var con_retorno = false;

		byteArraycar.push('0');

		if (this.entrada == false) {
			return false;
		}

		posi = -1;

		car = '\0'.charCodeAt(0);
		var red = fs.readSync(this.srcfile, buffer, 0, 1, this.posicion);
		byteArraycar[0] = buffer[0];

		if (red == false) return '';

		var sal = String.fromCharCode(...byteArraycar);
		car = descifrar(sal);
		byteArray.push(car.charCodeAt());

		this.posicion++;

		while (car != '\n'.charCodeAt(0)) {

			posi++;
			if (car == '\r'.charCodeAt(0)) {
				car = '\0'.charCodeAt(0);
				con_retorno = true;
			}
			else {
				byteArray.push(car.charCodeAt());
			}

			var red = fs.readSync(this.srcfile, buffer, 0, 1, this.posicion);
			byteArraycar[0] = buffer[0];

			if (red == false) break;

			sal = String.fromCharCode(...byteArraycar);
			car = descifrar(sal);

			this.posicion++;
		}

		if (posi == -1) return false;

		var sal;
		if (this.encoding == 'utf8') {
			sal = this.toString(byteArray);
		}
		else if (this.encoding == 'latin1') {
			sal = this.toString_ANSI(byteArray);
		}
		this.filebuffer = sal;
		this.regposi = 0;

		return true;
	}

	byteLength(str) {
		// returns the byte length of an utf8 string
		var s = str.length;
		for (var i = str.length - 1; i >= 0; i--) {
			var code = str.charCodeAt(i);
			if (code > 0x7f && code <= 0x7ff) s++;
			else if (code > 0x7ff && code <= 0xffff) s += 2;
			if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
		}
		return s;
	}

	grabarRegistro(sal) {

		var car;
		var posi;
		var bytes = [];

		if (this.salida == false) {
			return false;
		}

		posi = 0;

		car = sal[posi];

		while (car != '\0') {

			fs.writeSync(this.srcfile, car, this.posicion, 'UTF-8');
			this.posicion += this.byteLength(car);

			posi++;
			car = sal[posi];

		}

		car = '\r';
		fs.writeSync(this.srcfile, car, this.posicion, 'UTF-8');
		this.posicion += this.byteLength(car);

		car = '\n';
		fs.writeSync(this.srcfile, car, this.posicion, 'UTF-8');
		this.posicion += this.byteLength(car);

		return true;

	}

	grabarRegistroCifrado(sal) {

		var car;
		var posi;

		if (this.salida == false) {
			return false;
		}

		posi = 0;

		car = sal[posi];

		while (car != '\0') {

			fs.writeSync(this.srcfile, cifrar(car), this.posicion, 'UTF-8');
			this.posicion += this.byteLength(cifrar(car));

			posi++;
			car = sal[posi];
		}

		if (posi > 0) {

			fs.writeSync(this.srcfile, cifrar('\r'), this.posicion, 'UTF-8');
			this.posicion += this.byteLength(cifrar('\r'));

			fs.writeSync(this.srcfile, cifrar('\n'), this.posicion, 'UTF-8');
			this.posicion += this.byteLength(cifrar('\n'));

			return true;
		}

		return false;
	}

	grabarString(seri) {

		var sal;
		var car;
		var posi;
		var lon;

		lon = seri.length;
		sal = Array.from(seri);

		if (this.salida == false) {
			return false;
		}

		posi = 0;

		while (posi < lon) {

			car = sal[posi];

			fs.writeSync(this.srcfile, car, this.posicion, 'UTF-8');
			this.posicion += this.byteLength(car);

			posi++;
		}

		return true;

	}

	numCampos() {

		var numero = 0;
		var longit;
		var dentro;
		var comi;
		var i;
		var num;
		var car;
		var registro;

		if (this.delimitado == false) return 0;

		registro = this.filebuffer;
		longit = registro.length;

		if (longit == 0) return 0;

		if (this.comillas == false) {
			num = 1;
			for (i = 0; i <= longit - 1; i++) {
				car = registro.charAt(i);
				if (car == this.separador) {
					num++;
				}
			}
			numero = num;
		}

		if (this.comillas == true) {
			num = 1;
			dentro = false;
			comi = false;
			for (i = 0; i <= longit - 1; i++) {
				car = registro.charAt(i);
				if (car == this.separador && dentro == false) num++;
				if (car == '\"' && dentro == false) {
					dentro = true;
				} else if (car == '\"' && dentro == true) {
					if (i < longit - 1 && registro.charAt(i + 1) != '\"' && comi == false) {
						dentro = false;
						continue;
					}
					if (comi == true) {
						comi = false;
						continue;
					}
					comi = true;
				}
			}
			numero = num;
		}

		return numero;

	}

	iraCampo(posici) {

		var longit;
		var num;
		var dentro;
		var comi;
		var i;
		var car;
		var registro;

		if (this.delimitado == false) {
			this.regposi = 0;
			return false;
		}

		if (posici == 1) {
			this.regposi = 0;
			return true;
		}

		if (posici > this.numCampos()) {
			this.regposi = 0;
			return false;
		}

		registro = this.filebuffer;
		longit = registro.length;

		if (longit == 0) {
			this.regposi = 0;
			return false;
		}

		if (this.comillas == false) {
			num = 1;
			this.regposi = 0;
			for (i = 0; i <= longit - 1; i++) {
				car = registro.charAt(i);
				if (car == this.separador) num++;
				if (num == posici) {
					this.regposi = i + 1;
					break;
				}
			}
		}

		if (this.comillas == true) {
			num = 1;
			dentro = false;
			comi = false;
			for (i = 0; i <= longit - 1; i++) {
				car = registro.charAt(i);
				if (car == this.separador && dentro == false) num++;
				if (car == '\"' && dentro == false) {
					dentro = true;
					comi = false;
				} else if (car == '\"' && dentro == true) {
					if (i < longit - 1 && registro.charAt(i + 1) != '\"' && comi == false) {
						dentro = false;
						continue;
					}
					if (comi == true) {
						comi = false;
						continue;
					}
					comi = true;
				}
				if (num == posici) {
					this.regposi = i + 1;
					break;
				}
			}
		}

		return true;
	}

	valorNumero(posici) {

		var valor = 0;
		var inicio = 0;
		var fin = 0;
		var longit;
		var retor;
		var registro;
		var campo;

		registro = this.filebuffer;
		longit = registro.length;

		if (longit == 0) return 0;

		retor = this.iraCampo(posici);
		if (retor == true) inicio = this.regposi; else inicio = longit - 1;

		retor = this.iraCampo(posici + 1);
		if (retor == true) fin = this.regposi - 2; else fin = longit - 1;

		if (fin >= inicio) {
			campo = registro.substring(inicio, fin + 1);
			if (this.americano == false) {
				var campi = "";
				for (var i = 1; i <= campo.length; i++) {
					if (campo[i - 1] == ',') {
						campi += '.';
					}
					else {
						campi += campo[i - 1];
					}
				}
				campo = campi;
			}
			valor = parseFloat(campo);
		}

		return valor;
	}

	valorBoolean(posici) {

		var retorno = false;
		var inicio = 0;
		var fin = 0;
		var longit;
		var retor;
		var registro;
		var campo;

		registro = this.filebuffer;
		longit = registro.length;

		if (longit == 0) return retorno;

		retor = this.iraCampo(posici);
		if (retor == true) inicio = this.regposi; else inicio = longit - 1;

		retor = this.iraCampo(posici + 1);
		if (retor == true) fin = this.regposi - 2; else fin = longit - 1;

		if (fin >= inicio) {
			campo = registro.substring(inicio, fin + 1);
			campo.toLowerCase();
			if (campo === "yes" || campo === "true" || campo === "si" || campo === "1") retorno = true;
			if (campo === "no" || campo === "false" || campo === "0") retorno = false;
		}
		return retorno;
	}

	valorFecha(posici, formato) {

		var retorno = null;
		var inicio = 0;
		var fin = 0;
		var longit;
		var dia;
		var mes;
		var anni;
		var anno;
		var retor;
		var registro;
		var campo;

		registro = this.filebuffer;
		longit = registro.length;

		if (longit == 0) return retorno;

		retor = this.iraCampo(posici);
		if (retor == true) inicio = this.regposi; else inicio = longit - 1;

		retor = this.iraCampo(posici + 1);
		if (retor == true) fin = this.regposi - 2; else fin = longit - 1;

		if (fin >= inicio) {
			campo = registro.substring(inicio, fin + 1);
			if (formato === "B") {
				dia = Math.round(parseInt(campo.substring(0, 2)));
				mes = Math.round(parseInt(campo.substring(3, 5)));
				anni = Math.round(parseInt(campo.substring(6, 8)));
				if (anni < 50) anno = anni + 2000; else anno = anni + 1900;
				retorno = new Date(anno, mes - 1, dia);
			}
			if (formato === "A") {
				dia = Math.round(parseInt(campo.substring(0, 2)));
				mes = Math.round(parseInt(campo.substring(3, 5)));
				anni = Math.round(parseInt(campo.substring(6, 10)));
				retorno = new Date(anni, mes - 1, dia);
			}
		}

		return retorno;
	}

	valorSerie(posici) {

		var retorno;
		var inicio = 0;
		var fin = 0;
		var longit;
		var retor;
		var registro;
		var campo;
		var campo2;
		var max;

		retorno = "";

		registro = this.filebuffer;
		longit = registro.length;

		if (longit == 0) return retorno;

		retor = this.iraCampo(posici);
		if (retor == true) inicio = this.regposi; else inicio = longit - 1;

		retor = this.iraCampo(posici + 1);
		if (retor == true) fin = this.regposi - 2; else fin = longit - 1;

		if (fin >= inicio) {
			campo = registro.substring(inicio, fin + 1);
			if (this.comillas == true) {
				campo = campo.substring(1, campo.length - 1);
				max = campo.length;
				campo2 = "";
				for (var i = 1; i <= max; i++) {
					if (i != max && campo.charAt(i - 1) == '\"' && campo.charAt(i) == '\"') continue;
					campo2 += campo.charAt(i - 1);
				}
				retorno = campo2;
			}
			if (this.comillas == false) retorno = campo;
		}
		return retorno;
	}

	setCharAt(str, index, chr) {
		if (index > str.length) {
			return str;
		} else if (index == str.length) {
			return str.substring(0, index) + chr;
		}
		else {
			return str.substring(0, index) + chr + str.substring(index + 1);
		}
	}

	grabarCampoNumero(valor, formato, fin) {

		var campo;
		var mod;
		var i;
		var lon;

		if (this.americano == true) mod = "Amk"; else mod = "mk";

		campo = form(formato, valor, mod);
		//campo = strpack.exe(campo);

		lon = this.salibuffer.length;
		this.salibuffer = this.salibuffer.substring(0, lon + campo.length);

		for (i = 0; i <= campo.length - 1; i++) {
			this.salibuffer = this.setCharAt(this.salibuffer, lon + i, campo.charAt(i));
		}
		if (fin == false) {
			this.salibuffer = this.salibuffer.substring(0, this.salibuffer.length + 1);
			this.salibuffer = this.setCharAt(this.salibuffer, this.salibuffer.length, this.separador);
		}
	}

	grabarCampoFecha(fechax, formato, fin) {

		var campo;
		var mod;
		var i;
		var lon;

		//campo = fechax.forfecha(formato, "");
		//campo = strpack.exe(campo);

		lon = salibuffer.length;
		this.salibuffer.substring(0, lon + campo.length);

		for (i = 0; i <= campo.length - 1; i++) {
			this.salibuffer = this.setCharAt(this.salibuffer, lon + i, campo.charAt(i));
		}
		if (fin == false) {
			this.salibuffer = this.salibuffer.substring(0, this.salibuffer.length + 1);
			this.salibuffer = this.setCharAt(this.salibuffer, this.salibuffer.length, this.separador);
		}
	}

	grabarCampoBoolean(boo, formato, fin) {

		var campo;
		var mod;
		var i;
		var lon;

		campo = "";
		if (boo == true) {
			if (formato === "yn") campo = "yes";
			if (formato === "tf") campo = "true";
			if (formato === "sn") campo = "si";
			if (formato === "10") campo = "1";
		}
		else {
			if (formato === "yn") campo = "no";
			if (formato === "tf") campo = "false";
			if (formato === "sn") campo = "no";
			if (formato === "10") campo = "0";
		}

		lon = this.salibuffer.length;
		this.salibuffer = this.salibuffer.substring(0, lon + campo.length);

		for (i = 0; i <= campo.length - 1; i++) {
			this.salibuffer = this.setCharAt(this.salibuffer, lon + i, campo.charAt(i));
		}
		if (fin == false) {
			this.salibuffer = this.salibuffer.substring(0, this.salibuffer.length + 1);
			this.salibuffer = this.setCharAt(this.salibuffer, this.salibuffer.length, this.separador);
		}
	}

	grabarCampoSerie(serie, fin) {

		var campo;
		var campop;
		var i;
		var lon;

		for (var i = 0; i < serie.length; i++) {
			if (serie.substring(serie.length - 1) == ' ') {
				serie = serie.substring(0, serie.length - 1);
			}
			else {
				break;
			}
		}
		campop = serie;
		var campox = "";
		campox = "";

		if (this.comillas == true) {
			campox += "\"";
			for (i = 0; i <= campop.length - 1; i++) {
				if (campop.charAt(i) == '\"') {
					campox += "\"";
				}
				campox += campop.charAt(i);
			}
			campox += "\"";
			campo = campox;
		}
		else {
			campo = serie;
		}

		lon = this.salibuffer.length;
		this.salibuffer = this.salibuffer.substring(0, lon + campo.length);

		for (i = 0; i <= campo.length - 1; i++) {
			this.salibuffer = this.setCharAt(this.salibuffer, lon + i, campo.charAt(i));
		}

		if (fin == false) {
			this.salibuffer = this.salibuffer.substring(0, this.salibuffer.length + 1);
			this.salibuffer = this.setCharAt(this.salibuffer, this.salibuffer.length, this.separador);
		}
	}

	grabarBuffer() {

		var cadena;
		var lon;
		var i;
		cadena = "";

		lon = this.salibuffer.length;
		for (i = 1; i <= lon; i++) {
			cadena += this.salibuffer.charAt(i - 1);
		}
		cadena += '\0';

		this.grabarRegistro(cadena);
		this.salibuffer = ""
	}

	grabarBufferCifrado() {

		var cadena;
		var lon;
		var i;
		cadena = new char[2000];

		lon = this.salibuffer.length;
		for (i = 1; i <= lon; i++) {
			cadena[i - 1] = this.salibuffer.charAt(i - 1);
		}
		cadena[lon] = '\0';

		this.grabarRegistroCifrado(cadena);
		this.salibuffer = "";
	}

	leerCaracter(car) {

		/*if (this.entrada == false) {
			return false;
		}

		if (this.canalentrada.length == 0) return false;

		car[1] = '\0';
		car[0] = this.canalentrada.read(1);
		posicion++;
		return true;*/
	}

	grabarCaracter(car) {

		if (this.salida == false) {
			return false;
		}

		fs.writeSync(this.srcfile, car, this.posicion, 'UTF-8');
		this.posicion += this.byteLength(car);

		return true;
	}

	grabarCaracterBuffer(car) {

		if (this.salida == false) {
			return false;
		}

		this.grabacaracterbuffer = true;

		if (this.posbuffer <= this.MAXBUFFER) {
			this.buffer[this.posbuffer - 1] = car;
			this.posbuffer++;
		}

		return true;
	}

	cifrar(car) {

		var resto;
		var numconva;
		var care;
		var vector;

		vector = new int[25];

		vector[0] = 120;
		vector[1] = 125;
		vector[2] = 80;
		vector[3] = 114;
		vector[4] = 74;
		vector[5] = 50;
		vector[6] = 96;
		vector[7] = 110;
		vector[8] = 123;
		vector[9] = 62;
		vector[10] = 77;
		vector[11] = 89;
		vector[12] = 105;
		vector[13] = 57;
		vector[14] = 109;
		vector[15] = 91;
		vector[16] = 63;
		vector[17] = 99;
		vector[18] = 75;
		vector[19] = 52;
		vector[20] = 125;
		vector[21] = 97;
		vector[22] = 104;
		vector[23] = 46;
		vector[24] = 98;

		resto = posicion % 25;
		numconva = car;
		numconva = numconva + vector[resto];
		if (numconva > 255) numconva = numconva - 256;
		care = numconva;
		return care;
	}

	descifrar(car) {

		var resto;
		var numconva;
		var care;
		var vector;

		vector = new int[25];

		vector[0] = 120;
		vector[1] = 125;
		vector[2] = 80;
		vector[3] = 114;
		vector[4] = 74;
		vector[5] = 50;
		vector[6] = 96;
		vector[7] = 110;
		vector[8] = 123;
		vector[9] = 62;
		vector[10] = 77;
		vector[11] = 89;
		vector[12] = 105;
		vector[13] = 57;
		vector[14] = 109;
		vector[15] = 91;
		vector[16] = 63;
		vector[17] = 99;
		vector[18] = 75;
		vector[19] = 52;
		vector[20] = 125;
		vector[21] = 97;
		vector[22] = 104;
		vector[23] = 46;
		vector[24] = 98;

		resto = posicion % 25;
		numconva = car;
		numconva = numconva - vector[resto];
		if (numconva < 0) numconva = numconva + 256;
		care = numconva;
		return care;
	}

	static copiarFicheros(fileOrigen, fileDestino) {

		var fientrada;  //FileInputStream
		var fisalida;    //FileOutputStream 
		var buffer = Buffer.alloc(1);

		// Abrir Ficheros

		fientrada = fs.openSync(fileOrigen, 'r');
		fisalida = fs.openSync(fileDestino, 'w');

		// Copiar Contenido

		var posicion = 0;

		fs.readSync(fientrada, buffer, 0, 1, null);

		while (true) {

			fs.writeSync(fisalida, buffer, 0, 1, posicion);
			posicion++;

			var red = fs.readSync(fientrada, buffer, 0, 1, null);

			if (red == false) break;

		}

		// Cerrar Ficheros

		fs.closeSync(fientrada);
		fs.closeSync(fisalida);

		return true;
	}

	setReadOnly(set) {
		/*if (set == true) {
			this.srcfile.setReadOnly();
		}
		else {
			this.srcfile.setWritable(true);
		}*/
	}

	borrarFichero() {
		var salida;
		salida = fs.unlinkSync(this.path);
		return salida;
	}

	asignarregistroexterno(text) {
		this.lonbuffer = text.length;
		for (var i = 1; i <= this.lonbuffer; i++) {
			this.filebuffer[i - 1] = text.charAt(i - 1);
		}
	}

	static eliminarPorExtension(path, extension) {

		/*var archivos = new File(path).listFiles(new FileFilter() {

			accept(archivo) {

				if (archivo.isFile())
					return archivo.getName().endsWith('.' + extension);

				return false;

			}
		});

		for (archivo in archivos) {
			archivo.delete();
		}*/
	}

	static saveUrlToFile(saveFile, location) {

		/*var url;
		url = new URL(location);

		var inx = fs.createReadStream(new InputStreamReader(url.openStream(), "utf-8"));
		var out = fs.createWriteStream(saveFile);
		var inputLine;
		while ((inputLine = inx.readline()) != null) {
			out.write(inputLine);
		}

		inx.end();
		out.end();*/
	}

	static readFile(file, separator) {

		/*var reader = null;  //BufferedReader 
		reader = fs.createReadStream(file);

		var line = null;
		var stringBuilder = "";
		var ls = separator;

		while ((line = reader.readline()) != null) {
			stringBuilder += line;
			stringBuilder += ls;
		}

		reader.end();
		return stringBuilder;*/
	}

}

module.exports = {
	TreuFile: TreuFile
}