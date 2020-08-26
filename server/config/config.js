// =============
// Puerto
// =============

process.env.PORT = process.env.PORT || 3000;

// =============
// Desarrollo
// =============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ========================
// Vencimiento del token
// ========================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========================
// SED de autenticacion
// ========================

process.env.SEED = process.env.SEED || 'seed-de-desarrollo'

// =============
// Base de datos
// =============

let urlDb = "mongodb+srv://uziel:fV9JzEXgPoFC8ED9@cluster0-68b3h.mongodb.net/cafe?retryWrites=true&w=majority";

if(process.env.NODE_ENV === 'dev'){
    urlDb = "mongodb://localhost:27017/cafe"
}

process.env.urlDb = urlDb