tablaSQL = require("./TablaSQL");

class TablaLineas extends tablaSQL.TablaSQL {

	static ACUMULADO_SUMA_MESES = 0;
	static ACUMULADO_DATO_EXTRA = 1;
	static ACUMULADO_MEDIA_ANUAL = 2;
	static ACUMULADO_MEDIA_12_MESES = 3;

	hoja;
	linea;
	titulo;
	refhoja;
	reflinea;
	invisible;
	pasadacalculo;
	detotales;
	intensa;
	blanca;
	sumable;
	estadistica;
	condecimales;
	caracterblanco;
	noacumulable;
	conporcentaje;
	reduccionamillares;
	lineademargen;
	lineadereparto;
	tipoacumulado;

	constructor(co) {
		super(co, "LINEAS");
		this.isJDBCon = true;
		this.setPrimaryIndex();
		this.setCampos();
	}

	// Tratamiento del campo hoja

	setHoja(hoj) {
		this.hoja = hoj;
		super.setInt("HOJA", this.hoja);
	}
	getHoja() {
		this.hoja = super.getInt("HOJA");
		return this.hoja;
	}
	addFirstHoja(opcio, valo) {
		super.addFirstTermInt("HOJA", opcio, valo);
	}
	addAndHoja(opcio, valo) {
		super.addAndTermInt("HOJA", opcio, valo);
	}
	addOrHoja(opcio, valo) {
		super.addOrTermInt("HOJA", opcio, valo);
	}

	// Tratamiento del campo linea

	setLinea(lin) {
		this.linea = lin;
		super.setInt("LINEA", this.linea);
	}
	getLinea() {
		this.linea = super.getInt("LINEA");
		return this.linea;
	}
	addFirstLinea(opcio, valo) {
		super.addFirstTermInt("LINEA", opcio, valo);
	}
	addAndLinea(opcio, valo) {
		super.addAndTermInt("LINEA", opcio, valo);
	}
	addOrLinea(opcio, valo) {
		super.addOrTermInt("LINEA", opcio, valo);
	}

	// Tratamiento del campo Titulo

	setTitulo(titu) {
		this.titulo = titu;
		super.setString("TITULO", this.titulo);
	}
	getTitulo() {
		this.titulo = super.getString("TITULO");
		return this.titulo;
	}
	addFirstTitulo(opcio, valo) {
		super.addFirstTermString("TITULO", opcio, valo);
	}
	addAndTitulo(opcio, valo) {
		super.addAndTermString("TITULO", opcio, valo);
	}
	addOrTitulo(opcio, valo) {
		super.addOrTermString("TITULO", opcio, valo);
	}

	// Tratamiento del campo Refhoja

	setRefHoja(hoj) {
		this.refhoja = hoj;
		super.setInt("REFHOJA", this.refhoja);
	}
	getRefHoja() {
		this.refhoja = super.getInt("REFHOJA");
		return this.refhoja;
	}
	addFirstRefHoja(opcio, valo) {
		super.addFirstTermInt("REFHOJA", opcio, valo);
	}
	addAndRefHoja(opcio, valo) {
		super.addAndTermInt("REFHOJA", opcio, valo);
	}
	addOrRefHoja(opcio, valo) {
		super.addOrTermInt("REFHOJA", opcio, valo);
	}

	// Tratamiento del campo Reflinea

	setRefLinea(lin) {
		this.reflinea = lin;
		super.setInt("REFLINEA", this.reflinea);
	}
	getRefLinea() {
		this.reflinea = super.getInt("REFLINEA");
		return this.reflinea;
	}
	addFirstRefLinea(opcio, valo) {
		super.addFirstTermInt("REFLINEA", opcio, valo);
	}
	addAndRefLinea(opcio, valo) {
		super.addAndTermInt("REFLINEA", opcio, valo);
	}
	addOrRefLinea(opcio, valo) {
		super.addOrTermInt("REFLINEA", opcio, valo);
	}

	// Tratamiento del campo Invisible

	setInvisible(invi) {
		this.invisible = invi;
		super.setBoolean("INVISIBLE", this.invisible);
	}
	getInvisible() {
		this.invisible = super.getBoolean("INVISIBLE");
		return this.invisible;
	}
	addFirstInvisible(opcio, valo) {
		super.addFirstTermBool("INVISIBLE", opcio, valo);
	}
	addAndInvisible(opcio, valo) {
		super.addAndTermBool("INVISIBLE", opcio, valo);
	}
	addOrInvisible(opcio, valo) {
		super.addOrTermBool("INVISIBLE", opcio, valo);
	}

