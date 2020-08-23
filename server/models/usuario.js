const mongosse = require('mongoose');
const unique = require('mongoose-unique-validator')


let Schema = mongosse.Schema;

const rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    email:{
        type: String,
        unique: true,
        required: [true, "El correo es obligatorio"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    img: {
        type: String,
        required: false,
    },
    role:{   
        type: String,     
        default: "USER_ROLE",
        enum: rolesValidos
    },
    estado: {
        type: Boolean,      
        default: true  
    },
    google:{
        type: Boolean,
        default: false,
    }
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin( unique, { message: '{PATH} debe ser unico' } );

module.exports = mongosse.model('Usuario', usuarioSchema)