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

// =================
// Google client ID
// =================
process.env.CLIENT_ID = process.env.CLIENT_ID || "451024139586-6aeq7o741999rpmfs6dvlftpbd2m2ujk.apps.googleusercontent.com"

// ---------------------
process.env.urlDb = urlDb