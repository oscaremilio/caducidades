// Añade la librería "Mongoose"
const mongoose = require("mongoose");

// Crea el esquema con los datos y tipos requeridos de los artículos de mascotas
let productoSchema = new mongoose.Schema({
    // Código EAN de 13 dígitos   
    ean: {
        type: String,
        required: [true, "El EAN del producto es obligatorio"],
        trim: true,
        // No siempre serán 13 dígitos, y completaremos con "0" (ceros) delante
        match: /^\d{13}$/  
    },
    // Nombre del artículo
    nombre: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        trim: true
    },
    // Mes y año que caduca el artículo
    caducidad: {
        type: Date,
        required: [true, "La fecha del producto es obligatoria"],
    },
    // Tipo de animal al que va dirigido el artículo
    mascota: {
        type: String,
        required: [true, "Es necesario indicar el tipo de mascota"],
        enum: ["gato", "roedores", "aves", "peces", "perro"]
    },
    // Categoría de comida del artículo
    categoria: {
        type: String,
        required: [true, "Es necesario indicar la categoría del producto"],
        enum: ["seco", "húmedo", "higiene", "snack"]
    },
    imagen: {
        type: String,
        match: [/^p_.+/, "Recuerda poner la foto preparada"],
        trim: true
    }
});

// Asociamos el esquema  a un modelo y a una base de datos
let Producto = mongoose.model("productos", productoSchema);

// Exportamos este módulo para usarlo en otras partes del código del programa 
module.exports = Producto;