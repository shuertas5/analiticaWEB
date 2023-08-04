const { resolve } = require('pug-load');
const { ErrorSQLMessage } = require('./ErrorSQL.js');
formato = require("../treu/formato.js")
treu = require('../treu/treu_file.js');
errorsql = require('./ErrorSQL.js')
fecha = require('../treu/forfecha.js');
rutinas = require('../treu/rutinas_server.js');

// --------------------------------------------------------
// Clase Raiz de Tabla SQL
// --------------------------------------------------------

class TablaSQL {

	// Campos del Fichero

	MAXCAMPOS = 575;

	campos = [];
	tiposcampos = [];

	campos_titulos = [];
	campos_valores = [];

	formatofechas = "Y###-M0-D0";

	//private TreuTable tablaLigada;

	abortado = false;
	visualizarerrorescero = true;
	abortarerrorescero = true;
	listacamposstr = "";

	parentesisabierto = false;
	parentesispuesto = false;
	parentesis = "";
	pendientenot = false;
	notstr = "";

	conectada = false;

	// Interfase JDBC

	con = null;  //protected Connection 

	rs_actual = 0;
	rs = null;   //protected ResultSet 
	rscount = null; //protected ResultSet 

	// Definicion de indices

	pstmtin = [];    //protected PreparedStatement

	tablaName = "";
	comando = "";
	comandocount = "";
	indexcomando = "";

	direccion = 0;
	prime = false;
	ordenby = "";
	comandotxt = "";

	// Constantes

	static OPERA_QUERY = 1;
	static OPERA_COMPILADA = 2;
	static OPERA_PROCEDURE = 3;

	static LIKE = 100;
	static IS_NULL = 110;
	static IS_NOT_NULL = 120;

	static BTR_EQ = 1;
	static BTR_NOT_EQ = 2;
	static BTR_LESS = 3;
	static BTR_LESS_OR_EQ = 4;
	static BTR_GR = 5;
	static BTR_GR_OR_EQ = 6;

	static TYPE_SCROLL_SENSITIVE = 0;
	static CONCUR_UPDATABLE = 1;

	// otras variables

	tipooperacion = 0;
	numrows = 0;
	tiporesultset = 0;

	ficherolog = "";
	alog = false;

	isJDBCon = false;

	conFicheroLog(log) {
		this.alog = true;
		this.ficherolog = log;
	}

	constructor(co, nombreFichero) {

		this.parentesisabierto = false;
		this.parentesispuesto = false;
		this.pendientenot = false;
		this.parentesis = "";
		this.notstr = "";
		this.con = co;
		this.tablaName = nombreFichero;
		this.abortado = false;
		this.tipooperacion = this.OPERA_QUERY;

		this.campos = new Array();
		this.tiposcampos = new Array();

		this.isJDBCon = true;

	}

	reconexion(co) {

		this.parentesisabierto = false;
		this.pendientenot = false;
		this.parentesis = "";
		this.notstr = "";
		this.con = co;
		this.abortado = false;
		this.tipooperacion = this.OPERA_QUERY;

		this.pstmtin = [];

		this.campos = new Array();
		this.tiposcampos = new Array();

		this.isJDBCon = true;

		//this.setPrimaryIndex();
		this.conectada = true;
	}

	setAbortarErroresCero(stat) {
		this.abortarerrorescero = stat;
	}

	getAbortarErroresCero() {
		return this.abortarerrorescero;
	}

	setVisualizarErroresCero(stat) {
		this.visualizarerrorescero = stat;
	}

