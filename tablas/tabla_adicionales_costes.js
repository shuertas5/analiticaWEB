tablaSQL = require("./TablaSQL");

class TablaAdicionalesCostes extends tablaSQL.TablaSQL {

    indice;
    titulo;
    importe;
    hoja;
    linea;
    blanca;
    grabada;
    orden;

    constructor(co) {
        super(co, "ADICIONALES_COSTES");
        this.isJDBCon = true;
        this.setPrimaryIndex();
        this.setCampos();
    }

	// Tratamiento del campo Indice

	setIndice(indi) {
		this.indice = indi;
		super.setInt("INDICE", this.indice);
	}
	getIndice() {
		this.indice = super.getInt("INDICE");
		return this.indice;
	}
	addFirstIndice(opcio, valo) {
		super.addFirstTermInt("INDICE", opcio, valo);
	}
	addAndIndice(opcio, valo) {
		super.addAndTermInt("INDICE", opcio, valo);
	}
	addOrIndice(opcio, valo) {
		super.addOrTermInt("INDICE", opcio, valo);
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

    // Tratamiento del campo importe

    setImporte(cal) {
        this.importe = cal;
        super.setBigDecimal("IMPORTE", this.importe);
    }
    getImporte() {
        this.importe = super.getBigDecimal("IMPORTE");
        return this.importe;
    }
    addFirstImporte( opcio,  valo) {
        super.addFirstTermFloat("IMPORTE", opcio, valo);
    }
    addAndImporte(opcio, valo) {
        super.addAndTermFloat("IMPORTE", opcio, valo);
    }
    addOrImporte(opcio, valo) {
        super.addOrTermFloat("IMPORTE", opcio, valo);
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

	// Tratamiento del campo Grabada

	setGrabada(gra) {
		this.grabada = gra;
		super.setBoolean("GRABADA", this.grabada);
	}
	getGrabada() {
		this.grabada = super.getBoolean("GRABADA");
		return this.grabada;
	}
	addFirstGrabada(opcio, valo) {
		super.addFirstTermBool("GRABADA", opcio, valo);
	}
	addAndGrabada(opcio, valo) {
		super.addAndTermBool("GRABADA", opcio, valo);
	}
	addOrGrabada(opcio, valo) {
		super.addOrTermBool("GRABADA", opcio, valo);
	}

	// Tratamiento del campo Orden

	setOrden(orde) {
		this.orden = orde;
		super.setString("ORDEN", this.orden);
	}
	getOrden() {
		this.orden = super.getString("ORDEN");
		return this.orden;
	}
	addFirstOrden(opcio, valo) {
		super.addFirstTermString("ORDEN", opcio, valo);
	}
	addAndOrden(opcio, valo) {
		super.addAndTermString("ORDEN", opcio, valo);
	}
	addOrOrden(opcio, valo) {
		super.addOrTermString("ORDEN", opcio, valo);
	}

	// Tratamiento del indice principal

	async getByPrimaryIndex(indi) {
		var ret = false;
		if (this.abortado == true) return ret;
		try {
			this.rs = await this.con.query(this.pstmtin[0], [indi]);
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

	async deleteByPrimaryIndex(indi) {
		var ret = false;
		if (this.abortado == true) return ret;
		try {

			var res = await this.con.query(this.pstmtin[1], [indi]);

			if (res['rowCount'] > 0) {
				ret = true;
			}

		} catch (ex) {
			super.errorSQL(ex);
		}
		return ret;
	}

	async updateRow(indi) {
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
				comando += " where INDICE='" + indi + "'";
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
		this.pstmtin.push("SELECT * FROM ADICIONALES_COSTES WHERE INDICE = $1 ");
		this.pstmtin.push("DELETE FROM ADICIONALES_COSTES WHERE INDICE = $1 ");
	}


	setCampos() {
		super.addCampo("INDICE", Number.class);
		super.addCampo("TITULO", String.class);
		super.addCampo("IMPORTE", Number.class);
		super.addCampo("HOJA", Number.class);
		super.addCampo("LINEA", Number.class);
		super.addCampo("BLANCA", Boolean.class);
		super.addCampo("GRABADA", Boolean.class);
		super.addCampo("ORDEN", String.class);
	}

}
module.exports = {
    TablaAdicionalesCostes: TablaAdicionalesCostes
}
