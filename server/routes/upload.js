const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();
const {
  verificaToken  
} = require("../middlewares/autenticacion");
const {
  validaTipoColeccion,
  validaTipoImagen,
  verificarSiHayArchivo,
} = require("../middlewares/validateFiles");

const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

// default options
app.use(fileUpload());

app.put(
  "/upload/:tipo/:id",
  [verificaToken, validaTipoColeccion, verificarSiHayArchivo, validaTipoImagen],
  (req, res) => {
    const { tipo, id } = req.params;
    const nombreArchivo = req.nombreArchivo;
    let archivo = req.files.archivo;

    console.log(nombreArchivo);

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Error al subir el archivo al servidor",
        });
      }
      
      if (tipo === "usuarios") {
        actualizarImagenUsuarioDb(id, res, nombreArchivo);
      } else {
        actualizarImagenProductoDb(id, res, nombreArchivo);
      }
    });
  }
);

function actualizarImagenUsuarioDb(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuario) => {
    if (err) {
      borrarSiExisteArchivo("usuarios", nombreArchivo);

      return res.status(500).json({
        status: false,
        message: err,
      });
    }

    if (!usuario) {
      borrarSiExisteArchivo("usuarios", nombreArchivo);
      res.status(400).json({
        status: true,
        message: "No existe el usuario",
      });
    }

    borrarSiExisteArchivo("usuarios", usuario.img);

    usuario.img = nombreArchivo;
    usuario.save((err, usuarioDB) => {
      res.json({
        status: true,
        usuario: usuarioDB,
        img: nombreArchivo,
      });
    });
  });
}
function actualizarImagenProductoDb(id, res, nombreArchivo) {
  Producto.findById(id, (err, producto) => {    
    if (err) {
      borrarSiExisteArchivo("productos", nombreArchivo);

      return res.status(500).json({
        status: false,
        message: err,
      });
    }

    if (!producto) {
      borrarSiExisteArchivo("productos", nombreArchivo);
      res.status(400).json({
        status: true,
        message: "No existe el usuario",
      });
    }

    borrarSiExisteArchivo("productos", producto.img);

    producto.img = nombreArchivo;
    
    producto.save((err, proructoDB) => {
      res.json({
        status: true,
        producto: proructoDB,
        img: nombreArchivo,
      });
    });
  });
}

function borrarSiExisteArchivo(tipo, nombreArchivo) {
  let pathArchivo = `${path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreArchivo}`
  )}`;
  if (fs.existsSync(pathArchivo)) {
    fs.unlinkSync(pathArchivo);
  }
}

module.exports = app;
