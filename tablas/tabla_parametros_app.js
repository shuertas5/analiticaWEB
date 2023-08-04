tablaSQL = require("./TablaSQL");

class TablaParametrosApp extends tablaSQL.TablaSQL {

	uno;
	tituloempresa;
	escudoempresa;
	maxpasadas;
	mescurso;
	annocurso;
	titulocorto;
	annoppto;
	fechappto;
	horappto;
	obligadescadicional;
	presupuestoactivo;
	admite_subcta_vacia;
	//activo_actualizar_fecha;
	//empresa_ref_actual_fecha;
	cargosanovisible;
	control_fecha_movimientos;
	//ultimo_cierre;
	hoja_resultado;
	linea_resultado;
	hoja_facturacion;
	linea_facturacion;

	constructor(co) {
		super(co, "PARAMETROS_APP");
		this.isJDBCon = true;
		this.setPrimaryIndex();
		this.setCampos();
		this.uno = 1;
	}

	// Tratamiento del campo uno

	setUno() {
		this.uno = 1;
		super.setInt("UNO", this.uno);
	}
	getUno() {
		this.uno = super.getInt("UNO");
		return this.uno;
	}

	// Tratamiento del campo Titulo Empresa

	setTituloEmpresa(titu) {
		this.tituloempresa = titu;
		super.setString("TITULO_EMPRESA", this.tituloempresa);
	}
	getTituloEmpresa() {
		this.tituloempresa = super.getString("TITULO_EMPRESA");
		return this.tituloempresa;
	}

	// Tratamiento del campo Escudo Empresa

	setEscudoEmpresa(titu) {
		this.escudoempresa = titu;
		super.setString("ESCUDO_EMPRESA", this.escudoempresa);
	}
	getEscudoEmpresa() {
		this.escudoempresa = super.getString("ESCUDO_EMPRESA");
		return this.escudoempresa;
	}

	// Tratamiento del campo maximas pasadas

	setMaxPasadas(max) {
		this.maxpasadas = max;
		super.setInt("MAX_PASADAS", this.maxpasadas);
	}
	getMaxPasadas() {
		this.maxpasadas = super.getInt("MAX_PASADAS");
		return this.maxpasadas;
	}

	// Tratamiento del campo mes en curso

	setMesEnCurso(mes) {
		this.mescurso = mes;
		super.setInt("MES_EN_CURSO", this.mescurso);
	}
	getMesEnCurso() {
		this.mescurso = super.getInt("MES_EN_CURSO");
		return this.mescurso;
	}

	// Tratamiento del campo anno en curso

	setAnnoEnCurso(an) {
		this.annocurso = an;
		super.setInt("ANNO_EN_CURSO", this.annocurso);
	}
	getAnnoEnCurso() {
		this.annocurso = super.getInt("ANNO_EN_CURSO");
		return this.annocurso;
	}

	// Tratamiento del campo Titulo Corto

	setTituloCorto(titu) {
		this.titulocorto = titu;
		super.setString("TITULO_CORTO_EMPRESA", this.titulocorto);
	}
	getTituloCorto() {
		this.titulocorto = super.getString("TITULO_CORTO_EMPRESA");
		return this.titulocorto;
	}

	// Tratamiento del campo año del presupuesto

	setAnnoPpto(an) {
		this.annoppto = an;
		super.setInt("ANNO_PRESUPUESTO", this.annoppto);
	}
	getAnnoPpto() {
		this.annoppto = super.getInt("ANNO_PRESUPUESTO");
		return this.annoppto;
	}

	// Tratamiento del Campo Fecha Presupuesto

	setFechaPpto(fech) {
		this.fechappto = fech;
		super.setDate("FECHA_PPTO", this.fechappto);
	}
	getFechaPpto() {
		this.fechappto = super.getDate("FECHA_PPTO");
		return this.fechappto;
	}

	// Tratamiento del campo Hora Ppto

	setHoraPpto(hora) {
		this.horappto = hora;
		super.setString("HORA_PPTO", this.horappto);
	}
	getHoraPpto() {
		this.horappto = super.getString("HORA_PPTO");
		return this.horappto;
	}

	// Tratamiento del campo Obligatoria Descripcion Adicional

	setObligaDescAdicional(obli) {
		this.obligadescadicional = obli;
		super.setBoolean("OBLIG_DESC_ADICIONAL", this.obligadescadicional);
	}
	getObligaDescAdicional() {
		this.obligadescadicional = super.getBoolean("OBLIG_DESC_ADICIONAL");
		return this.obligadescadicional;
	}

	// Tratamiento del campo Presupuesto activo

	setPresupuestoActivo(activo) {
		this.presupuestoactivo = activo;
		super.setBoolean("PRESUPUESTO_ACTIVO", this.presupuestoactivo);
	}
	getPresupuestoActivo() {
		this.presupuestoactivo = super.getBoolean("PRESUPUESTO_ACTIVO");
		return this.presupuestoactivo;
	}

	// Tratamiento del campo Admite Subcta Vacia

	setAdmiteSubctaVacia(admite) {
		this.admite_subcta_vacia = admite;
		super.setBoolean("ADMITE_SUBCTA_VACIA", this.admite_subcta_vacia);
	}
	getAdmiteSubctaVacia() {
		this.admite_subcta_vacia = super.getBoolean("ADMITE_SUBCTA_VACIA");
		return this.admite_subcta_vacia;
	}

