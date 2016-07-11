var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var TipoHospedajeSchema = new Schema({
  nombre: { type: String, required: true, index: { unique: true }},
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('TipoHospedaje', TipoHospedajeSchema);

