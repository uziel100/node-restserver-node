const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        require: [true, 'La descripción es obligatoria']
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

categoriaSchema.plugin( unique, { message: '{PATH} debe ser unico' } );

module.exports = mongoose.model('Categoria', categoriaSchema);