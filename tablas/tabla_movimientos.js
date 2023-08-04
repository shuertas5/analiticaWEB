tablaSQL = require("./TablaSQL");

class TablaMovimientos extends tablaSQL.TablaSQL {

    hoja;
    linea;
    anno;
    mes;
    secuencia;

    descripcion;
    importe;
    signo;
    referencia;
    cuenta;
    subcuenta;
    fechax;
    origen;

    constructor(co) {
        super(co, "MOVIMIENTOS");
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
    addFirstHoja(opcio,valo) {
        super.addFirstTermInt("HOJA", opcio, valo);
    }
    addAndHoja(opcio,valo) {
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
    addFirstLinea( opcio, valo) {
        super.addFirstTermInt("LINEA", opcio, valo);
    }
    addAndLinea( opcio, valo) {
        super.addAndTermInt("LINEA", opcio, valo);
    }
    addOrLinea(opcio, valo) {
        super.addOrTermInt("LINEA", opcio, valo);
    }

    // Tratamiento del campo Año

    setAnno(ann) {
        this.anno = ann;
        super.setInt("ANNO", this.anno);
    }
    getAnno() {
        this.anno = super.getInt("ANNO");
        return this.anno;
    }
    addFirstAnno(opcio, valo) {
        super.addFirstTermInt("ANNO", opcio, valo);
    }
    addAndAnno( opcio, valo) {
        super.addAndTermInt("ANNO", opcio, valo);
    }
    addOrAnno(opcio, valo) {
        super.addOrTermInt("ANNO", opcio, valo);
    }

    // Tratamiento del campo Mes

    setMes(me) {
        this.mes = me;
        super.setInt("MES", this.mes);
    }
    getMes() {
        this.mes = super.getInt("MES");
        return this.mes;
    }
    addFirstMes(opcio, valo) {
        super.addFirstTermInt("MES", opcio, valo);
    }
    addAndMes(opcio, valo) {
        super.addAndTermInt("MES", opcio, valo);
    }
    addOrMes(opcio, valo) {
        super.addOrTermInt("MES", opcio, valo);
    }

    // Tratamiento del campo Secuencia

    setSecuencia(secu) {
        this.secuencia = secu;
        super.setInt("SECUENCIA", this.secuencia);
    }
    getSecuencia() {
        this.secuencia = super.getInt("SECUENCIA");
        return this.secuencia;
    }
    addFirstSecuencia(opcio, valo) {
        super.addFirstTermInt("SECUENCIA", opcio, valo);
    }
    addAndSecuencia(opcio, valo) {
        super.addAndTermInt("SECUENCIA", opcio, valo);
    }
    addOrSecuencia(opcio, valo) {
        super.addOrTermInt("SECUENCIA", opcio, valo);
    }

    // Tratamiento del campo Descripcion

    setDescripcion(desc) {
        this.descripcion = desc;
        super.setString("DESCRIPCION", this.descripcion);
    }
    getDescripcion() {
        this.descripcion = super.getString("DESCRIPCION");
        return this.descripcion;
    }
    addFirstDescripcion(opcio, valo) {
        super.addFirstTermString("DESCRIPCION", opcio, valo);
    }
    addAndDescripcion(opcio,  valo) {
        super.addAndTermString("DESCRIPCIONO", opcio, valo);
    }
    addOrDescripcion( opcio, valo) {
        super.addOrTermString("DESCRIPCION", opcio, valo);
    }

    // Tratamiento del campo importe

    setImporte(cal) {
        this.importe = cal;
        super.setBigDecimal("IMPORTE", this.importe);
    }
    getImporte() {
        this.importe = super.getBigDecimal("IMPORTE");
        return this.importe;
    }
    addFirstImporte( opcio,  valo) {
        super.addFirstTermFloat("IMPORTE", opcio, valo);
    }
    addAndImporte(opcio, valo) {
        super.addAndTermFloat("IMPORTE", opcio, valo);
    }
    addOrImporte(opcio, valo) {
        super.addOrTermFloat("IMPORTE", opcio, valo);
    }

    // Tratamiento del campo Signo

    setSigno(sig) {
        this.signo = sig;
        super.setString("SIGNO", this.signo);
    }
    getSigno() {
        this.signo = super.getString("SIGNO");
        return this.signo;
    }
    addFirstSigno(opcio, valo) {
        super.addFirstTermString("SIGNO", opcio, valo);
    }
    addAndSigno(opcio, valo) {
        super.addAndTermString("SIGNO", opcio, valo);
    }
    addOrSigno(opcio, valo) {
        super.addOrTermString("SIGNO", opcio, valo);
    }

    // Tratamiento del campo Referencia

    setReferencia(ref) {
        this.referencia = ref;
        super.setString("REFERENCIA", this.referencia);
    }
    getReferencia() {
        this.referencia = super.getString("REFERENCIA");
        return this.referencia;
    }
    addFirstReferencia(opcio, valo) {
        super.addFirstTermString("REFERENCIA", opcio, valo);
    }
    addAndReferencia(opcio, valo) {
        super.addAndTermString("REFERENCIA", opcio, valo);
    }
    addOrReferencia(opcio, valo) {
        super.addOrTermString("REFERENCIA", opcio, valo);
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
    addOrSubCuenta(opcio,valo) {
        super.addOrTermString("SUBCUENTA", opcio, valo);
    }

    // Tratamiento del Campo Fecha

    setFecha(fech) {
        this.fechax = fech;
        super.setDate("FECHA", this.fechax);
    }
    getFecha() {
        this.fechax = super.getDate("FECHA");
        return this.fechax;
    }
    addFirstFecha(opcio, valo) {
        super.addFirstTermDate("FECHA", opcio, valo);
    }
    addAndFecha(opcio, valo) {
        super.addAndTermDate("FECHA", opcio, valo);
    }
    addOrFecha(opcio, valo) {
        super.addOrTermDate("FECHA", opcio, valo);
    }

    // Tratamiento del campo Origen

    setOrigen(clav) {
        this.origen = clav;
        super.setString("ORIGEN", this.origen);
    }
    getOrigen() {
        this.origen = super.getString("ORIGEN");
        return this.origen;
    }
    addFirstOrigen(opcio, valo) {
        super.addFirstTermString("ORIGEN", opcio, valo);
    }
    addAndOrigen(opcio, valo) {
        super.addAndTermString("ORIGEN", opcio, valo);
    }
    addOrOrigen(opcio, valo) {
        super.addOrTermString("ORIGEN", opcio, valo);
    }

    // Tratamiento del indice principal

    async getByPrimaryIndex(hoj, lin, ann, me, secu) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {
            this.rs = await this.con.query(this.pstmtin[0], [hoj, lin, ann, me, secu]);
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

    async deleteByPrimaryIndex(hoj, lin, ann, me, secu) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {

            var res = await this.con.query(this.pstmtin[1], [hoj, lin, ann, me, secu]);

            if (res['rowCount'] > 0) {
                ret = true;
            }

        } catch (ex) {
            super.errorSQL(ex);
        }
        return ret;
    }

    async updateRow(hoj, lin, ann, me, secu) {
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
                comando += " where HOJA='" + hoj + "' and LINEA='" + lin + "' and ANNO='" + ann + "' and MES='" + me + "' and SECUENCIA='" + secu + "'";
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

    // Tratamiento del indice principal

    async borrarMes(ann, me) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {

            var res = await this.con.query(this.pstmtin[2], [ann, me]);

            if (res['rowCount'] > 0) {
                ret = true;
            }

        } catch (ex) {
            super.errorSQL(ex);
        }
        return ret;
    }

    setPrimaryIndex() {
        this.pstmtin.push("SELECT * FROM MOVIMIENTOS WHERE HOJA = $1 AND LINEA = $2 AND ANNO = $3 AND MES = $4 AND SECUENCIA = $5");
        this.pstmtin.push("DELETE FROM MOVIMIENTOS WHERE HOJA = $1  AND LINEA = $2 AND ANNO = $3 AND MES = $4 AND SECUENCIA = $5");
        this.pstmtin.push("DELETE FROM MOVIMIENTOS WHERE ANNO = $1 AND MES = $2 ");
    }

    setCampos() {
        super.addCampo("HOJA", Number.class);
        super.addCampo("LINEA", Number.class);
        super.addCampo("ANNO", Number.class);
        super.addCampo("MES", Number.class);
        super.addCampo("SECUENCIA", Number.class);
        super.addCampo("DESCRIPCION", String.class);
        super.addCampo("IMPORTE", Number.class);
        super.addCampo("SIGNO", String.class);
        super.addCampo("REFERENCIA", String.class);
        super.addCampo("CUENTA", String.class);
        super.addCampo("SUBCUENTA", String.class);
        super.addCampo("FECHA", Date.class);
        super.addCampo("ORIGEN", String.class);
    }
}
module.exports = {
    TablaMovimientos: TablaMovimientos
}