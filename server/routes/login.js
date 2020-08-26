const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
        if(err){
            return res.status(500).json({
                status: false,
                message: err
            });     
        }

        if( !usuarioDb ){
            return res.status(400).json({
                status: false,
                message: "Usuario o contraseña incorrecto"
            });    
        }

        if( !bcrypt.compareSync( body.password, usuarioDb.password ) ){
            return res.status(400).json({
                status: false,
                message: "Usuario o contraseña incorrecto"
            });    
        }

        let token = jwt.sign({
            usuario: usuarioDb
        }, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.send({
            status: true,
            usuario: usuarioDb,
            token
        })

    })
})




module.exports = app;