	// Tratamiento del campo Pasada de Calculo

	setPasadaCalculo(pasada) {
		this.pasadacalculo = pasada;
		super.setInt("PASADA_CALCULO", this.pasadacalculo);
	}
	getPasadaCalculo() {
		this.pasadacalculo = super.getInt("PASADA_CALCULO");
		return this.pasadacalculo;
	}
	addFirstPasadaCalculo(opcio, valo) {
		super.addFirstTermInt("PASADA_CALCULO", opcio, valo);
	}
	addAndPasadaCalculo(opcio, valo) {
		super.addAndTermInt("PASADA_CALCULO", opcio, valo);
	}
	addOrPasadaCalculo(opcio, valo) {
		super.addOrTermInt("PASADA_CALCULO", opcio, valo);
	}

	// Tratamiento del campo de_totales

	setDeTotales(tot) {
		this.detotales = tot;
		super.setBoolean("DE_TOTALES", this.detotales);
	}
	getDeTotales() {
		this.detotales = super.getBoolean("DE_TOTALES");
		return this.detotales;
	}
	addFirstDeTotales(opcio, valo) {
		super.addFirstTermBool("DE_TOTALES", opcio, valo);
	}
	addAndDeTotales(opcio, valo) {
		super.addAndTermBool("DE_TOTALES", opcio, valo);
	}
	addOrDeTotales(opcio, valo) {
		super.addOrTermBool("DE_TOTALES", opcio, valo);
	}

	// Tratamiento del campo intensa

	setIntensa(inten) {
		this.intensa = inten;
		super.setBoolean("INTENSA", this.intensa);
	}
	getIntensa() {
		this.intensa = super.getBoolean("INTENSA");
		return this.intensa;
	}
	addFirstIntensa(opcio, valo) {
		super.addFirstTermBool("INTENSA", opcio, valo);
	}
	addAndIntensa(opcio, valo) {
		super.addAndTermBool("INTENSA", opcio, valo);
	}
	addOrIntensa(opcio, valo) {
		super.addOrTermBool("INTENSA", opcio, valo);
	}

	// Tratamiento del campo Blanca

	setBlanca(blan) {
		this.blanca = blan;
		super.setBoolean("BLANCA", this.blanca);
	}
	getBlanca() {
		this.blanca = super.getBoolean("BLANCA");
		return this.blanca;
	}
	addFirstBlanca(opcio, valo) {
		super.addFirstTermBool("BLANCA", opcio, valo);
	}
	addAndBlanca(opcio, valo) {
		super.addAndTermBool("BLANCA", opcio, valo);
	}
	addOrBlanca(opcio, valo) {
		super.addOrTermBool("BLANCA", opcio, valo);
	}

	// Tratamiento del campo Sumable

	setSumable(sum) {
		this.sumable = sum;
		super.setBoolean("SUMABLE", this.sumable);
	}
	getSumable() {
		this.sumable = super.getBoolean("SUMABLE");
		return this.sumable;
	}
	addFirstSumable(opcio, valo) {
		super.addFirstTermBool("SUMABLE", opcio, valo);
	}
	addAndSumable(opcio, valo) {
		super.addAndTermBool("SUMABLE", opcio, valo);
	}
	addOrSumable(opcio, valo) {
		super.addOrTermBool("SUMABLE", opcio, valo);
	}

	// Tratamiento del campo estadistica

	setEstadistica(estad) {
		this.estadistica = estad;
		super.setBoolean("ESTADISTICA", this.estadistica);
	}
	getEstadistica() {
		this.estadistica = super.getBoolean("ESTADISTICA");
		return this.estadistica;
	}
	addFirstEstadistica(opcio, valo) {
		super.addFirstTermBool("ESTADISTICA", opcio, valo);
	}
	addAndEstadistica(opcio, valo) {
		super.addAndTermBool("ESTADISTICA", opcio, valo);
	}
	addOrEstadistica(opcio, valo) {
		super.addOrTermBool("ESTADISTICA", opcio, valo);
	}

	// Tratamiento del campo con_decimales

	setConDecimales(conde) {
		this.condecimales = conde;
		super.setBoolean("CON_DECIMALES", this.condecimales);
	}
	getConDecimales() {
		this.condecimales = super.getBoolean("CON_DECIMALES");
		return this.condecimales;
	}
	addFirstConDecimales(opcio, valo) {
		super.addFirstTermBool("CON_DECIMALES", opcio, valo);
	}
	addAndConDecimales(opcio, valo) {
		super.addAndTermBool("CON_DECIMALES", opcio, valo);
	}
	addOrConDecimales(opcio, valo) {
		super.addOrTermBool("CON_DECIMALES", opcio, valo);
	}

