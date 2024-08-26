const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();

const Usuario = require(__dirname + "/../models/usuario");

/*
// Usuarios cargados en un array
const usuarios = [
    { usuario: "nombre", password: "password", rol: "admin" },
    { usuario: "nombre2", password: "password2", rol: "normal"}
];*/

/*
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
});*/

// Servicio GET que renderiza el formulario de registro
router.get("/registro", (req, res) => {
    res.render("registro");
});

// Servicio POST para registrar un nuevo usuario
router.post('/registro', autenticacion, async (req, res) => {
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        let nuevoUsuario = new Usuario({
            usuario: req.body.usuario,
            password: hashedPassword,
            rol: req.body.rol
        });
        await nuevoUsuario.save();
        res.render('login', { message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.render("registro", { error: "Error registrando usuario" });
    }
});

// Añade el servicio POST para recoger las credenciales del usuario
router.post('/login', async (req, res) => {
    try {
        let usuario = await Usuario.findOne({ usuario: req.body.login });
        if (usuario && await bcrypt.compare(req.body.password, usuario.password)) {
            req.session.usuario = usuario.usuario;
            req.session.rol = usuario.rol;
            res.redirect("/productos");
        } else {
            res.render('login',
                { error: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        res.render('login', { error: "Error en la autenticación" });
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