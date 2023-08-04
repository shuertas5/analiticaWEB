tablaSQL = require("./TablaSQL");

class TablaDiarioFichero extends tablaSQL.TablaSQL {

    origen;
    secuencia;

    descripcion;
    importe;
    signo;
    referencia;
    cuenta;
    subcuenta;
    fechax;

    constructor(co) {
        super(co, "DIARIO_FICHERO");
        this.setPrimaryIndex();
        this.setCampos();
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

    // Tratamiento del campo Secuencia

    setSecuencia(secu) {
        this.secuencia = secu;
        super.setInt("SECUENCIA", this.secuencia);
    }
    getSecuencia() {
        this.secuencia = super.getInt("SECUENCIA");
        return this.secuencia;
    }
    addFirstSecuencia(opcio,valo) {
        super.addFirstTermInt("SECUENCIA", opcio, valo);
    }
    addAndSecuencia(opcio,valo) {
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

    // Tratamiento del indice principal

    async getByPrimaryIndex(ori, secu) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {
            this.rs = await this.con.query(this.pstmtin[0], [ori, secu]);
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

    async deleteByPrimaryIndex(ori, secu) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {

            var res = await this.con.query(this.pstmtin[1], [ori, secu]);

            if (res['rowCount'] > 0) {
                ret = true;
            }

        } catch (ex) {
            super.errorSQL(ex);
        }
        return ret;
    }

    async updateRow(ori, secu) {
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
                comando += " where ORIGEN='" + ori + "' and SECUENCIA='" + secu + "'";
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

    // Borrar datos de un Origen

    async borrarDatosOrigen(ori) {
        var ret = false;
        if (this.abortado == true) return ret;
        try {

            var res = await this.con.query(this.pstmtin[2], [ori]);

            if (res['rowCount'] > 0) {
                ret = true;
            }

        } catch (ex) {
            super.errorSQL(ex);
        }
        return ret;
    }

    setPrimaryIndex() {
        this.pstmtin.push("SELECT * FROM DIARIO_FICHERO WHERE ORIGEN = $1 AND SECUENCIA = $2");
        this.pstmtin.push("DELETE FROM DIARIO_FICHERO WHERE ORIGEN = $1 AND SECUENCIA = $2");
        this.pstmtin.push("DELETE FROM DIARIO_FICHERO WHERE ORIGEN = $1");
    }

    setCampos() {
        super.addCampo("ORIGEN", String.class);
        super.addCampo("SECUENCIA", Number.class);
        super.addCampo("DESCRIPCION", String.class);
        super.addCampo("IMPORTE", Number.class);
        super.addCampo("SIGNO", String.class);
        super.addCampo("REFERENCIA", String.class);
        super.addCampo("CUENTA", String.class);
        super.addCampo("SUBCUENTA", String.class);
        super.addCampo("FECHA", Date.class);
    }
}
module.exports = {
    TablaDiarioFichero: TablaDiarioFichero
}