	// Tratamiento del campo Activo Actializacion Fecha

	/*public void setActivoActualizarFecha(boolean activo) {
		activo_actualizar_fecha=activo;
		setBoolean("ACTIVO_ACT_FECHA",activo_actualizar_fecha);
	}
	public boolean getActivoActualizarFecha() {
		activo_actualizar_fecha=getBoolean("ACTIVO_ACT_FECHA");
		return activo_actualizar_fecha;
	}*/

	// Tratamiento del campo Empresa Referencia actualizar fecha

	/*public void setEmpresaRefActFecha(String empre) {
		empresa_ref_actual_fecha=empre;
		setString("EMPRE_REF_ACT_FECHA",empresa_ref_actual_fecha);
	}
	public String getEmpresaRefActFecha() {
		empresa_ref_actual_fecha=getString("EMPRE_REF_ACT_FECHA");
		return empresa_ref_actual_fecha;
	}*/

	// Tratamiento del campo Admite Cargos a Linea No Visible

	setCargosLineaNoVisible(admite) {
		this.cargosanovisible = admite;
		super.setBoolean("CARGOS_A_NO_VISIBLE", this.cargosanovisible);
	}
	getCargosLineaNoVisible() {
		this.cargosanovisible = super.getBoolean("CARGOS_A_NO_VISIBLE");
		return this.cargosanovisible;
	}

	// Tratamiento del campo Control Fecha de Movimientos

	setControlFechaMovimientos(activo) {
		this.control_fecha_movimientos = activo;
		super.setBoolean("CONTROL_FECHA_MOVIM", this.control_fecha_movimientos);
	}
	getControlFechaMovimientos() {
		this.control_fecha_movimientos = super.getBoolean("CONTROL_FECHA_MOVIM");
		return this.control_fecha_movimientos;
	}

	// Tratamiento del campo Ultimo Cierre (Momento)

	/*setUltimoCierre(String ultim) {
		ultimo_cierre=ultim;
		setString("ULTIMO_CIERRE",ultimo_cierre);
	}
	getUltimoCierre() {
		ultimo_cierre=getString("ULTIMO_CIERRE");
		return ultimo_cierre;
	}*/

	// Tratamiento del campo Hoja de Resultado

	setHojaResultado(hoj) {
		this.hoja_resultado = hoj;
		super.setInt("HOJA_RESULTADO", this.hoja_resultado);
	}
	getHojaResultado() {
		this.hoja_resultado = super.getInt("HOJA_RESULTADO");
		return this.hoja_resultado;
	}

	// Tratamiento del campo Linea de Resultado

	setLineaResultado(lin) {
		this.linea_resultado = lin;
		super.setInt("LINEA_RESULTADO", this.linea_resultado);
	}
	getLineaResultado() {
		this.linea_resultado = super.getInt("LINEA_RESULTADO");
		return this.linea_resultado;
	}

	// Tratamiento del campo Hoja de Facturacion

	setHojaFacturacion(hoj) {
		this.hoja_facturacion = hoj;
		super.setInt("HOJA_FACTURACION", this.hoja_facturacion);
	}
	getHojaFacturacion() {
		this.hoja_facturacion = super.getInt("HOJA_FACTURACION");
		return this.hoja_facturacion;
	}

	// Tratamiento del campo Linea de Facturacion

	setLineaFacturacion(lin) {
		this.linea_facturacion = lin;
		super.setInt("LINEA_FACTURACION", this.linea_facturacion);
	}
	getLineaFacturacion() {
		this.linea_facturacion = super.getInt("LINEA_FACTURACION");
		return this.linea_facturacion;
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
		this.pstmtin.push("SELECT * FROM PARAMETROS_APP WHERE UNO = 1");
		this.pstmtin.push("DELETE FROM PARAMETROS_APP WHERE UNO = 1");
	}

	setCampos() {
		super.addCampo("UNO", Number.class);
		super.addCampo("TITULO_EMPRESA", String.class);
		super.addCampo("ESCUDO_EMPRESA", String.class);
		super.addCampo("MAX_PASADAS", Number.class);
		super.addCampo("MES_EN_CURSO", Number.class);
		super.addCampo("ANNO_EN_CURSO", Number.class);
		super.addCampo("TITULO_CORTO_EMPRESA", String.class);
		super.addCampo("ANNO_PRESUPUESTO", Number.class);
		super.addCampo("FECHA_PPTO", Date.class);
		super.addCampo("HORA_PPTO", String.class);
		super.addCampo("OBLIG_DESC_ADICIONAL", Boolean.class);
		super.addCampo("PRESUPUESTO_ACTIVO", Boolean.class);
		super.addCampo("ADMITE_SUBCTA_VACIA", Boolean.class);
		super.addCampo("CARGOS_A_NO_VISIBLE", Boolean.class);
		super.addCampo("CONTROL_FECHA_MOVIM", Boolean.class);
		super.addCampo("HOJA_RESULTADO", Number.class);
		super.addCampo("LINEA_RESULTADO", Number.class);
		super.addCampo("HOJA_FACTURACION", Number.class);
		super.addCampo("LINEA_FACTURACION", Number.class);
	}
}

module.exports = {
	TablaParametrosApp: TablaParametrosApp
}