const express = require('express');
const { verificaToken, verificarUserRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria')

// mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if(err){
                return res.status(500).json({
                    status: false,
                    message: "Hubo un error en el servidor"
                })
            }

            res.json({
                status: true,
                categorias
            })
        });
})

// monstrar categoria por ID

app.get('/categoria/:id', (req, res) => {
    const id = req.params.id;

    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {      
            if(err){
                return res.status(400).json({
                    status: false,
                    message: "Ha ocurrido algun error o la categoria no existe"
                })
            }

            res.json({
                status: true,
                categoria
            })
        })  
})

// Crear nueva categoria => cat

app.post('/categoria', verificaToken ,(req, res) => {        
    const usuarioId = req.usuario._id;
    const body = req.body;
    
    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuarioId
    })

    categoria.save((err, categoriaDb) => {
        if(err){
            return res.status(400).json({
                status: false,
                message: err
            })
        }

        res.json({
            status: true,
            categoria: categoriaDb
        })
    })
})

// actualizar categoria (descrp)

app.put( '/categoria/:id', verificaToken , (req, res) => {
    const id = req.params.id;
    const body =  req.body;
    
    const datosAactualizar = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, datosAactualizar, {new: true, runValidators: true }, (err, categoriaDb) => {
        if(err){
            return res.status(400).json({
                status: false,
                message: err
            })
        }

        res.json({
            status: true,
            categoria: categoriaDb
        })
    })
})

// eliminar categoria => (administrador)

app.delete( '/categoria/:id', [verificaToken, verificarUserRole] , (req, res) => {
    const id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoria) => {
        if(err || !categoria){
            return res.status(400).json({
                status: false,
                message: "Error al eliminar o no el id del producto no existe"
            })
        }

        res.json({
            status: true,
            categoria
        })
        
    })

})



module.exports = app;