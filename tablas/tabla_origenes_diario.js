tablaSQL = require("./TablaSQL");

class TablaOrigenesDiario extends tablaSQL.TablaSQL {

    clave_origen;
    titulo;

    constructor(co) {
        super(co, "ORIGENES_DIARIO");
        this.setPrimaryIndex();
        this.setCampos();
    }

    // Tratamiento del campo ClaveOrigen

    setClaveOrigen(clav) {
        this.clave_origen = clav;
        super.setString("CLAVE_ORIGEN", this.clave_origen);
    }
    getClaveOrigen() {
        this.clave_origen = super.getString("CLAVE_ORIGEN");
        return this.clave_origen;
    }
    addFirstClaveOrigen(opcio, valo) {
        super.addFirstTermString("CLAVE_ORIGEN", opcio, valo);
    }
    addAndClaveOrigen(opcio, valo) {
        super.addAndTermString("CLAVE_ORIGEN", opcio, valo);
    }
    addOrClaveOrigen(opcio, valo) {
        super.addOrTermString("CLAVE_ORIGEN", opcio, valo);
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

    // Tratamiento del indice principal

    async getByPrimaryIndex(clav) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {
            this.rs = await this.con.query(this.pstmtin[0], [clav]);
            if (this.rs.rows.length > 0) {
                this.rs_actual = 0;
                ret = true;
            }
        } catch (ex) {
            super.errorSQL();
        }
        return ret;
    }

    // Tratamiento del indice principal

    async deleteByPrimaryIndex(clav) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {

            var res=await this.con.query(this.pstmtin[1], [clav]);

            if (res['rowCount']>0) {
                ret = true;
            }

        } catch (ex) {
            super.errorSQL(ex);
        }
        return ret;
    }

	async updateRow(clav) {
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
				comando += " where CLAVE_ORIGEN ='" + clav + "'";
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
        this.pstmtin.push("SELECT * FROM ORIGENES_DIARIO WHERE CLAVE_ORIGEN = $1");
        this.pstmtin.push("DELETE FROM ORIGENES_DIARIO WHERE CLAVE_ORIGEN = $1");
    }

    setCampos() {
        super.addCampo("CLAVE_ORIGEN", String.class);
        super.addCampo("TITULO", String.class);
    }

}
module.exports = {
    TablaOrigenesDiario: TablaOrigenesDiario
}