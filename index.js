// Añade los módulos necesarios
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const nunjucks = require('nunjucks');
const methodOverride = require("method-override");
const dateFilter = require("nunjucks-date-filter");

// Crea la instancia de Express
let app = express();

// Configura la sesión dentro de la aplicación Express
app.use(session(
    {
        secret: "confianza",
        resave: true,
        saveUninitialized: false
    }
));

// Usuarios cargados en un array
const usuarios = [
    {usuario: "oscar", password: "confianza"},
    {usuario: "cristina", password: "carrefour"}
];

// Uso de urlencoded (antes de methodOverride siempre)
app.use(express.urlencoded({ extended: true }));

// Para usar un campo "method" oculto en vez del propio del formulario
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// Referencia al archivo necesario
const Producto = require(__dirname + "/models/producto");

// Permite usar archivos estáticos 
app.use(express.static('public'));

// Enrutadores
const productos = require(__dirname + "/routes/productos.js");

// Conecta a la base de datos de mongo
mongoose.connect("mongodb://127.0.0.1:27017/productos");

// Configura el motor Nunjucks
const env = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch:true
});

// Añade el filtro de la fecha
env.addFilter("date", dateFilter);

// Asigna el motor de plantillas
app.set('view engine', 'njk');

// Utiliza el middleware para converir a json las peticiones
app.use(express.json());

// Permite acceder a la carpeta donde está disponible el CSS de Bootstrap 
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

// Enrutadores para cada grupo de rutas
app.use("/", productos);

// Se pone a escuchar por el puerto 8080
app.listen(8080);