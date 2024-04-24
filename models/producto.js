const mongoose = require("mongoose");

let productoSchema = new mongoose.Schema({
    ean: {
        type: String,
        required: true,
        trim: true,
        match: /^d{13}$/
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    caducidad: {
        type: Date,
        required: true
    }
});

let Producto = mongoose.model("productos", productoSchema);
module.exports = Producto;