	// Tratamiento del campo caracter blanco

	setCaracterBlanco(carac) {
		this.caracterblanco = carac;
		if (carac == '\0') this.caracterblanco = ' ';
		this.setChar("CARACTER_BLANCO", this.caracterblanco);
	}
	getCaracterBlanco() {
		this.caracterblanco = super.getChar("CARACTER_BLANCO");
		return this.caracterblanco;
	}
	addFirstCaracterBlanco(opcio, valo) {
		super.addFirstTermByte("CARACTER_BLANCO", opcio, valo);
	}
	addAndCaracterBlanco(opcio, valo) {
		super.addAndTermByte("CARACTER_BLANCO", opcio, valo);
	}
	addOrCaracterBlanco(opcio, valo) {
		super.addOrTermByte("CARACTER_BLANCO", opcio, valo);
	}

	// Tratamiento del campo no_acumulable

	setNoAcumulable(noacu) {
		this.noacumulable = noacu;
		super.setBoolean("NO_ACUMULABLE", this.noacumulable);
	}
	getNoAcumulable() {
		this.noacumulable = super.getBoolean("NO_ACUMULABLE");
		return this.noacumulable;
	}
	addFirstNoAcumulable(opcio, valo) {
		super.addFirstTermBool("NO_ACUMULABLE", opcio, valo);
	}
	addAndNoAcumulable(opcio, valo) {
		super.addAndTermBool("NO_ACUMULABLE", opcio, valo);
	}
	addOrNoAcumulable(opcio, valo) {
		super.addOrTermBool("NO_ACUMULABLE", opcio, valo);
	}

	// Tratamiento del campo con_porcentaje

	setConPorcentaje(conpor) {
		this.conporcentaje = conpor;
		super.setBoolean("CON_PORCENTAJE", this.conporcentaje);
	}
	getConPorcentaje() {
		this.conporcentaje = super.getBoolean("CON_PORCENTAJE");
		return this.conporcentaje;
	}
	addFirstConPorcentaje(opcio, valo) {
		super.addFirstTermBool("CON_PORCENTAJE", opcio, valo);
	}
	addAndConPorcentaje(opcio, valo) {
		super.addAndTermBool("CON_PORCENTAJE", opcio, valo);
	}
	addOrConPorcentaje(opcio, valo) {
		super.addOrTermBool("CON_PORCENTAJE", opcio, valo);
	}

	// Tratamiento del campo Reduccion a Millares

	setReduccionAMillares(redu) {
		this.reduccionamillares = redu;
		super.setBoolean("REDUCCION_A_MILLARES", this.reduccionamillares);
	}
	getReduccionAMillares() {
		this.reduccionamillares = super.getBoolean("REDUCCION_A_MILLARES");
		return this.reduccionamillares;
	}
	addFirstReduccionAMillares(opcio, valo) {
		super.addFirstTermBool("REDUCCION_A_MILLARES", opcio, valo);
	}
	addAndReduccionAMillares(opcio, valo) {
		super.addAndTermBool("REDUCCION_A_MILLARES", opcio, valo);
	}
	addOrReduccionAMillares(opcio, valo) {
		super.addOrTermBool("REDUCCION_A_MILLARES", opcio, valo);
	}

	// Tratamiento del campo Linea de margen

	setLineaDeMargen(marg) {
		this.lineademargen = marg;
		super.setBoolean("LINEA_DE_MARGEN", this.lineademargen);
	}
	getLineaDeMargen() {
		this.lineademargen = super.getBoolean("LINEA_DE_MARGEN");
		return this.lineademargen;
	}
	addFirstLineaDeMargen(opcio, valo) {
		super.addFirstTermBool("LINEA_DE_MARGEN", opcio, valo);
	}
	addAndLineaDeMargen(opcio, valo) {
		super.addAndTermBool("LINEA_DE_MARGEN", opcio, valo);
	}
	addOrLineaDeMargen(opcio, valo) {
		super.addOrTermBool("LINEA_DE_MARGEN", opcio, valo);
	}

	// Tratamiento del campo Linea de Reparto

