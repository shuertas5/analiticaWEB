const { form } = require("../treu/formato");
tablaSQL = require("./TablaSQL");

class TablaRepartoPptoGlobal extends tablaSQL.TablaSQL {

    uno = 1;
    cifras;

    constructor(co) {
        super(co, "REPARTO_PPTO_GLOBAL");
        this.isJDBCon = true;
        this.setPrimaryIndex();
        this.setCampos();
        this.cifras = this.iniciarArray(13);
    }

    // Tratamiento del campo uno

    setUno(un) {
        this.uno = un;
        super.setInt("UNO", this.uno);
    }
    getUno() {
        this.uno = super.getInt("UNO");
        return this.uno;
    }
    addFirstUno(opcio, valo) {
        super.addFirstTermInt("UNO", opcio, valo);
    }
    addAndUno(opcio, valo) {
        super.addAndTermInt("UNO", opcio, valo);
    }
    addOrUno(opcio, valo) {
        super.addOrTermInt("UNO", opcio, valo);
    }

    // Tratamiento del campo cifras

    setCifras(cif) {
        var i;
        for (i = 1; i <= 12; i++) {
            this.cifras[i] = cif[i-1];
        }
        for (i = 1; i <= 12; i++) {
            var campo = "REP_MES" + form("##", i, "0");
            super.setBigDecimal(campo, this.cifras[i]);
        }
    }

    getCifras() {
        var i;
        var calcu;
        var salcif = Array();
        for (i = 1; i <= 12; i++) {
            var campo = "REP_MES" + form("##", i, "0");
            calcu = super.getBigDecimal(campo);
            this.cifras[i] = calcu;
            salcif.push(calcu);
        }
        return salcif;
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
        this.pstmtin.push("SELECT * FROM REPARTO_PPTO_GLOBAL WHERE UNO = '1' ");
        this.pstmtin.push("DELETE FROM REPARTO_PPTO_GLOBAL WHERE UNO = '1' ");
    }

    setCampos() {
        super.addCampo("UNO", Number.class);
        for (var i = 1; i <= 12; i++) {
            super.addCampo("REP_MES" + form("##", i, "0"), Number.class);
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
    TablaRepartoPptoGlobal: TablaRepartoPptoGlobal
}