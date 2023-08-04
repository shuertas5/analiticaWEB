// ********************************************************
// Codigos de Prueba    
// ********************************************************

// ------------------------------------------------------
// Apertura de la Base de Datos 
// ------------------------------------------------------

var registro = "";

const acceso = require("./routes/procedimientos_varios")
const tabla_tipos_hojas = require('./tablas/tabla_tipos_hojas');
const TablaSQL = require('./tablas/TablaSQL.js');

var db = acceso.accesoDB(req.session.empresa);

var tablaTiposHojas = new tabla_tipos_hojas.TablaTiposHojas(db);

/*tablaTiposHojas.registroBlanco();
tablaTiposHojas.setTipo("V1");
tablaTiposHojas.setTitulo("Ventas");
tablaTiposHojas.insertRow();

tablaTiposHojas.registroBlanco();
tablaTiposHojas.setTipo("T2");
tablaTiposHojas.setTitulo("Talleres");
tablaTiposHojas.insertRow();

tablaTiposHojas.registroBlanco();
tablaTiposHojas.setTipo("A1");
tablaTiposHojas.setTitulo("Almacenes");
tablaTiposHojas.insertRow();*/

var stat;

async function get0() {
    await tablaTiposHojas.open();
}

tablaTiposHojas.addFirstTipo(TablaSQL.TablaSQL.BTR_NOT_EQ, "");
tablaTiposHojas.setOrdenBy("TIPO");

get0().then(async response => {

    console.log(await tablaTiposHojas.getRowCount());

    var stat = tablaTiposHojas.getFirst();

    var tipo;
    var titulo;

    while (stat == true) {

        tipo = tablaTiposHojas.getTipo();
        titulo = tablaTiposHojas.getTitulo();

        console.log('Tipo = ' + tipo + '  titulo = ' + titulo);

        stat = tablaTiposHojas.getNext();

    }

    return;
}
).then(async response => {

    var stat2;
    async function prim() {
        stat2 = await tablaTiposHojas.getByPrimaryIndex("V1");
    }

    prim().then(async response => {

        if (stat2 == true) {

            var tit = tablaTiposHojas.getTitulo();
            var tip = tablaTiposHojas.getTipo();

            console.log("Tipo: " + tip);
            console.log("Titulo: " + tit);

        }
    })
}).then(async response => {

    var stat3;
    async function dele() {
        stat3 = await tablaTiposHojas.deleteByPrimaryIndex("T2");
    }

    await tablaTiposHojas.startTransaccion();

    dele().then(async response => {

        if (stat3 == true) {

            console.log("Registro Borrado ");

        }

        await tablaTiposHojas.endTransaccion();

    })
});

module.exports = { db };
