const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const { mongoose } = require('./database');
const cors = require('cors');

//Inicializations
const app = express();

//Settings
app.set('port', config.port);  //para definir el puerto

//Middleware
app.use(morgan('dev')); //Para que aparezca por consola las peticiones que se le hacen al servidor
app.use(express.urlencoded({extended: false})); //Para enviar desde un formulario html
app.use(express.json());    //Para que el servidor entienda los tipos de datos json
app.use(cors());    //Para permitir que se realicen peticiones al servidor

//Routes
app.use('/api/roles', require('./routes/role.route'));
app.use('/api/entity', require('./routes/entity.route'));

//Starting the server
app.listen(app.get('port'), console.log('Server on port ', app.get('port')));