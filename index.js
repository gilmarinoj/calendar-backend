const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./db/config');


// Crear servidor de Express
const app = express()

// Conexion a la DB
dbConnection();

//CORS
app.use(cors());

// Directorio Publico
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth'));

// TODO: CRUD: Eventos

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }`);
})