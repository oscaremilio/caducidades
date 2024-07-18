const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Usuarios cargados en un array
const usuarios = [
    { usuario: "oscar", password: "oscar2424", rol: "admin" },
    { usuario: "cristina", password: "carrefour", rol: "normal"}
];

// Añade el servicio POST para recoger las credenciales del usuario
router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    let existeUsuario = usuarios.filter(usuario =>
        usuario.usuario == login && usuario.password == password);
    if (existeUsuario.length > 0) {
        req.session.usuario = existeUsuario[0].usuario;
        req.session.rol = existeUsuario[0].rol;
        res.redirect("/productos");
    } else {
        res.render('login',
            { error: "Usuario o contraseña incorrectos" });
    }
});

// Crea un servicio GET que renderiza el formulario que obtiene un usuario
router.get("/login", (req, res) => {
    res.render("login");
});

// Crea un servicio GET que renderiza el formulario que destruye un usuario
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;