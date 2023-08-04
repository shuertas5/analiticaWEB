tablaSQL = require("./TablaSQL");

class TablaConfiguracionApp extends tablaSQL.TablaSQL {

	uno;
	escudo_portada;
	ancho_escudo_portada;
	alto_escudo_portada;
	escudo_pantalla;
	ancho_escudo_pantalla;
	alto_escudo_pantalla;

	constructor(co) {
		super(co, "CONFIGURACION_APP");
		this.isJDBCon = true;
		this.setPrimaryIndex();
		this.setCampos();
		this.uno = 1;
	}

	// Tratamiento del campo uno

	setUno() {
		this.uno = 1;
		super.setInt("UNO", this.uno);
	}
	getUno() {
		this.uno = super.getInt("UNO");
		return this.uno;
	}

	// Tratamiento del campo Escudo Portada

	setEscudoPortada(escu) {
		this.escudo_portada = escu;
		super.setString("ESCUDO_PORTADA", this.escudo_portada);
	}
	getEscudoPortada() {
		this.escudo_portada = super.getString("ESCUDO_PORTADA");
		return this.escudo_portada;
	}

	// Tratamiento del campo AnchoEscudoPortada

	setAnchoEscudoPortada(nume) {
		this.ancho_escudo_portada = nume;
		super.setInt("ANCHO_ESCUDO_PORTADA", this.ancho_escudo_portada);
	}
	getAnchoEscudoPortada() {
		this.ancho_escudo_portada = super.getInt("ANCHO_ESCUDO_PORTADA");
		return this.ancho_escudo_portada;
	}

	// Tratamiento del campo AltoEscudoPortada

	setAltoEscudoPortada(nume) {
		this.alto_escudo_portada = nume;
		super.setInt("ALTO_ESCUDO_PORTADA", this.alto_escudo_portada);
	}
	getAltoEscudoPortada() {
		this.alto_escudo_portada = super.getInt("ALTO_ESCUDO_PORTADA");
		return this.alto_escudo_portada;
	}

	// Tratamiento del campo EscudoPantallaPrincipal

	setEscudoPantallaPrincipal(escu) {
		this.escudo_pantalla = escu;
		super.setString("ESCUDO_PANTALLA", this.escudo_pantalla);
	}
	getEscudoPantallaPrincipal() {
		this.escudo_pantalla = super.getString("ESCUDO_PANTALLA");
		return this.escudo_pantalla;
	}

	// Tratamiento del campo AnchoEscudoPantallaPrincipal

	setAnchoEscudoPantallaPrincipal(nume) {
		this.ancho_escudo_pantalla = nume;
		super.setInt("ANCHO_ESCUDO_PANTALLA", this.ancho_escudo_pantalla);
	}
	getAnchoEscudoPantallaPrincipal() {
		this.ancho_escudo_pantalla = super.getInt("ANCHO_ESCUDO_PANTALLA");
		return this.ancho_escudo_pantalla;
	}

	// Tratamiento del campo AltoEscudoPantallaPrincipal

	setAltoEscudoPantallaPrincipal(nume) {
		this.alto_escudo_pantalla = nume;
		super.setInt("ALTO_ESCUDO_PANTALLA", this.alto_escudo_pantalla);
	}
	getAltoEscudoPantallaPrincipal() {
		this.alto_escudo_pantalla = super.getInt("ALTO_ESCUDO_PANTALLA");
		return this.alto_escudo_pantalla;
	}
   
	// Tratamiento del indice principal

	async getByPrimaryIndex() {
		var ret = false;
		if (this.abortado == true) return ret;
		try {
			this.rs = await this.con.query(this.pstmtin[0]);
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

	async deleteByPrimaryIndex() {
		var ret = false;
		if (this.abortado == true) return ret;
		try {

			var res = await this.con.query(this.pstmtin[1]);

			if (res['rowCount'] > 0) {
				ret = true;
			}

		} catch (ex) {
			super.errorSQL(ex);
		}
		return ret;
	}

	async updateRow() {
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
				comando += " where UNO='1'";
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
		this.pstmtin.push("SELECT * FROM CONFIGURACION_APP WHERE UNO = 1");
		this.pstmtin.push("DELETE FROM CONFIGURACION_APP WHERE UNO = 1");
	}

	setCampos() {
		super.addCampo("UNO", Number.class);
		super.addCampo("ESCUDO_PORTADA", String.class);
		super.addCampo("ANCHO_ESCUDO_PORTADA", Number.class);
		super.addCampo("ALTO_ESCUDO_PORTADA", Number.class);
		super.addCampo("ESCUDO_PANTALLA", String.class);
		super.addCampo("ANCHO_ESCUDO_PANTALLA", Number.class);
		super.addCampo("ALTO_ESCUDO_PANTALLA", Number.class);
	}
}

module.exports = {
	TablaConfiguracionApp: TablaConfiguracionApp
}  