	errorSQL() {
		var ex = new ErrorSQLMessage();
		if (this.alog == false) {
			var ventana = new errorsql.ErrorSQL(this);
			ventana.descripcion = "Error Accediendo a Tabla SQL : " + this.tablaName + "\r\n";
			ventana.descripcion += "Texto del Error              : " + ex.getMessage() + " ( Codigo = " + ex.getErrorCode() + " )" + "\r\n";
			ventana.descripcion += "Comando Ejecución            : " + this.comandotxt + "\r\n";
			ventana.codigo = ex.getErrorCode();
			ventana.isJDBCon = this.isJDBCon;
			if ((ex.getErrorCode() != 0 && ex.getErrorCode() != 100) || this.visualizarerrorescero == true) {
				ventana.visuaventana();
				if ((ex.getErrorCode() != 0 && ex.getErrorCode() != 100) || this.abortarerrorescero == true) {
					//this.abortado = true;
				}
			}
		}
		else {
			var treuFile = new TreuFile(ficherolog);
			treuFile.abrirFichero("a");
			treuFile.grabarString("Error Accediendo a Tabla SQL : " + this.tablaName + "\r\n");
			treuFile.grabarString("Texto del Error              : " + ex.getMessage() + " ( Codigo = " + ex.getErrorCode() + " )" + "\r\n");
			treuFile.grabarString("Comando  Ejecución           : " + this.comandotxt + "\r\n");
			treuFile.grabarString(repeser('-', 80) + "\r\n");
			if ((ex.getErrorCode() != 0 && ex.getErrorCode() != 100) || this.visualizarerrorescero == true) {
				if ((ex.getErrorCode() != 0 && ex.getErrorCode() != 100) || this.abortarerrorescero == true) {
					treuFile.grabarString("Aplicacion Abortada a las " + forfecha("B", Utilidades.FechatoDate(Fecha.fechaActual()), "") + " " + Utilidades.getMomento() + "\r\n");
					treuFile.grabarString(Utilidades.repeser('*', 80) + "\r\n");
					//this.abortado = true;
					//System.exit(1);
				}
			}
			treuFile.cerrarFichero();
		}

		//abortado=true;
	}

	async startTransaccion() {
		if (this.isJDBCon == true) {
			try {
				var comando = "begin transaction"
				await this.con.query(comando);
			} catch (ex) {
				this.errorSQL(ex);
			}
		}
	}

	async endTransaccion() {
		if (this.isJDBCon == true) {
			try {
				var comando = "commit"
				await this.con.query(comando);
			} catch (ex) {
				this.errorSQL(ex);
			}
		}
	}

	async abortTrasaccion() {
		if (this.isJDBCon == true) {
			try {
				var comando = "rollback transaction"
				await this.con.query(comando);
			} catch (ex) {
				this.errorSQL(ex);
			}
		}
	}

	/*commit() {
		if (this.isJDBCon == true) {
			try {
				con.commit();
				absolute(-1);
			} catch (ex) {
				errorSQL(ex);
			}
		}
	}*/

	async reset() {
		salida = await open();
		return salida;
	}

	setIndex(nomIndex) {
		this.indexcomando = "SELECT * FROM " + this.tablaName + " WHERE ";
		this.prime = true;
	}

	setIndexValuesString(column, dato) {
		if (this.isJDBCon == true) {
			if (this.prime == false) {
				this.indexcomando = this.indexcomando + " AND ";
			}
			else {
				this.prime = false;
			}
			this.indexcomando = this.indexcomando + column + "='" + dato + "'";
		}
	}

	setIndexValuesInt(column, dato) {
		if (this.isJDBCon == true) {
			if (this.prime == false) {
				this.indexcomando = this.indexcomando + " AND ";
			}
			else {
				this.prime = false;
			}
			this.indexcomando = this.indexcomando + column + "=" + formato.form("###########", dato, "mk");
		}
	}

	setIndexValuesFloat(column, dato) {
		if (this.isJDBCon == true) {
			if (this.prime == false) {
				this.indexcomando = this.indexcomando + " AND ";
			}
			else {
				this.prime = false;
			}
			this.indexcomando = this.indexcomando + column + "=" + formato.form("###########.#######", dato, "Amk");
		}
	}

	setIndexValuesDate(column, dato) {
		if (this.prime == false) {
			this.indexcomando = this.indexcomando + " AND ";
		}
		else {
			this.prime = false;
		}
		this.indexcomando = this.indexcomando + column + "=" + forfecha("B", dato, "");
	}

	async getByIndex(cmd) {
		var ret = false;
		if (this.abortado == true) return false;
		if (this.isJDBCon == true) {
			try {
				this.rs = await this.con.query(this.indexcomando);
				if (this.rs.rows.length > 0) {
					this.rs_actual = 0;
					ret = true;
				}
			} catch (ex) {
				errorSQL(ex);
			}
		}
		return ret;
	}

	setString(columna, dato) {
		if (this.abortado == true) return;
		if (this.findcampo(columna) == false) return;
		if (this.isJDBCon == true) {
			this.campos_titulos.push(columna);
			this.campos_valores.push(dato);
		}
	}

