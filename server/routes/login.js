const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");
const app = express();

app.post("/login", (req, res) => {
  let body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: err,
      });
    }

    if (!usuarioDb) {
      return res.status(400).json({
        status: false,
        message: "Usuario o contraseña incorrecto",
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
      return res.status(400).json({
        status: false,
        message: "Usuario o contraseña incorrecto",
      });
    }

    let token = jwt.sign(
      {
        usuario: usuarioDb,
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );

    res.send({
      status: true,
      usuario: usuarioDb,
      token,
    });
  });
});

// CONFIGURACIONES DE GOOGLE

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      status: false,
      message: e,
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDb) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: err,
      });
    }

    if (usuarioDb) {
      if (usuarioDb.google === false) {
        return res.status(400).json({
          status: false,
          message: "Email registrado, use la autenticación normal",
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuarioDb,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          status: true,
          usuario: usuarioDb,
          token,
        });
      }
    } else {
      // si el usuario no existe en la base de datos

      let usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuarioDb) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: err,
          });
        }

        let token = jwt.sign(
          {
            usuario: usuarioDb,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          status: true,
          usuario: usuarioDb,
          token,
        });
      });
    }
  });
});

app.get("/prueba", (req, res) => {
    res.status(500).json({
        status: true,
        message: "Error en el servidor"
    })
})

module.exports = app;
