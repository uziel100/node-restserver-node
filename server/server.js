require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongosse = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( require('./routes/usuario') );

mongosse.connect( process.env.urlDb , 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true 
    }, 
    ( err, res ) => {
        if(err) throw err;
        console.log("==> Base de datos ONLINE ==> ;)");
})

app.listen( process.env.PORT , () => {
    console.log("Escuchando en el puerto", process.env.PORT );
})

// mongodb+srv://uziel:fV9JzEXgPoFC8ED9@cluster0-68b3h.mongodb.net/cafe?retryWrites=true&w=majority