const { form } = require("../treu/formato");
tablaSQL = require("./TablaSQL");

class TablaHistoricoPresupuesto extends tablaSQL.TablaSQL {

	anno;
	hoja;
	linea;
	cifras;
	acumulado;

	constructor(co) {
		super(co, "HISTO_PRESUPUESTO");
		this.isJDBCon = true;
		this.setPrimaryIndex();
		this.setCampos();
		this.cifras = this.iniciarArray(13);
	}

	// Tratamiento del campo Año

	setAnno(ann) {
		this.anno = ann;
		super.setInt("ANNO", this.anno);
	}
	getAnno() {
		this.anno = super.getInt("ANNO");
		return this.anno;
	}
	addFirstAnno(opcio, valo) {
		super.addFirstTermInt("ANNO", opcio, valo);
	}
	addAndAnno(opcio, valo) {
		super.addAndTermInt("ANNO", opcio, valo);
	}
	addOrAnno(opcio, valo) {
		super.addOrTermInt("ANNO", opcio, valo);
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

	// Tratamiento del cifras

	setCifras(cif) {
		var i;
		for (i = 1; i <= 12; i++) {
			this.cifras[i] = cif[i-1];
		}
		for (i = 1; i <= 12; i++) {
			var campo = "MES" + form("##", i, "0");
			super.setBigDecimal(campo, this.cifras[i]);
		}
	}
	getCifras() {
		var i;
		var calcu;
		var salcif = Array();
		for (i = 1; i <= 12; i++) {
			var campo = "MES" + form("##", i, "0");
			calcu = super.getBigDecimal(campo);
			this.cifras[i] = calcu;
			salcif.push(calcu);
        }
        return salcif;
	}

	// Tratamiento del campo acumulado

	setAcumulado(acu) {
		this.acumulado = acu;
		super.setBigDecimal("ACUMULADO", this.acumulado);
	}
	getAcumulado() {
		this.acumulado = super.getBigDecimal("ACUMULADO");
		return this.acumulado;
	}
	addFirstAcumulado(opcio, valo) {
		super.addFirstTermFloat("ACUMULADO", opcio, valo);
	}
	addAndAcumulado(opcio, valo) {
		super.addAndTermFloat("ACUMULADO", opcio, valo);
	}
	addOrAcumulado(opcio, valo) {
		super.addOrTermFloat("ACUMULADO", opcio, valo);
	}

	getValorMes(mes) {
		var ret;
		var valores = this.iniciarArray(12);
		valores = this.getCifras();
		ret = valores[mes-1];
		return ret;
	}

	getValorAcumulado(mes) {

		var ret;
		var cifra;
		var valores = this.iniciarArray(12);
		var i;

		valores = this.getCifras();

		ret = 0.0;
		for (i = 1; i <= mes; i++) {
			cifra = valores[i-1];
			ret += cifra;
		}
		return ret;
	}

	getVectorCifrasMeses() {
        var valores = this.iniciarArray(12);
        var i;
        this.getCifras();
        for (i = 1; i <= 12; i++) valores[i-1] = 0;
        for (i = 1; i <= 12; i++) {
            valores[i-1] = this.cifras[i];
        }
        return valores;
	}

	getVectorCifrasAcum() {
		var valores = this.iniciarArray(12);
		var i;
		this.getCifras();
		for (i = 1; i <= 12; i++) valores[i-1] = 0;
		for (i = 1; i <= 12; i++) {
			valores[i-1] = this.cifras[i];
		}
		for (i = 12; i >= 1; i--) {
			for (var j = 1; j < i; j++) {
				valores[i-1] += valores[j-1];
			}
		}
		return valores;
	}

	// Tratamiento del indice principal

	async getByPrimaryIndex(ann, hoj, lin) {
		var ret = false;
		if (this.abortado == true) return ret;
		try {
			this.rs = await this.con.query(this.pstmtin[0], [ann, hoj, lin]);
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

	async deleteByPrimaryIndex(ann, hoj, lin) {
		var ret = false;
		if (this.abortado == true) return ret;
		try {

			var res = await this.con.query(this.pstmtin[1], [ann, hoj, lin]);

			if (res['rowCount'] > 0) {
				ret = true;
			}

		} catch (ex) {
			super.errorSQL(ex);
		}
		return ret;
	}

	async borrarAnno(ann) {
		var ret = false;
		if (this.abortado == true) return ret;
		try {

			var res = await this.con.query(this.pstmtin[2], [ann]);

			if (res['rowCount'] > 0) {
				ret = true;
			}

		} catch (ex) {
			super.errorSQL(ex);
		}
		return ret;
	}

	async updateRow(ann, hoj, lin) {
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
				comando += " where ANNO='" + ann + "' HOJA='" + hoj + "' and LINEA='" + lin + "'";
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
		this.pstmtin.push("SELECT * FROM HISTO_PRESUPUESTO WHERE ANNO= $1 AND HOJA = $2 AND LINEA = $3");
		this.pstmtin.push("DELETE FROM HISTO_PRESUPUESTO WHERE ANNO= $1 AND HOJA = $2  AND LINEA = $3");
		this.pstmtin.push("DELETE FROM HISTO_PRESUPUESTO WHERE ANNO= $1");
	}

	setCampos() {
		super.addCampo("ANNO", Number.class);
		super.addCampo("HOJA", Number.class);
		super.addCampo("LINEA", Number.class);
		super.addCampo("ACUMULADO", Number.class);
		for (var i = 1; i <= 12; i++) {
            super.addCampo("MES" + form("##", i, "0"), Number.class);
        }
	}

	iniciarArray(dim) {
		var arreglo = Array();
		for (var i = 1; i <= dim; i++) {
			arreglo.push(0);
		}
		return arreglo;
	}

}
module.exports = {
    TablaHistoricoPresupuesto: TablaHistoricoPresupuesto
}