	setDouble(columna, dato) {
		if (this.abortado == true) return;
		if (this.findcampo(columna) == false) return;
		if (this.isJDBCon == true) {
			this.campos_titulos.push(columna);
			this.campos_valores.push(dato);
		}
	}

	setFloat(columna, dato) {
		if (this.abortado == true) return;
		if (this.findcampo(columna) == false) return;
		if (this.isJDBCon == true) {
			this.campos_titulos.push(columna);
			this.campos_valores.push(dato);
		}
	}

	setBigDecimal(columna, dato) {
		if (this.abortado == true) return;
		if (this.findcampo(columna) == false) return;
		if (this.isJDBCon == true) {
			this.campos_titulos.push(columna);
			this.campos_valores.push(dato);
		}
	}

	setInt(columna, dato) {
		if (this.abortado == true) return;
		if (this.findcampo(columna) == false) return;
		if (this.isJDBCon == true) {
			this.campos_titulos.push(columna);
			this.campos_valores.push(dato);
		}
	}

	setDate(columna, dato) {
		if (this.abortado == true) return;
		if (this.findcampo(columna) == false) return;
		if (this.isJDBCon == true) {
			this.campos_titulos.push(columna);
			this.campos_valores.push(dato);
		}
	}

	setBoolean(columna, dato) {
		if (this.abortado == true) return;
		if (this.findcampo(columna) == false) return;
		if (this.isJDBCon == true) {
			this.campos_titulos.push(columna);
			this.campos_valores.push(this.parseBoolean(dato));
		}
	}

	setByte(columna, dato) {
		if (this.abortado == true) return;
		if (this.findcampo(columna) == false) return;
		if (this.isJDBCon == true) {
			this.campos_titulos.push(columna);
			this.campos_valores.push(dato);
		}
	}

	setChar(columna, dato) {
		if (this.abortado == true) return;
		if (this.findcampo(columna) == false) return;
		if (this.isJDBCon == true) {
			this.campos_titulos.push(columna);
			this.campos_valores.push(dato);
		}
	}

	getString(columna) {
		var salida = "";
		var fila = [];
		if (this.abortado == true) return salida;
		if (this.findcampo(columna) == false) return "";
		if (this.isJDBCon == true) {
			fila = this.rs.rows[this.rs_actual];
			salida = fila[columna.toLowerCase()];
			if (salida == null) salida = "";
		}
		return salida;
	}

	getDouble(columna) {
		var salida = 0;
		var fila = [];
		if (this.abortado == true) return salida;
		if (this.isJDBCon == true) {
			fila = this.rs.rows[this.rs_actual];
			salida = parseFloat(fila[columna.toLowerCase()]);
		}
		return salida;
	}

	getFloat(columna) {
		var salida = 0;
		var fila = [];
		if (this.abortado == true) return salida;
		if (this.isJDBCon == true) {
			fila = this.rs.rows[this.rs_actual];
			salida = parseFloat(fila[columna.toLowerCase()]);
		}
		return salida;
	}

	getBoolean(columna) {
		var salida = false;
		var fila = [];
		if (this.abortado == true) return salida;
		if (this.isJDBCon == true) {
			fila = this.rs.rows[this.rs_actual];
			salida = fila[columna.toLowerCase()];
		}
		return this.parseBoolean(salida);
	}

	getByte(columna) {
		var salida = '\0';
		var fila = [];
		if (this.abortado == true) return salida;
		if (this.isJDBCon == true) {
			fila = this.rs.rows[this.rs_actual];
			salida = fila[columna.toLowerCase()];
		}
		return salida;
	}

	getChar(columna) {
		var salida = '\0';
		var fila = [];
		if (this.abortado == true) return salida;
		if (this.isJDBCon == true) {
			fila = this.rs.rows[this.rs_actual];
			salida = fila[columna.toLowerCase()];
		}
		return salida;
	}

	getBigDecimal(columna) {
		var salida = 0.0;
		var fila = [];
		if (this.abortado == true) return salida;
		if (this.isJDBCon == true) {
			fila = this.rs.rows[this.rs_actual];
			salida = parseFloat(fila[columna.toLowerCase()]);
		}
		return salida;
	}

