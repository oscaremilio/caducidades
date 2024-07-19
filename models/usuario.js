// Añade la librería "Mongoose"
const mongoose = require("mongoose");

let usuarioSchema = new mongoose.Schema ({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    }
});

// Asociamos el esquema  a un modelo y a una base de datos
let Usuario = mongoose.model("usuarios", usuarioSchema);

// Exportamos este módulo para usarlo en otras partes del código del programa 
module.exports = Usuario;