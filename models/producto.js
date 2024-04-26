const mongoose = require("mongoose");

let productoSchema = new mongoose.Schema({
    ean: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{13}$/
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    caducidad: {
        type: Date,
        required: true
    },
    mascota: {
        type: String,
        required: true,
        enum: ["gato", "roedores", "aves", "peces", "perro"]
    },
    categoria: {
        type: String,
        enum: ["seco", "húmedo", "higiene", "snack"]
    }
});

let Producto = mongoose.model("productos", productoSchema);
module.exports = Producto;