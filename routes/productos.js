/* 
Fichero que contiene el enrutador para las URIs 
que comiencen por "/productos"
*/

// Añade las librerías necesarias
const express = require("express");
const mongoose= require("mongoose");
const multer = require("multer");

// Enrutador
const router = express.Router();

// Expresión regular para asegurar la carpeta se añade la imagen subida
const regex_producto = /^p_.+/;

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
// Añade limpieza.js para el servicio put("/habitaciones/:id/ultimalimpieza"
const Producto = require(__dirname + "/../models/producto.js");

// Añade el servicio GET para obtener el listado completo de productos
router.get("/productos", (req, res) => {
    Producto.find()
    .sort("ean")
    .then(resultado => {
        res.render("productos_listado", {productos: resultado});
    }).catch (error => {
        res.render("error", {error: "No hay productos registrados en la aplicación"});
    });
   });
/*
// Obtiene los detalles de una habitación concreta por su id
router.get("/productos/:id", (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if(resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(400).send({ok: false, error: "No se han encontrado productos"});
        }
}).catch (error => {
    res.status(400).send({ok: false, error: "Error buscando el producto indicado"});
    });
});*/

// Añade el servicio POST para crear un producto con datos mandados en el body
router.post("/productos", upload.single("imagen"), async (req, res) => {
    let productoExiste = await Producto.findOne({ean: req.body.ean});
    if (productoExiste) {
        let errores = {general: "Ya existe un producto con este EAN"};
            res.render("productos_nueva", {errores: errores, datos: req.body});
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
            if(error.errors.ean) {
                errores.ean = error.errors.ean.message;
            }
            if(error.errors.nombre) {
                errores.nombre = error.errors.nombre.message;
            }
            if(error.errors.mascota) {
                errores.mascota = error.errors.mascota.message;
            }
            if(error.errors.categoria) {
                errores.categoria = error.errors.categoria.message;
            }
            res.render("productos_nueva", {errores: errores, datos: req.body});
        });
    }
});

router.put('/productos/:id', (req, res) => {
    Producto.findByIdAndUpdate(req.params.id, {
        $set: {
            ean: req.body.ean, 
            nombre: req.body.nombre,
            caducidad: req.body.caducidad, 
            mascota: req.body.mascota, 
            categoria: req.body.categoria
        }
    }, {new: true}).then(resultado => {
        resultado => {
            if (resultado) {
                res.status(200).send({ok: true, resultado: resultado});
            } else {
                res.status(400).send({ok: false, error: "No se ha encontrado el producto"});
            }
        }
        }).catch(error => {
            res.status(400).send({ok: false, error:"Error actualizando producto"});
    });
});

// Añade el servicio DELETE que borra un producto gracias a su id
router.delete('/productos/:id', (req, res) => {
    Producto.findByIdAndDelete(req.params.id).then(resultado => {
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(400).send({ok: false, error: "No se ha encontrado el producto"});
        }
    }).catch(error => {
        res.status(400).send({ok: false, error:"Error eliminando producto"});
    });
});

// Actualiza los datos de una habitación
router.post("/productos/editar/:id", upload.single("imagen"), (req, res) => {
    let imagen = req.file ? req.file.filename : "";
    Producto.findByIdAndUpdate(req.params.id, {
        $set: {
            ean: req.body.ean,
            nombre: req.body.nombre,
            caducidad: req.body.caducidad,
            mascota: req.body.mascota,
            categoria: req.body.categoria,
            imagen: imagen
        }
    }, {new: true}).then(resultado => {
        res.redirect("/productos"); 
    }).catch(error => {
        let errores = {
            general: "Error insertando producto"
        };
        if(error.errors.ean) {
            errores.ean = error.errors.ean.message;
        }
        if(error.errors.nombre) {
            errores.nombre = error.errors.nombre.message;
        }
        if(error.errors.mascota) {
            errores.mascota = error.errors.mascota.message;
        }
        if(error.errors.categoria) {
            errores.categoria = error.errors.categoria.message;
        }
        res.render("productos_nueva", {errores: errores, datos: req.body});
    });
});

// Añade el servicio para renderizar un formulario de un libro y actualizarlo
router.get("/productos/editar/:id", (req, res) => {
    //res.render("productos_edicion");
    Producto.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.render('productos_edicion', {producto: resultado});
        } else {
            res.render('error', {error: "Producto no encontrado"});
        }
    }).catch(error => {
        res.render('error', {error: "Producto no encontrado"});
    });
});

// Crea un servicio GET que renderiza el formulario que crea una habitación
router.get("/productos/nueva", (req, res)=> {
    res.render("productos_nueva");
});

// Añade una habitación al listado
router.post("/habitaciones", upload.single("imagen"), async (req, res) => {
    let habitacionExiste = await Habitacion.findOne({numero: req.body.numero});
    if (habitacionExiste) {
        let errores = {general: "Ya existe una habitación con este número"};
            res.render("habitaciones_nueva", {errores: errores, datos: req.body});
        console.log(habitacionExiste);
    } else {
        let imagen = req.file ? req.file.filename : "";
        let nuevaHabitacion = new Habitacion({
            numero: req.body.numero,
            tipo: req.body.tipo,
            descripcion: req.body.descripcion,
            ultimaLimpieza: req.body.ultimaLimpieza,
            precio: req.body.precio,
            imagen: imagen
        });
        nuevaHabitacion.save().then(resultado => {
            res.redirect("/habitaciones");
        }).catch(error => {
            let errores = {
                general: "Error insertando habitación"
            };
            if(error.errors.numero) {
                errores.numero = error.errors.numero.message;
            }
            if(error.errors.tipo) {
                errores.tipo = error.errors.tipo.message;
            }
            if(error.errors.descripcion) {
                errores.descripcion = error.errors.descripcion.message;
            }
            if(error.errors.precio) {
                errores.precio = error.errors.precio.message;
            }
            res.render("habitaciones_nueva", {errores: errores, datos: req.body});

        });
    }
});

// Elimina una habitación
router.delete("/habitaciones/:id", async (req, res) => {

    let idHabitacion = req.params.id;

    await Limpieza.deleteMany({idHabitacion: idHabitacion});

    Habitacion.findByIdAndDelete(req.params.id)
        .then(resultado => {
            res.redirect("/habitaciones");
        }).catch(error => {
            res.render("error", {error: "Error eliminando habitación"})
        });
});

module.exports = router;