	getInt(columna) {
		var salida = 0;
		var fila = [];
		if (this.abortado == true) return salida;
		if (this.isJDBCon == true) {
			fila = this.rs.rows[this.rs_actual];
			salida = parseInt(fila[columna.toLowerCase()]);
		}
		return salida;
	}

	getDate(columna) {
		var fec = null;
		var fila = [];
		if (this.abortado == true) return fec;
		if (this.isJDBCon == true) {
			fila = this.rs.rows[this.rs_actual];
			fec = fila[columna.toLowerCase()];
		}
		return fec;
	}

	getNext() {
		var ret = false;
		if (this.abortado == true) return ret;
		if (this.isJDBCon == true) {
			var pos = this.rs_actual;
			if (pos + 1 < this.rs.rows.length && pos + 1 >= 0) {
				this.rs_actual = pos + 1;
				ret = true;
			}
		}
		return ret;
	}

	getPrevio() {
		ret = false;
		if (this.abortado == true) return ret;
		if (this.isJDBCon == true) {
			var pos = this.rs_actual;
			if (pos - 1 < this.rs.rows.length && pos - 1 >= 0) {
				this.rs_actual = pos - 1;
				ret = true;
			}
		}
		return ret;
	}

	getFirst() {
		var ret = false;
		if (this.abortado == true) return ret;
		if (this.isJDBCon == true) {
			if (this.rs.rows.length > 0) {
				this.rs_actual = 0;
				ret = true;
			}
		}
		return ret;
	}

	getLast() {
		var ret = false;
		if (this.abortado == true) return ret;
		if (this.isJDBCon == true) {
			if (this.rs.rows.length > 0) {
				this.rs_actual = this.rs.rows.length - 1;
				ret = true;
			}
		}
		return ret;
	}

	getRelative(ava) {
		var ret = false;
		if (this.abortado == true) return ret;
		if (this.isJDBCon == true) {
			var pos = this.rs_actual;
			if (pos + ava < this.rs.rows.length && pos + ava >= 0) {
				this.rs_actual = pos + ava;
			}
			ret = true;
		}
		return ret;
	}

	insertRow() {
		if (this.abortado == true) return;
		if (this.campos_valores.length == 0) return;
		if (this.isJDBCon == true) {
			try {
				var comando = "insert into " + this.tablaName + " (";
				for (var i = 0; i < this.campos_titulos.length; i++) {
					if (i != this.campos_titulos.length - 1) {
						comando += this.campos_titulos[i] + ", ";
					}
					else {
						comando += this.campos_titulos[i] + ") ";
					}
				}
				comando += " values ("
				for (var i = 0; i < this.campos_titulos.length; i++) {
					if (i != this.campos_titulos.length - 1) {
						comando += "'" + this.campos_valores[i] + "', ";
					}
					else {
						comando += "'" + this.campos_valores[i] + "')";
					}
				}
				this.con.query(comando);
			} catch (ex) {
				this.errorSQL(ex);
			}
		}
	}

	deleteRow() {
		/*if (this.abortado == true) return;
		if (this.isJDBCon == true) {
		}*/
	}

	registroBlanco() {
		this.campos_valores = [];
		this.campos_titulos = [];
	}

	getRow() {
		/*if (tiporesultset==ResultSet.TYPE_SCROLL_INSENSITIVE) {
			try {
				return rs.getRow();
			} catch (SQLException ex) {
				errorSQL(ex);
			}
		}*/
		//return this.ultimalinea;
		/*if (abortado==true) return posicion;
		try {
			posicion=rs.getRow();
		} catch (SQLException ex) {
			errorSQL(ex);
		}
		return posicion;*/
	}

	absolute(fil) {

		var ret = false;
		if (this.abortado == true) return ret;
		if (this.isJDBCon == true) {
			if (fil < this.rs.rows.length && fil >= 0) {
				this.rs_actual = fil;
			}
			ret = true;
		}
		return ret;
	}

	// --------------------------------------------------------------
	// Funciones Comparativas para Series
	// --------------------------------------------------------------

