const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore')

const app = express();


app.get('/usuario', (req, res) => {    
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const usuariosActivos  = {
        estado: true
    }

    Usuario.find( usuariosActivos , 'nombre email img role estado google')
        .skip( desde )
        .limit( limite )
        .exec( (err, usuarios) => { 
            if(err){
                return res.status(400).json({
                    status: false,
                    message: err
                });                    
            }

            Usuario.count( usuariosActivos , (err, registros) => {
                res.send({
                    status: true,
                    usuarios,
                    registros
                })
            })

        })
    
})

app.post('/usuario', (req, res) => {  
    const body = req.body;

    const usuario = new Usuario({ 
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        role: body.role        
    })

    usuario.save( (err, usuarioDb) => {
        if(err){
            return res.status(400).json({
                status: false,
                message: err
            });
        }        
        

        res.send({
            status: true,
            usuario: usuarioDb
        })

    })
})

app.put('/usuario/:id', (req, res) => {    
    const id = req.params.id;    
    const body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"] ) ;


    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                status: false,
                message: err
            })
        }

        res.send({
            status: true,
            usuario: usuarioDB
        })
    })
})

app.delete('/usuario/:id', (req, res) => {    
    const id = req.params.id;
    const cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate( id, cambiaEstado, { new: true }, (err, usuarioDelete) => {
        if(err){
            return res.status(400).json({
                status: false,
                message: err
            })
        }

        res.send({
            status: true,
            usuario: usuarioDelete
        })
    })
})

// exportar

module.exports = app;