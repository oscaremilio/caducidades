/* 
Fichero que contiene el enrutador para las URIs 
que comiencen por "/productos"
*/

// Añade las librerías necesarias
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const autenticacion = require(__dirname + "/../index");

// Enrutador
const router = express.Router();

// Expresión regular para asegurar la carpeta se añade la imagen subida
const regex_producto = /^p_.+/;

// Comprueba si un usuario validado tiene el rol para acceder al recurso
let rol = (rol) => {
    return (req, res, next) => {
        if (req.session && req.session.rol === rol && req.session.usuario) {
            return next();
        } else {
            res.render('login', {error: "No tienes permisos para acceder a esta ruta"});
        }
    }
}

// Configura los parámetros de subida de archivos y almacenamiento
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (regex_producto.test(file.originalname)) {
            cb(null, 'public/uploads/productos')
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

// El middleware multer hace uso del almacenamiento
let upload = multer({ storage: storage });

// Incorpora los modelos de datos
const Producto = require(__dirname + "/../models/producto.js");
const Usuario = require(__dirname + "/../models/usuario.js");

// Añade el servicio GET para obtener el listado completo de productos
router.get("/productos", autenticacion, (req, res) => {
    Producto.find()
        .sort("caducidad")
        .then(resultado => {
            res.render("productos_listado", { productos: resultado });
        }).catch(error => {
            res.render("error", { error: "No hay productos registrados en la aplicación" });
        });
});

// Añade el servicio para renderizar un formulario de un producto y actualizarlo
router.get("/productos/editar/:id", autenticacion, (req, res) => {
    //res.render("productos_edicion");
    Producto.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.render('productos_edicion', { producto: resultado });
        } else {
            res.render('error', { error: "Producto no encontrado" });
        }
    }).catch(error => {
        res.render('error', { error: "Producto no encontrado" });
    });
});

// Crea un servicio GET que renderiza el formulario que crea un producto
router.get("/productos/nueva", autenticacion, rol("admin"), (req, res) => {
    res.render("productos_nueva");
});

// Obtiene los detalles de un producto concreto por su id
router.get("/productos/:id", (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.render("productos_ficha", { producto: resultado });
        } else {
            res.render("error", { error: "Producto no encontrado" });
        }
    }).catch(error => {
        res.render("error", { error: "No existe el EAN del producto" })
    });
});

// Añade el servicio POST para crear un producto con datos mandados en el body
router.post("/productos", upload.single("imagen"), autenticacion, async (req, res) => {
    let productoExiste = await Producto.findOne({ ean: req.body.ean });
    if (productoExiste) {
        let errores = { general: "Ya existe un producto con este EAN" };
        res.render("productos_nueva", { errores: errores, datos: req.body });
        console.log(productoExiste);
    } else {
        let imagen = req.file ? req.file.filename : "";
        let nuevoProducto = new Producto({
            ean: req.body.ean,
            nombre: req.body.nombre,
            caducidad: req.body.caducidad,
            mascota: req.body.mascota,
            categoria: req.body.categoria,
            imagen: imagen
        });
        nuevoProducto.save().then(resultado => {
            res.redirect("/productos");
        }).catch(error => {
            let errores = {
                general: "Error insertando producto"
            };
            if (error.errors.ean) {
                errores.ean = error.errors.ean.message;
            }
            if (error.errors.nombre) {
                errores.nombre = error.errors.nombre.message;
            }
            if (error.errors.mascota) {
                errores.mascota = error.errors.mascota.message;
            }
            if (error.errors.categoria) {
                errores.categoria = error.errors.categoria.message;
            }
            res.render("productos_nueva", { errores: errores, datos: req.body });
        });
    }
});

// Actualiza los datos de un producto
router.post("/productos/editar/:id", upload.single("imagen"), autenticacion, rol("admin"), (req, res) => {
    let imagen = req.file ? req.file.filename : Producto.imagen;
    Producto.findByIdAndUpdate(req.params.id, {
        $set: {
            ean: req.body.ean,
            nombre: req.body.nombre,
            caducidad: req.body.caducidad,
            mascota: req.body.mascota,
            categoria: req.body.categoria,
            imagen: imagen
        }
    }, { new: true }).then(resultado => {
        res.redirect("/productos");
    }).catch(error => {
        let errores = {
            general: "Error insertando producto"
        };
        if (error.errors.ean) {
            errores.ean = error.errors.ean.message;
        }
        if (error.errors.nombre) {
            errores.nombre = error.errors.nombre.message;
        }
        if (error.errors.mascota) {
            errores.mascota = error.errors.mascota.message;
        }
        if (error.errors.categoria) {
            errores.categoria = error.errors.categoria.message;
        }
        res.render("productos_edicion", { errores: errores, datos: req.body });
    });
});

// Añade el servicio DELETE que borra un producto gracias a su id
router.delete('/productos/:id', autenticacion, rol("admin"), (req, res) => {

    let idProducto = req.params.id;

    Producto.findByIdAndDelete(req.params.id)
        .then(resultado => {
            res.redirect("/productos");
        }).catch(error => {
            res.render("error", { error: "Error eliminando producto" });
        });
});

/*
router.put('/productos/:id', (req, res) => {
    Producto.findByIdAndUpdate(req.params.id, {
        $set: {
            ean: req.body.ean,
            nombre: req.body.nombre,
            caducidad: req.body.caducidad,
            mascota: req.body.mascota,
            categoria: req.body.categoria
        }
    }, { new: true }).then(resultado => {
        resultado => {
            if (resultado) {
                res.status(200).send({ ok: true, resultado: resultado });
            } else {
                res.status(400).send({ ok: false, error: "No se ha encontrado el producto" });
            }
        }
    }).catch(error => {
        res.status(400).send({ ok: false, error: "Error actualizando producto" });
    });
});
*/

module.exports = router;