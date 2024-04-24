const mongoose = require("mongoose");

const Producto = require(__dirname + "/models/producto.js");

mongoose.connect("mongodb://127.0.0.1:27017/productos");