tablaSQL = require("./TablaSQL");

class TablaHojas extends tablaSQL.TablaSQL {

	hoja;
	titulo;
	invisible;
	hojaexterna;
	tipohoja;
	linea_resultado;
	linea_facturacion;

	constructor(co) {
		super(co, "HOJAS");
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

	// Tratamiento del campo Hoja Externa

	setHojaExterna(hoj) {
		this.hojaexterna = hoj;
		super.setString("HOJAEXTERNA", this.hojaexterna);
	}
	getHojaExterna() {
		this.hojaexterna = super.getString("HOJAEXTERNA");
		return this.hojaexterna;
	}
	addFirstHojaExterna(opcio, valo) {
		super.addFirstTermString("HOJAEXTERNA", opcio, valo);
	}
	addAndHojaExterna(opcio, valo) {
		super.addAndTermString("HOJAEXTERNA", opcio, valo);
	}
	addOrHojaExterna(opcio, valo) {
		super.addOrTermString("HOJAEXTERNA", opcio, valo);
	}

	// Tratamiento del campo Tipo Hoja

	setTipoHoja(tipo) {
		this.tipohoja = tipo;
		super.setString("TIPOHOJA", this.tipohoja);
	}
	getTipoHoja() {
		this.tipohoja = super.getString("TIPOHOJA");
		return this.tipohoja;
	}
	addFirstTipoHoja(opcio, valo) {
		super.addFirstTermString("TIPOHOJA", opcio, valo);
	}
	addAndTipoHoja(opcio, valo) {
		super.addAndTermString("TIPOHOJA", opcio, valo);
	}
	addOrTipoHoja(opcio, valo) {
		super.addOrTermString("TIPOHOJA", opcio, valo);
	}

	// Tratamiento del campo LineaResultado

	setLineaResultado(linres) {
		this.linea_resultado = linres;
		super.setInt("LINEA_RESULTADO", this.linea_resultado);
	}
	getLineaResultado() {
		this.linea_resultado = super.getInt("LINEA_RESULTADO");
		return this.linea_resultado;
	}
	addFirstLineaResultado(opcio, valo) {
		super.addFirstTermInt("LINEA_RESULTADO", opcio, valo);
	}
	addAndLineaResultado(opcio, valo) {
		super.addAndTermInt("LINEA_RESULTADO", opcio, valo);
	}
	addOrLineaResultado(opcio, valo) {
		super.addOrTermInt("LINEA_RESULTADO", opcio, valo);
	}

	// Tratamiento del campo LineaFacturacion

	setLineaFacturacion(linfac) {
		this.linea_facturacion = linfac;
		super.setInt("LINEA_FACTURACION", this.linea_facturacion);
	}
	getLineaFacturacion() {
		this.linea_facturacion = super.getInt("LINEA_FACTURACION");
		return this.linea_facturacion;
	}
	addFirstLineaFacturacion(opcio, valo) {
		super.addFirstTermInt("LINEA_FACTURACION", opcio, valo);
	}
	addAndLineaFacturacion(opcio, valo) {
		super.addAndTermInt("LINEA_FACTURACION", opcio, valo);
	}
	addOrLineaFacturacion(opcio, valo) {
		super.addOrTermInt("LINEA_FACTURACION", opcio, valo);
	}

	// Tratamiento del indice principal

	async getByPrimaryIndex(hoj) {
		var ret = false;
		if (this.abortado == true) return ret;
		try {
			this.rs = await this.con.query(this.pstmtin[0], [hoj]);
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

	async deleteByPrimaryIndex(hoj) {
		var ret = false;
		if (this.abortado == true) return ret;
		try {

			var res = await this.con.query(this.pstmtin[1], [hoj]);

			if (res['rowCount'] > 0) {
				ret = true;
			}

		} catch (ex) {
			super.errorSQL(ex);
		}
		return ret;
	}

	async updateRow(hoj) {
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
				comando += " where HOJA='" + hoj + "'";
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
		this.pstmtin.push("SELECT * FROM HOJAS WHERE HOJA = $1 ");
		this.pstmtin.push("DELETE FROM HOJAS WHERE HOJA = $1 ");
	}


	setCampos() {
		super.addCampo("HOJA", Number.class);
		super.addCampo("TITULO", String.class);
		super.addCampo("INVISIBLE", Boolean.class);
		super.addCampo("HOJAEXTERNA", String.class);
		super.addCampo("TIPOHOJA", String.class);
		super.addCampo("LINEA_RESULTADO", Number.class);
		super.addCampo("LINEA_FACTURACION",Number.class);
	}

}
module.exports = {
    TablaHojas: TablaHojas
}