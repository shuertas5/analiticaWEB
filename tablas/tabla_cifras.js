const { form } = require("../treu/formato");
tablaSQL = require("./TablaSQL");

class TablaCifras extends tablaSQL.TablaSQL {

    hoja;
    linea;
    cifras;
    mescalculo;
    cerrada;

    enblanco;

    constructor(co) {
        super(co, "CIFRAS");
        this.isJDBCon = true;
        this.setPrimaryIndex();
        this.setCampos();
        this.cifras = this.iniciarArray(25);
        this.enblanco = false;
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

    // Tratamiento del campo Cifras

    setCifras(cif) {
        var i;
        for (i = 1; i <= 24; i++) {
            this.cifras[i] = cif[i - 1];
        }
        for (i = 1; i <= 24; i++) {
            var campo = "MESM" + form("##", 25 - i, "0");
            super.setBigDecimal(campo, this.cifras[i]);
        }
    }

    getCifras() {
        var i;
        var calcu;
        var salcif = Array();
        for (i = 1; i <= 24; i++) {
            var campo = "MESM" + form("##", 25 - i, "0");
            calcu = super.getBigDecimal(campo);
            this.cifras[i] = calcu;
            salcif.push(calcu);
        }
        return salcif;
    }

    // Tratamiento del campo mescalculo

    setMesCalculo(cal) {
        this.mescalculo = cal;
        super.setBigDecimal("MESCALCULO", this.mescalculo);
    }
    getMesCalculo() {
        this.mescalculo = super.getBigDecimal("MESCALCULO");
        return this.mescalculo;
    }
    addFirstMesCalculo(opcio, valo) {
        super.addFirstTermFloat("MESCALCULO", opcio, valo);
    }
    addAndMesCalculo(opcio, valo) {
        super.addAndTermFloat("MESCALCULO", opcio, valo);
    }
    addOrMesCalculo(opcio, valo) {
        super.addOrTermFloat("MESCALCULO", opcio, valo);
    }

    // Tratamiento del campo Cerrada

    setCerrada(cerrad) {
        this.cerrada = cerrad;
        super.setBoolean("CERRADA", this.cerrada);
    }
    getCerrada() {
        this.cerrada = super.getBoolean("CERRADA");
        return this.cerrada;
    }
    addFirstCerrada(opcio, valo) {
        super.addFirstTermBool("CERRADA", opcio, valo);
    }
    addAndCerrada(opcio, valo) {
        super.addAndTermBool("CERRADA", opcio, valo);
    }
    addOrCerrada(opcio, valo) {
        super.addOrTermBool("CERRADA", opcio, valo);
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
        this.pstmtin.push("SELECT * FROM CIFRAS WHERE HOJA = $1 AND LINEA = $2");
        this.pstmtin.push("DELETE FROM CIFRAS WHERE HOJA = $1  AND LINEA = $2");
    }

    setCampos() {
        super.addCampo("HOJA", Number.class);
        super.addCampo("LINEA", Number.class);
        super.addCampo("MESCALCULO", Number.class);
        super.addCampo("CERRADA", Boolean.class);
        for (var i = 1; i <= 24; i++) {
            super.addCampo("MESM" + form("##", i, "0"), Number.class);
        }
    }

    getValorMes(mesactu, mes) {

        var ret;
        var valores = this.iniciarArray(25);

        if (mes > mesactu) return 0.0;

        valores = this.getCifras();
        ret = valores[24 - (mesactu - mes) - 1];
        return ret;

    }

    setValorMes(mesactu, mes, val) {

        var ret;
        var valores = this.iniciarArray(24);

        if (mes > mesactu) return;

        if (this.enblanco == false) {
            valores = this.getCifras();
        }
        else {
            for (var i = 1; i <= 24; i++) valores[i] = 0.0;
        }
        valores[24 - (mesactu - mes) - 1] = val;

        this.setCifras(valores);

        return;
    }

    setValorMesAnnoAnte(mesactu, mes, val) {

        var ret;
        var valores = this.iniciarArray(24);

        if (this.enblanco == false) {
            valores = this.getCifras();
        }
        else {
            for (var i = 1; i <= 24; i++) valores[i - 1] = 0.0;
        }
        valores[(24 - (mesactu - 1) - 12) + (mes - 1) - 1] = val;

        this.setCifras(valores);

        return;
    }

    setValorMesTodos(annoactu, mesactu, anno, mes, val) {

        if (annoactu == anno) {
            this.setValorMes(mesactu, mes, val);
        }
        if (annoactu == anno + 1) {
            this.setValorMesAnnoAnte(mesactu, mes, val);
        }
    }

    getValorAcumulado(mesactu, inmes) {

        var mes;
        var ret;
        var cifra;
        var valores = this.iniciarArray(24);
        var i;

        valores = this.getCifras();
        if (inmes > mesactu) mes = mesactu; else mes = inmes;

        ret = 0.0;
        for (i = 1; i <= mes; i++) {
            cifra = valores[24 - (mesactu - i) - 1];
            ret += cifra;
        }
        return ret;
    }

    getValorAnnoEntero(mesactu, inmes) {

        var mes;
        var ret;
        var cifra;
        var valores = this.iniciarArray(24);
        var i;

        valores = this.getCifras();
        if (inmes > mesactu) mes = mesactu; else mes = inmes;

        ret = 0.0;
        for (i = 1; i <= 12; i++) {
            cifra = valores[24 - (mesactu - mes) - i];
            ret += cifra;
        }
        return ret;
    }

    getValorAnnoAnterior(mesactu, mes) {

        var ret;
        var cifra;
        var valores = this.iniciarArray(24);
        var i;

        valores = this.getCifras();

        ret = 0.0;
        for (i = 1; i <= mes; i++) {
            cifra = valores[(24 - (mesactu - 1) - 12) + (i - 1) - 1];
            ret += cifra;
        }
        return ret;
    }

    getValorMesAnnoAnte(mesactu, mes) {
        var ret;
        var valores = this.iniciarArray(24);
        valores = this.getCifras();
        ret = valores[(24 - (mesactu - 1) - 12) + (mes - 1) - 1];
        return ret;
    }

    getValorMesTodos(annoactu, mesactu, anno, mes) {

        var val;

        val = 0;
        if (annoactu == anno) {
            val = this.getValorMes(mesactu, mes);
        }
        if (annoactu == anno + 1) {
            val = this.getValorMesAnnoAnte(mesactu, mes);
        }

        return val;
    }

    getValorMesEnTramite() {
        var ret;
        ret = this.getMesCalculo();
        return ret;
    }

    getValorMesAnnoAnteEnTramite(mesactu) {
        var ret;
        var mes;
        var valores = this.iniciarArray(24);
        mes = mesactu + 1;
        if (mes > 12) mes = 1;
        valores = this.getCifras();
        ret = valores[(24 - (mesactu - 1) - 12) + (mes - 1) - 1];
        return ret;
    }

    getValorAcumuladoEnTramite(mesactu) {

        var ret;
        var cifra;
        var valores = this.iniciarArray(24);
        var i;
        var mes;

        valores = this.getCifras();

        mes = mesactu + 1;
        if (mes > 12) mes = 1;

        ret = 0.0;
        for (i = 1; i <= mes - 1; i++) {
            cifra = valores[24 - (mesactu - i) - 1];
            ret += cifra;
        }
        ret += this.getMesCalculo();
        return ret;
    }

    getValorAnnoAnteriorEnTramite(mesactu) {
        var ret;
        var cifra;
        var valores = this.iniciarArray(24);
        var i;
        var mes;

        mes = mesactu + 1;
        if (mes > 12) mes = 1;

        valores = this.getCifras();

        ret = 0.0;
        for (i = 1; i <= mes; i++) {
            //cifra=valores[(24-(mesactu-1)-12)+(i-1)];
            cifra = valores[(24 - (mes - 2) - 12) + (i - 1) - 1];
            ret += cifra;
        }
        return ret;
    }

    getVectorCifrasMeses(mesactu, inmes) {

        var mes;
        var valores = this.iniciarArray(24);
        var i;

        this.getCifras();
        if (inmes > mesactu) mes = mesactu; else mes = inmes;

        for (i = 1; i <= 24; i++) valores[i - 1] = 0;
        for (i = 1; i <= mes; i++) valores[i - 1] = this.cifras[24 - mesactu + i];
        for (i = 1; i <= 12; i++) valores[12 + i - 1] = this.cifras[24 - (mesactu + 12) + i];
        return valores;
    }

    getVectorCifrasAcum(mesactu, inmes) {

        var mes;
        var valores = this.iniciarArray(24);
        var i;

        this.getCifras();
        if (inmes > mesactu) mes = mesactu; else mes = inmes;

        for (i = 1; i <= 24; i++) valores[i - 1] = 0;
        for (i = 1; i <= mes; i++) {
            valores[i - 1] = this.cifras[24 - mesactu + i];
        }
        for (i = 1; i <= 12; i++) {
            valores[12 + i - 1] = this.cifras[24 - (mesactu + 12) + i];
        }
        for (i = mes; i >= 1; i--) {
            for (var j = 1; j < i; j++) {
                valores[i - 1] += valores[j - 1];
            }
        }
        for (i = 12; i >= 1; i--) {
            for (var j = 1; j < i; j++) {
                valores[12 + i - 1] += valores[12 + j - 1];
            }
        }
        return valores;
    }

    registroBlanco() {
        this.enblanco = true;
        super.registroBlanco();
    }

    insertRow() {
        this.enblanco = false;
        super.insertRow();
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
    TablaCifras: TablaCifras
}