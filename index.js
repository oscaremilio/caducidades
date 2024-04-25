// Añade los módulos necesarios
const express = require("express");
const mongoose = require("mongoose");

// Referencia al archivo necesario
const Producto = require(__dirname + "/models/producto.js");

// Conecta a la base de datos de mongo
mongoose.connect("mongodb://127.0.0.1:27017/productos");

// Crea la instancia de Express
let app = express();

// Utiliza el middleware para converir a json las peticiones
app.use(express.json());

// Añade el servicio GET para obtener el listado completo de productos
app.get('/productos', (req, res) => {
    Producto.find().then(resultado => {
    res.status(200).send( {ok: true, resultado: resultado});
    }).catch (error => {
    res.status(500)
    .send( {ok: false,
    error: "Error obteniendo productos"});
    });
   });

// Añade el servicio GET para obtener un producto gracias a su id
app.get('/productos/:id', (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if(resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(400).send({ok: false, error: "No se han encontrado productos"});
        }
}).catch (error => {
    res.status(400).send({ok: false, error: "Error buscando el producto indicado"});
    });
});

// Añade el servicio POST para crear un producto con datos mandados en el body
app.post('/productos', (req, res) => {
    let nuevoProducto = new Producto({
        ean: req.body.ean, 
        nombre: req.body.nombre,
        caducidad: req.body.caducidad, 
        mascota: req.body.mascota, 
        categoria: req.body.categoria
    });
    nuevoProducto.save().then(resultado => {
        res.status(200).send({ok: true, resultado: resultado});
    }).catch(error => { 
        res.status(400).send({ok: false, error: "Error añadiendo producto"});
    });
});

// Añade el servicio PUT que actualiza un prodducto gracias a la id
app.put('/productos/:id', (req, res) => {
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
app.delete('/productos/:id', (req, res) => {
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

// Se pone a escuchar por el puerto 8080
app.listen(8080);