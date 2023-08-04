tablaSQL = require("./TablaSQL");

class TablaAsignaciones extends tablaSQL.TablaSQL {

    cuenta;
    subcuenta;
    titulo;
    hoja;
    linea;
    modelo;

    constructor(co) {
        super(co, "TABLA_ASIGNACIONES");
        this.isJDBCon = true;
        this.setPrimaryIndex();
        this.setCampos();
    }

    // Tratamiento del campo Cuenta

    setCuenta(cuen) {
        this.cuenta = cuen;
        super.setString("CUENTA", this.cuenta);
    }
    getCuenta() {
        this.cuenta = super.getString("CUENTA");
        return this.cuenta;
    }
    addFirstCuenta(opcio, valo) {
        super.addFirstTermString("CUENTA", opcio, valo);
    }
    addAndCuenta(opcio, valo) {
        super.addAndTermString("CUENTA", opcio, valo);
    }
    addOrCuenta(opcio, valo) {
        super.addOrTermString("CUENTA", opcio, valo);
    }

    // Tratamiento del campo SubCuenta

    setSubCuenta(subcta) {
        this.subcuenta = subcta;
        super.setString("SUBCUENTA", this.subcuenta);
    }
    getSubCuenta() {
        this.subcuenta = super.getString("SUBCUENTA");
        return this.subcuenta;
    }
    addFirstSubCuenta(opcio, valo) {
        super.addFirstTermString("SUBCUENTA", opcio, valo);
    }
    addAndSubCuenta(opcio, valo) {
        super.addAndTermString("SUBCUENTA", opcio, valo);
    }
    addOrSubCuenta(opcio, valo) {
        super.addOrTermString("SUBCUENTA", opcio, valo);
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

    // Tratamiento del campo Modelo

    setModelo(mode) {
        this.modelo = mode;
        super.setString("MODELO", this.modelo);
    }
    getModelo() {
        this.modelo = super.getString("MODELO");
        return this.modelo;
    }
    addFirstModelo(opcio, valo) {
        super.addFirstTermString("MODELO", opcio, valo);
    }
    addAndModelo(opcio, valo) {
        super.addAndTermString("MODELO", opcio, valo);
    }
    addOrModelo(opcio, valo) {
        super.addOrTermString("MODELO", opcio, valo);
    }

    // Tratamiento del indice principal

    async getByPrimaryIndex(cuen, subcta) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {
            this.rs = await this.con.query(this.pstmtin[0], [cuen, subcta]);
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

    async deleteByPrimaryIndex(cuen, subcta) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {

            var res = await this.con.query(this.pstmtin[1], [cuen, subcta]);

            if (res['rowCount'] > 0) {
                ret = true;
            }

        } catch (ex) {
            super.errorSQL(ex);
        }
        return ret;
    }

    async updateRow(cuen, subcta) {
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
                comando += " where CUENTA='" + cuen + "' and SUBCUENTA='" + subcta + "'";
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
        this.pstmtin.push("SELECT * FROM TABLA_ASIGNACIONES WHERE CUENTA = $1 AND SUBCUENTA = $2");
        this.pstmtin.push("DELETE FROM TABLA_ASIGNACIONES WHERE CUENTA = $1  AND SUBCUENTA = $2");
    }

    setCampos() {
        super.addCampo("CUENTA", String.class);
        super.addCampo("SUBCUENTA", String.class);
        super.addCampo("TITULO", String.class);
        super.addCampo("HOJA", Number.class);
        super.addCampo("LINEA", Number.class);
        super.addCampo("MODELO", String.class);
    }
}
module.exports = {
    TablaAsignaciones: TablaAsignaciones
}