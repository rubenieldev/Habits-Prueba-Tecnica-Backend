const mongoose = require('mongoose');

const TipoMedSchema = mongoose.Schema({
    tipo: { type: String, required: true },
    description: { type: String, required: false },
}, {
    timestamps: true
});

module.exports = mongoose.model('Tipo_med', TipoMedSchema);