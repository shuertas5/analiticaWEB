const { form } = require("../treu/formato");
tablaSQL = require("./TablaSQL");

class TablaTotales extends tablaSQL.TablaSQL {

    hoja;
    linea;
    numcomponentes;
    coeficientes;
    hojasc;
    lineasc;
    mas;

    constructor(co) {
        super(co, "TOTALES");
        this.isJDBCon = true;
        this.setPrimaryIndex();
        this.setCampos();
        this.coeficientes = this.iniciarArray(46);
        this.hojasc = this.iniciarArray(46);
        this.lineasc = this.iniciarArray(46);
        this.mas = this.iniciarArray(46);
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

    // Tratamiento del campo Numero de Componentes

    setNumComponentes(comp) {
        this.numcomponentes = comp;
        super.setInt("NUM_COMPONENTES", this.numcomponentes);
    }
    getNumComponentes() {
        this.numcomponentes = super.getInt("NUM_COMPONENTES");
        return this.numcomponentes;
    }
    addFirstNumComponentes(opcio, valo) {
        super.addFirstTermInt("NUM_COMPONENTES", opcio, valo);
    }
    addAndNumComponentes(opcio, valo) {
        super.addAndTermInt("NUM_COMPONENTES", opcio, valo);
    }
    addOrNumComponentes(opcio, valo) {
        super.addOrTermInt("NUM_COMPONENTES", opcio, valo);
    }

    // Tratamiento del campo Coeficientes

    setCoeficientes(num, coef) {
        var i;
        for (i = 1; i <= num; i++) {
            this.coeficientes[i] = coef[i-1];
        }
        for (i = 1; i <= num; i++) {
            var campo = "COEF" + form("##", i, "0");
            super.setBigDecimal(campo, this.coeficientes[i]);
        }
    }
    getCoeficientes() {
        var i;
        var num;
        var calcu;
        var coef = [];
        num = this.getNumComponentes();
        for (i = 1; i <= num; i++) {
            var campo = "COEF" + form("##", i, "0");
            calcu = super.getBigDecimal(campo);
            this.coeficientes[i] = calcu;
            coef.push(calcu);
        }
        return coef;
    }

    // Tratamiento del campo Hojas Componentes

    setHojasComponentes(num, hoj) {
        var i;
        for (i = 1; i <= num; i++) {
            this.hojasc[i] = hoj[i-1];
        }
        for (i = 1; i <= num; i++) {
            var campo = "HOJA" + form("##", i, "0");
            super.setInt(campo, this.hojasc[i]);
        }
    }
    getHojasComponentes() {
        var i;
        var calcu;
        var hoj = [];
        var num = this.getNumComponentes();
        for (i = 1; i <= num; i++) {
            var campo = "HOJA" + form("##", i, "0");
            calcu = super.getInt(campo);
            this.hojasc[i] = calcu;
            hoj.push(calcu);
        }
        return hoj;
    }

    // Tratamiento del campo Lineas Componentes

    setLineasComponentes(num, lin) {
        var i;
        for (i = 1; i <= num; i++) {
            this.lineasc[i] = lin[i-1];
        }
        for (i = 1; i <= num; i++) {
            var campo = "LINEA" + form("##", i, "0");
            super.setInt(campo, this.lineasc[i]);
        }
    }
    getLineasComponentes() {
        var i;
        var calcu;
        var lin=[];
        var num = this.getNumComponentes();
        for (i = 1; i <= num; i++) {
            var campo = "LINEA" + form("##", i, "0");
            calcu = super.getInt(campo);
            this.lineasc[i] = calcu;
            lin.push(calcu);
        }
        return lin;
    }

    // Tratamiento del campo Mas Componentes

    setMasComponentes(num, ma) {
        var i;
        for (i = 1; i <= num; i++) {
            this.mas[i] = ma[i-1];
        }
        for (i = 1; i <= num; i++) {
            var campo = "MAS" + form("##", i, "0");
            super.setString(campo, this.mas[i]);
        }
    }
    getMasComponentes() {
        var i;
        var calcu;
        var max=[];
        var num = this.getNumComponentes();
        for (i = 1; i <= num; i++) {
            var campo = "MAS" + form("##", i, "0");
            calcu = super.getString(campo);
            this.mas[i] = calcu;
            max.push(calcu);
        }
        return max;
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
        this.pstmtin.push("SELECT * FROM TOTALES WHERE HOJA = $1 AND LINEA = $2");
        this.pstmtin.push("DELETE FROM TOTALES WHERE HOJA = $1  AND LINEA = $2");
    }

    setCampos() {
        super.addCampo("HOJA", Number.class);
        super.addCampo("LINEA", Number.class);
        super.addCampo("NUM_COMPONENTES", Number.class);
        for (var i = 1; i <= 45; i++) {
            super.addCampo("COEF" + form("##", i, "0"), Number.class);
            super.addCampo("HOJA" + form("##", i, "0"), Number.class);
            super.addCampo("LINEA" + form("##", i, "0"), Number.class);
            super.addCampo("MAS" + form("##", i, "0"), String.class);
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
    TablaTotales: TablaTotales
}