	addFirstTermString(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (opcio != 0) {
				if (this.parentesisabierto == true) this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comando = this.comando + this.termino(NombColum, opcio, valo, true);
				if (this.parentesisabierto == true) this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comandocount = this.comandocount + this.termino(NombColum, opcio, valo, true);
			}
			else {
				this.comando = "SELECT * FROM " + this.tablaName;
				this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName;
			}
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addAndTermString(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " AND " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " AND " + this.notstr + " ";
			this.comando = comando + this.termino(NombColum, opcio, valo, true);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " AND " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " AND " + this.notstr + " ";
			this.comandocount = comandocount + this.termino(NombColum, opcio, valo, true);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addOrTermString(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " OR " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " OR " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, valo, true);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " OR " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " OR " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, valo, true);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	// ---------------------------------------------------------------
	// Funciones Comparativas para Numeros Enteros
	// ---------------------------------------------------------------

	addFirstTermInt(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (opcio != 0) {
				if (this.parentesisabierto == true) this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comando = this.comando + this.termino(NombColum, opcio, formato.form("#########", valo, "mk"), false);
				if (this.parentesisabierto == true) this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comandocount = this.comandocount + this.termino(NombColum, opcio, formato.form("#########", valo, "mk"), false);
			}
			else {
				this.comando = "SELECT * FROM " + this.tablaName;
				this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName;
			}
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addAndTermInt(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " AND " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " AND " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, formato.form("#########", valo, "mk"), false);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " AND " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " AND " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, formato.form("#########", valo, "mk"), false);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addOrTermInt(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " OR " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " OR " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, formato.form("#########", valo, "mk"), false);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " OR " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " OR " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, formato.form("#########", valo, "mk"), false);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	// ----------------------------------------------------------------------
	// Funciones Comparativas para numeros Reales
	// ----------------------------------------------------------------------

