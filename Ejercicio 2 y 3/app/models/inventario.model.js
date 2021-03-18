const mongoose = require('mongoose');

//const tipo_med = require('./tipo_med.model');
const InventarioSchema = mongoose.Schema({
    nombre: { type: String, required: true },
    //tipo_medicamento: { type: Schema.Types.ObjectId, required: false, ref: ustipo_meder },
    tipo_medicamento: { type: String, required: true },
    cantidad: {type: Number, required: true},
    precio: {type: Number, required: true},
    ubicacion: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Inventario', InventarioSchema);