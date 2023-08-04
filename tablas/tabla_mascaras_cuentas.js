const { form } = require("../treu/formato");

tablaSQL = require("./TablaSQL");

class TablaMascarasCuentas extends tablaSQL.TablaSQL {

    uno = 1;
    nummascaras;
    mascaras;

    constructor(co) {
        super(co, "MASCARAS_CUENTAS");
        this.isJDBCon = true;
        this.setPrimaryIndex();
        this.setCampos();
        this.mascaras = this.iniciarArray(16);
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

    // Tratamiento del campo Numero de Mascaras

    setNumMascaras(mas) {
        this.nummascaras = mas;
        super.setInt("NUM_MASCARAS", this.nummascaras);
    }
    getNumMascaras() {
        this.nummascaras = super.getInt("NUM_MASCARAS");
        return this.nummascaras;
    }
    addFirstNumMascaras(opcio, valo) {
        super.addFirstTermInt("NUM_MASCARAS", opcio, valo);
    }
    addAndNumMascaras(opcio, valo) {
        super.addAndTermInt("NUM_MASCARAS", opcio, valo);
    }
    addOrNumMascaras(opcio, valo) {
        super.addOrTermInt("NUM_MASCARAS", opcio, valo);
    }

    // Tratamiento del campo Mascaras

    setMascaras(num, ma) {
        var i;
        for (i = 1; i <= num; i++) {
            this.mascaras[i] = ma[i-1];
        }
        for (i = 1; i <= num; i++) {
            var campo = "MASCARA" + form("##", i, "0");
            super.setString(campo, this.mascaras[i]);
        }
    }

    getMascaras() {
        var i;
        var calcu;
        var reto=[];
        var num = this.getNumMascaras();
        for (i = 1; i <= num; i++) {
            var campo = "MASCARA" + form("##", i, "0");
            calcu = super.getString(campo);
            reto.push(calcu);
        }
        return reto;
    }

    // Tratamiento del indice principal

    async getByPrimaryIndex() {
        var ret = false;
        if (this.abortado == true) return ret;
        try {
            this.rs = await this.con.query(this.pstmtin[0], [1]);
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

            var res = await this.con.query(this.pstmtin[1], [1]);

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
        this.pstmtin.push("SELECT * FROM MASCARAS_CUENTAS WHERE UNO = $1 ");
        this.pstmtin.push("DELETE FROM MASCARAS_CUENTAS WHERE UNO = $1 ");
    }

    setCampos() {
        super.addCampo("UNO", Number.class);
        super.addCampo("NUM_MASCARAS", Number.class);
        for (var i=1; i<=15; i++) {
            super.addCampo("MASCARA"+form('##',i,"0"), String.class);
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
    TablaMascarasCuentas: TablaMascarasCuentas
}