	addFirstTermFloat(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (opcio != 0) {
				if (this.parentesisabierto == true) this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comando = this.comando + this.termino(NombColum, opcio, formato.form("##########.######", valo, "Amk"), false);
				if (this.parentesisabierto == true) this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comandocount = this.comandocount + this.termino(NombColum, opcio, formato.form("##########.######", valo, "Amk"), false);
			}
			else {
				this.comando = "SELECT * FROM " + this.tablaName;
				this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName;
			}
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addAndTermFloat(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " AND " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " AND " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, formato.form("##########.######", valo, "Amk"), false);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " AND " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " AND " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, formato.form("##########.######", valo, "Amk"), false);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addOrTermFloat(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " OR " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " OR " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, formato.form("##########.######", valo, "Amk"), false);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " OR " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " OR " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, formato.form("##########.######", valo, "Amk"), false);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	// -------------------------------------------------------------------------
	// Funciones Comparativas para Campos Fechas
	// -------------------------------------------------------------------------

	addFirstTermDate(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (opcio != 0) {
				if (this.parentesisabierto == true) this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comando = this.comando + this.termino(NombColum, opcio, fecha.forfecha(this.formatofechas, valo, ""), true);
				if (this.parentesisabierto == true) this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comandocount = this.comandocount + this.termino(NombColum, opcio, fecha.forfecha(this.formatofechas, valo, ""), true);
			}
			else {
				this.comando = "SELECT * FROM " + this.tablaName;
				this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName;
			}
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addAndTermDate(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " AND " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " AND " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, fecha.forfecha(this.formatofechas, valo, ""), true);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " AND " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " AND " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, fecha.forfecha(this.formatofechas, valo, ""), true);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addOrTermDate(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " OR " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " OR " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, fecha.forfecha(this.formatofechas, valo, ""), true);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " OR " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " OR " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, fecha.forfecha(this.formatofechas, valo, ""), true);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	// -------------------------------------------------------------------------
	// Funciones Comparativas para Campos Logicos
	// -------------------------------------------------------------------------

	addFirstTermBool(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (opcio != 0) {
				if (this.parentesisabierto == true) this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comando = this.comando + this.termino(NombColum, opcio, rutinas.BooleantoString(valo, "T"), false);
				if (this.parentesisabierto == true) this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comandocount = this.comandocount + this.termino(NombColum, opcio, rutinas.BooleantoString(valo, "T"), false);
			}
			else {
				this.comando = "SELECT * FROM " + this.tablaName;
				this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName;
			}
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addAndTermBool(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " AND " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " AND " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, rutinas.BooleantoString(valo, "T"), false);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " AND " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " AND " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, rutinas.BooleantoString(valo, "T"), false);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addOrTermBool(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " OR " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " OR " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, rutinas.BooleantoString(valo, "T"), false);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " OR " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " OR " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, rutinas.BooleantoString(valo, "T"), false);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	// -------------------------------------------------------------------------
	// Funciones Comparativas para Campos Bytes
	// -------------------------------------------------------------------------

	addFirstTermByte(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (opcio != 0) {
				if (this.parentesisabierto == true) this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comando = this.comando + this.termino(NombColum, opcio, "" + valo, false);
				if (this.parentesisabierto == true) this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comandocount = this.comandocount + this.termino(NombColum, opcio, "" + valo, false);
			}
			else {
				this.comando = "SELECT * FROM " + this.tablaName;
				this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName;
			}
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addAndTermByte(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " AND " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " AND " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, "" + valo, false);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " AND " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " AND " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, "" + valo, false);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addOrTermByte(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " OR " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " OR " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, "" + valo, false);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " OR " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " OR " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, "" + valo, false);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	// -------------------------------------------------------------------------
	// Funciones Comparativas para Campos Char
	// -------------------------------------------------------------------------

	addFirstTermChar(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (opcio != 0) {
				if (this.parentesisabierto == true) this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comando = "SELECT * FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comando = this.comando + this.termino(NombColum, opcio, "" + valo, false);
				if (this.parentesisabierto == true) this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ( " + this.parentesis; else this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName + " WHERE " + this.notstr + " ";
				this.comandocount = this.comandocount + this.termino(NombColum, opcio, "" + valo, false);
			}
			else {
				this.comando = "SELECT * FROM " + this.tablaName;
				this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName;
			}
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addAndTermChar(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " AND " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " AND " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, "" + valo, false);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " AND " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " AND " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, "" + valo, false);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	addOrTermChar(NombColum, opcio, valo) {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) this.comando = this.comando + " OR " + this.notstr + " ( " + this.parentesis; else this.comando = this.comando + " OR " + this.notstr + " ";
			this.comando = this.comando + this.termino(NombColum, opcio, "" + valo, false);
			if (this.parentesisabierto == true) this.comandocount = this.comandocount + " OR " + this.notstr + " ( " + this.parentesis; else this.comandocount = this.comandocount + " OR " + this.notstr + " ";
			this.comandocount = this.comandocount + this.termino(NombColum, opcio, "" + valo, false);
		}
		if (this.parentesisabierto == true) {
			this.parentesispuesto = true;
			this.parentesisabierto = false;
		}
		this.parentesis = "";
		this.pendientenot = false;
		this.notstr = "";
	}

	// --------------------------------------------------------------------------------------

	abrirparentesis() {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == true) {
				this.parentesis = "( ";
			}
			else {
				this.parentesisabierto = true;
				this.parentesis = "";
			}
		}
	}

	cerrarparentesis() {
		if (this.isJDBCon == true) {
			if (this.parentesispuesto == true) {
				this.comando = this.comando + " )";
				this.comandocount = this.comandocount + " )";
				this.parentesispuesto = false;
			}
			this.parentesisabierto = false;
		}
	}

	// --------------------------------------------------------------------------------------

	dropAllTerms() {
		if (this.isJDBCon == true) {
			this.comando = "";
			this.comandocount = "";
		}
	}

	async open() {
		var ret = 0;
		if (this.abortado == true) return ret;
		ret = await this.open2(TablaSQL.OPERA_QUERY, TablaSQL.TYPE_SCROLL_SENSITIVE);
		return ret;
	}

	async open2(opcion, scroll) {
		var ret = 0;
		if (this.abortado == true) return ret;
		ret = await this.open3(opcion, scroll, TablaSQL.CONCUR_UPDATABLE);
		return ret;
	}

	async open3(opcion, scroll, cursor) {

		var salida = 0;

		if (this.con == null) {
			this.abortado = true;
			return salida;
		}

		var comando2;

		if (this.abortado == true) return salida;

		var comandotxt = this.comando;

		if (this.isJDBCon == true) {
			try {
				if (this.comando == null || this.comando === "") {
					this.comando = "SELECT * FROM " + this.tablaName;
					this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName;
					comandotxt = this.comando;
				}
				if (opcion == TablaSQL.OPERA_QUERY) {

					this.tipooperacion = TablaSQL.OPERA_QUERY;

					if (this.ordenby === "") {
						comando2 = this.comando;
					}
					else {
						comando2 = this.comando + " order by " + this.ordenby;
					}

					this.rs = await this.con.query(comando2);
					this.rscount = await this.con.query(this.comandocount);

				}

			} catch (ex) {
				this.errorSQL(ex);
			}
		}
		else {
			salida = this.getRowCount();
		}

		comandotxt = "";

		return salida;
	}

	async getRowCount() {
		var ret = 0;
		this.comandotxt = this.comandocount;
		if (this.abortado == true) return ret;
		if (this.isJDBCon == true) {
			try {
				if (this.comandocount == null || this.comandocount === "") {
					this.comandocount = "SELECT COUNT(*) FROM " + this.tablaName;
					this.comandotxt = this.comandocount;
				}
				var sali = await this.con.query(this.comandotxt);
				ret = sali.rows[0].count;
				this.numrows = ret;
			} catch (ex) {
				this.errorSQL(ex);
			}
		}
		this.comandotxt = "";
		return ret;
	}

	termino(columna, relacion, valo, comillas) {
		var salida;
		salida = columna;
		if (relacion == this.IS_NULL) {
			salida = salida + " IS NULL ";
			return salida;
		}
		if (relacion == this.IS_NOT_NULL) {
			salida = salida + " IS NOT NULL ";
			return salida;
		}
		if (relacion == TablaSQL.BTR_EQ) salida = salida + " = ";
		if (relacion == TablaSQL.BTR_NOT_EQ) salida = salida + " <> ";
		if (relacion == TablaSQL.BTR_LESS) salida = salida + " < ";
		if (relacion == TablaSQL.BTR_LESS_OR_EQ) salida = salida + " <= ";
		if (relacion == TablaSQL.BTR_GR) salida = salida + " > ";
		if (relacion == TablaSQL.BTR_GR_OR_EQ) salida = salida + " >= ";
		if (relacion == TablaSQL.LIKE) salida = salida + " LIKE ";
		if (comillas == true) salida = salida + "'";
		salida = salida + valo;
		if (comillas == true) salida = salida + "'";
		return salida;
	}

	isJDBC() {
		return this.isJDBCon;
	}

	addCampo(tit, tipo) {
		this.campos.push(tit);
		this.tiposcampos.push(tipo);
		if (this.listacamposstr !== "") this.listacamposstr += ",";
		this.listacamposstr += "\"" + tit + "\"";
	}

	getValor(tit) {
		var obj = null;
		if (this.tiposcampos.get(this.campos.indexOf(tit)) == String.class) {
			obj = this.getString(tit);
		}
		if (tiposcampos.get(campos.indexOf(tit)) == Number.class) {
			obj = this.getInt(tit);
		}
		if (tiposcampos.get(campos.indexOf(tit)) == Number.class) {
			obj = this.getDouble(tit);
		}
		if (tiposcampos.get(campos.indexOf(tit)) == Date.class) {
			obj = this.getDate(tit);
		}
		if (tiposcampos.get(campos.indexOf(tit)) == Boolean.class) {
			obj = this.getBoolean(tit);
		}
		return obj;
	}

	setOrdenBy(orden) {
		this.ordenby = orden;
	}

	getResultSet() {
		return this.rs.rows;
	}

	async ejecutaSQL(coman) {
		this.comandotxt = coman;
		if (this.isJDBCon == true) {
			try {
				this.rs = await this.con.query(this.comandotxt);
			} catch (ex) {
				this.errorSQL(ex);
			}
		}
		this.comandotxt = "";
	}

	getFormatoFecha() {
		return this.formatofechas;
	}

	// ------------------------------------------------------------
	// Negacion en sentencia SQL
	// ------------------------------------------------------------

	addNot() {
		if (this.isJDBCon == true) {
			if (this.parentesisabierto == false) {
				this.comando = this.comando + " NOT ";
				this.comandocount = this.comandocount + " NOT ";
				this.pendientenot = false;
				this.notstr = "";
			}
			else {
				this.pendientenot = true;
				this.notstr = "NOT";
			}
		}
	}

	setPrimaryIndex() {
	}

	estaconectada() {
		return this.conectada;
	}

	findcampo(camp) {
		for (var i = 0; i < this.campos.length; i++) {
			if (this.campos[i] == camp) {
				return true;
			}
		}
		return false;
	}

	parseBoolean(str) {
		return /^true$/i.test(str);
	}

}

module.exports = {
	TablaSQL: TablaSQL
}