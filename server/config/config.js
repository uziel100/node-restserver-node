// =============
// Puerto
// =============

process.env.PORT = process.env.PORT || 3000;

// =============
// Desarrollo
// =============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =============
// Base de datos
// =============

let urlDb = "mongodb+srv://uziel:fV9JzEXgPoFC8ED9@cluster0-68b3h.mongodb.net/cafe?retryWrites=true&w=majority";

if(process.env.NODE_ENV === 'dev'){
    urlDb = "mongodb://localhost:27017/cafe"
}

process.env.urlDb = urlDb