	setLineaDeReparto(reparto) {
		this.lineadereparto = reparto;
		super.setBoolean("LINEA_DE_REPARTO", this.lineadereparto);
	}
	getLineaDeReparto() {
		this.lineadereparto = super.getBoolean("LINEA_DE_REPARTO");
		return this.lineadereparto;
	}
	addFirstLineaDeReparto(opcio, valo) {
		super.addFirstTermBool("LINEA_DE_REPARTO", opcio, valo);
	}
	addAndLineaDeReparto(opcio, valo) {
		super.addAndTermBool("LINEA_DE_REPARTO", opcio, valo);
	}
	addOrLineaDeReparto(opcio, valo) {
		super.addOrTermBool("LINEA_DE_REPARTO", opcio, valo);
	}

	// Tratamiento del campo TipoAcumulado

	setTipoAcumulado(tipo) {
		this.tipoacumulado = tipo;
		super.setInt("TIPO_ACUMULADO", this.tipoacumulado);
	}
	getTipoAcumulado() {
		this.tipoacumulado = super.getInt("TIPO_ACUMULADO");
		return this.tipoacumulado;
	}
	addFirstTipoAcumulado(opcio, valo) {
		super.addFirstTermInt("TIPO_ACUMULADO", opcio, valo);
	}
	addAndTipoAcumulado(opcio, valo) {
		super.addAndTermInt("TIPO_ACUMULADO", opcio, valo);
	}
	addOrTipoAcumulado(opcio, valo) {
		super.addOrTermInt("TIPO_ACUMULADO", opcio, valo);
	}

	// Tratamiento del indice principal

	async getByPrimaryIndex(hoj, lin) {
		var ret = false;
		if (this.abortado == true) return ret;
		try {
			this.rs = await this.con.query(this.pstmtin[0], [hoj, lin]);
			if (this.rs.rows.length > 0) {
				this.rs_actual = 0;
				ret = true;
			}
		} catch (ex) {
			super.errorSQL(ex);
		}
		return ret;
	}

	// Tratamiento del indice principal

	async deleteByPrimaryIndex(hoj, lin) {
		var ret = false;
		if (this.abortado == true) return ret;
		try {

			var res = await this.con.query(this.pstmtin[1], [hoj, lin]);

			if (res['rowCount'] > 0) {
				ret = true;
			}

		} catch (ex) {
			super.errorSQL(ex);
		}
		return ret;
	}

	async updateRow(hoj, lin) {
		var ret = false;
		if (this.abortado == true) return false;
		if (this.isJDBCon == true) {
			try {
				var comando = "update " + this.tablaName + " set ";
				for (var i = 0; i < this.campos_titulos.length; i++) {
					if (i != this.campos_titulos.length - 1) {
						comando += this.campos_titulos[i] + " = '"
						comando += this.campos_valores[i] + "', ";
					}
					else {
						comando += this.campos_titulos[i] + " = '"
						comando += this.campos_valores[i] + "' ";
					}
				}
				comando += " where HOJA='" + hoj + "' and LINEA='" + lin + "'";
				var res = await this.con.query(comando);

				if (res['rowCount'] > 0) {
					ret = true;
				}

				return ret;

			} catch (ex) {
				this.errorSQL(ex);
			}
		}

		return ret;
	}

	setPrimaryIndex() {
		this.pstmtin.push("SELECT * FROM LINEAS WHERE HOJA = $1 AND LINEA = $2");
		this.pstmtin.push("DELETE FROM LINEAS WHERE HOJA = $1  AND LINEA = $2");
	}

	setCampos() {
		super.addCampo("HOJA", Number.class);
		super.addCampo("LINEA", Number.class);
		super.addCampo("TITULO", String.class);
		super.addCampo("REFHOJA", Number.class);
		super.addCampo("REFLINEA", Number.class);
		super.addCampo("INVISIBLE", Boolean.class);
		super.addCampo("PASADA_CALCULO", Number.class);
		super.addCampo("DE_TOTALES", Boolean.class);
		super.addCampo("INTENSA", Boolean.class);
		super.addCampo("BLANCA", Boolean.class);
		super.addCampo("SUMABLE", Boolean.class);
		super.addCampo("ESTADISTICA", Boolean.class);
		super.addCampo("CON_DECIMALES", Boolean.class);
		super.addCampo("CARACTER_BLANCO", String.class);
		super.addCampo("NO_ACUMULABLE", Boolean.class);
		super.addCampo("CON_PORCENTAJE", Boolean.class);
		super.addCampo("REDUCCION_A_MILLARES", Boolean.class);
		super.addCampo("LINEA_DE_MARGEN", Boolean.class);
		super.addCampo("LINEA_DE_REPARTO", Boolean.class);
		super.addCampo("TIPO_ACUMULADO", Number.class);
	}

}
module.exports = {
    TablaLineas: TablaLineas
}