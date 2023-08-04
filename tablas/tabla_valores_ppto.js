tablaSQL = require("./TablaSQL");

class TablaValoresPresupuesto extends tablaSQL.TablaSQL {

    hoja;
    linea;
    presupuesto;
    grabada;

    constructor(co) {
        super(co, "VALORES_PPTO");
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
    addOrLinea( opcio, valo) {
        super.addOrTermInt("LINEA", opcio, valo);
    }

    // Tratamiento del campo presupuesto

    setPresupuesto(ppto) {
        this.presupuesto = ppto;
        super.setBigDecimal("PRESUPUESTO", this.presupuesto);
    }
    getPresupuesto() {
        this.presupuesto = super.getBigDecimal("PRESUPUESTO");
        return this.presupuesto;
    }
    addFirstPresupuesto(opcio, valo) {
        super.addFirstTermFloat("PRESUPUESTO", opcio, valo);
    }
    addAndPresupuesto( opcio,  valo) {
        super.addAndTermFloat("PRESUPUESTO", opcio, valo);
    }
    addOrPresupuesto( opcio,  valo) {
        super.addOrTermFloat("PRESUPUESTO", opcio, valo);
    }

    // Tratamiento del campo Grabada

    setGrabada(grab) {
        this.grabada = grab;
        super.setBoolean("GRABADA", this.grabada);
    }
    getGrabada() {
        this.grabada = super.getBoolean("GRABADA");
        return this.grabada;
    }
    addFirstGrabada( opcio,  valo) {
        super.addFirstTermBool("GRABADA", opcio, valo);
    }
    addAndGrabada( opcio,  valo) {
        super.addAndTermBool("GRABADA", opcio, valo);
    }
    addOrGrabada( opcio,  valo) {
        super.addOrTermBool("GRABADA", opcio, valo);
    }

    // Tratamiento del indice principal

    async getByPrimaryIndex(hoj, lin) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {
            this.rs = await this.con.query(this.pstmtin[0], [hoj, lin]);
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

    async deleteByPrimaryIndex(hoj, lin) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {

            var res = await this.con.query(this.pstmtin[1], [hoj, lin]);

            if (res['rowCount'] > 0) {
                ret = true;
            }

        } catch (ex) {
            super.errorSQL(ex);
        }
        return ret;
    }

    async deleteValoresHoja(hoj) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {

            var res = await this.con.query(this.pstmtin[2], [hoj]);

            if (res['rowCount'] > 0) {
                ret = true;
            }

        } catch (ex) {
            super.errorSQL(ex);
        }
        return ret;
    }

    async updateRow(hoj, lin) {
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
                comando += " where HOJA='" + hoj + "' and LINEA='" + lin + "'";
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
        this.pstmtin.push("SELECT * FROM VALORES_PPTO WHERE HOJA = $1 AND LINEA = $2");
        this.pstmtin.push("DELETE FROM VALORES_PPTO WHERE HOJA = $1 AND LINEA = $2");
        this.pstmtin.push("DELETE FROM VALORES_PPTO WHERE HOJA = $1 ");
    }

    setCampos() {
        super.addCampo("HOJA", Number.class);
        super.addCampo("LINEA", Number.class);
        super.addCampo("PRESUPUESTO", Number.class);
        super.addCampo("GRABADA", Boolean.class);
    }

}
module.exports = {
    TablaValoresPresupuesto: TablaValoresPresupuesto
}