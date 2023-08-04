tablaSQL = require("./TablaSQL");

class TablaTiposHojas extends tablaSQL.TablaSQL {

    constructor(co) {
        super(co, "TIPOS_HOJAS");
        this.setPrimaryIndex();
        this.setCampos();
    }

    // Tratamiento del campo Tipo

    setTipo(tip) {
        this.tipo = tip;
        super.setString("TIPO", this.tipo);
    }
    getTipo() {
        this.tipo = super.getString("TIPO");
        return this.tipo;
    }
    addFirstTipo(opcio, valo) {
        super.addFirstTermString("TIPO", opcio, valo);
    }
    addAndTipo(opcio, valo) {
        super.addAndTermString("TIPO", opcio, valo);
    }
    addOrTipo(opcio, valo) {
        super.addOrTermString("TIPO", opcio, valo);
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

    async getByPrimaryIndex(tip) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {
            this.rs = await this.con.query(this.pstmtin[0], [tip]);
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

    async deleteByPrimaryIndex(tip) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {

            var res=await this.con.query(this.pstmtin[1], [tip]);

            if (res['rowCount']>0) {
                ret = true;
            }

        } catch (ex) {
            super.errorSQL(ex);
        }
        return ret;
    }

	async updateRow(tip) {
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
				comando += " where TIPO='" + tip + "'";
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
        this.pstmtin.push("SELECT * FROM TIPOS_HOJAS WHERE TIPO = $1");
        this.pstmtin.push("DELETE FROM TIPOS_HOJAS WHERE TIPO = $1");
    }

    setCampos() {
        super.addCampo("TIPO", String.class);
        super.addCampo("TITULO", String.class);
    }

}
module.exports = {
    TablaTiposHojas: TablaTiposHojas
}