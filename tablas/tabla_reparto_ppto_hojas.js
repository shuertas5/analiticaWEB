const { form } = require("../treu/formato");
tablaSQL = require("./TablaSQL");

class TablaRepartoPptoHojas extends tablaSQL.TablaSQL {

    hoja;
    cifras;

    constructor(co) {
        super(co, "REPARTO_PPTO_HOJAS");
        this.isJDBCon = true;
        this.setPrimaryIndex();
        this.setCampos();
        this.cifras = this.iniciarArray(13);
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
        this.pstmtin.push("SELECT * FROM REPARTO_PPTO_HOJAS WHERE HOJA = $1 ");
        this.pstmtin.push("DELETE FROM REPARTO_PPTO_HOJAS WHERE HOJA = $1 ");
    }

    setCampos() {
        super.addCampo("HOJA", Number.class);
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
    TablaRepartoPptoHojas: TablaRepartoPptoHojas
}