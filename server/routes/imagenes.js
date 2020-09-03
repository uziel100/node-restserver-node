const express = require('express')
const fs = require('fs')
const path = require('path')
const { validaTipoColeccion } = require('../middlewares/validateFiles')
const { verificaToken, verificaTokenImg } = require('../middlewares/autenticacion')

const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg ,(req, res) => {
    const { tipo, img } = req.params;
    
    const pathImg = path.resolve(__dirname,`../../uploads/${tipo}/${ img }`);
    const pathImgDefault = path.resolve(__dirname, '../assets/default.png');

    if( fs.existsSync(pathImg)  ){
        res.sendFile( pathImg )
    }else{
        res.sendFile( pathImgDefault )
    }    


})

module.exports = app;