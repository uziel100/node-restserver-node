const express = require("express");
const {
  verificaToken,
  verificarUserRole,
} = require("../middlewares/autenticacion");
const _ = require("underscore");

const app = express();
const Producto = require("../models/producto");

// ====================================
// listado de todos los productos
// ====================================

app.get("/producto", verificaToken, (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 10;

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(limite)
    .populate("categoria", "descripcion")
    .populate("usuario", "email, nombre")
    .exec((err, productos) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: err,
        });
      }

      Producto.countDocuments({ disponible: true }, (err, registros) => {
        if (err) {
          return res.status(400).json({
            status: false,
            message: err,
          });
        }
        res.json({
          status: true,
          productos,
          registros,
        });
      });
    });
});

// ===========================
// Obtener producto por ID
// ===========================

app.get("/producto/:id", verificaToken, (req, res) => {
  const productoID = req.params.id;

  Producto.findById(productoID)
    .populate("categoria", "descripcion")
    .populate("usuario", "email, nombre")
    .exec((err, producto) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: err,
        });
      }

      res.json({
        status: true,
        producto,
      });
    });
});

app.get("/producto/buscar/:termino", verificaToken, (req, res) => {
  const termino = req.params.termino;
  let regex = new RegExp(termino, "i");

  Producto.find({ $or: [{nombre: regex}, {descripcion: regex}], disponible: true })
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: err,
        });
      }

      res.json({
        status: true,
        productos,
      });
    });
});

// ===========================
// Crear producto
// ===========================

app.post("/producto", verificaToken, (req, res) => {
  const body = req.body;

  const productoNuevo = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: req.usuario._id,
  });

  productoNuevo.save((err, producto) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: err,
      });
    }

    res.status(201).json({
      status: true,
      producto,
    });
  });
});

// ===========================
// Actualizar producto
// ===========================

app.put("/producto/:id", verificaToken, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, [
    "nombre",
    "precioUni",
    "descripcion",
    "categoria",
  ]);

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, producto) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: err,
        });
      }

      res.json({
        status: true,
        producto,
      });
    }
  );
});

// ===========================
// Elimina producto
// ===========================

app.delete("/producto/:id", verificaToken, (req, res) => {
  const id = req.params.id;

  Producto.findOneAndUpdate(id, { disponible: false }, (err, producto) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err,
      });
    }

    res.json({
      status: true,
      message: "Producto eliminado correctamente",
    });
  });
});

module.exports = app;
