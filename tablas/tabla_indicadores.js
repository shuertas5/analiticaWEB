tablaSQL = require("./TablaSQL");

class TablaIndicadores extends tablaSQL.TablaSQL {

    indice;
    titulo;
    encendido;

    constructor(co) {
        super(co, "INDICADORES");
        this.isJDBCon = true;
        this.setPrimaryIndex();
        this.setCampos();
    }

    // Tratamiento del campo Indice

    setIndice(ind) {
        this.indice = ind;
        this.setInt("INDICE", this.indice);
    }
    getIndice() {
        this.indice = this.getInt("INDICE");
        return this.indice;
    }

    // Tratamiento del campo Titulo

    setTitulo(titu) {
        this.titulo = titu;
        this.setString("TITULO", this.titulo);
    }
    getTitulo() {
        this.titulo = this.getString("TITULO");
        return this.titulo;
    }

    // Tratamiento del campo Encendido

    setEncendido(encen) {
        this.encendido = encen;
        this.setBoolean("ENCENDIDO", this.encendido);
    }
    getEncendido() {
        this.encendido = this.getBoolean("ENCENDIDO");
        return this.encendido;
    }

    // Tratamiento del indice principal

    async getByPrimaryIndex(ind) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {
            this.rs = await this.con.query(this.pstmtin[0], [ind]);
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

    async deleteByPrimaryIndex(ind) {
        var ret = false;
        if (abortado == true) return ret;
        try {

            var res = await this.con.query(this.pstmtin[1], [ind]);

            if (res['rowCount'] > 0) {
                ret = true;
            }

        } catch (ex) {
            super.errorSQL(ex);
        }
        return ret;
    }

    async updateRow(ind) {
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
                comando += " where INDICE='" + ind + "'";
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
        this.pstmtin.push("SELECT * FROM INDICADORES WHERE INDICE = $1");
        this.pstmtin.push("DELETE FROM INDICADORES WHERE INDICE = $1");
    }

    setCampos() {
        super.addCampo("INDICE", Number.class);
        super.addCampo("TITULO", String.class);
        super.addCampo("ENCENDIDO", Boolean.class);
    }
}
module.exports = {
    TablaIndicadores: TablaIndicadores
}