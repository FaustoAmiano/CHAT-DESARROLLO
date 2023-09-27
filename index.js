
/*  Paquetes instalados: -g nodemon, express, express-handlebars, body-parser, mysql2
    Agregado al archivo "package.json" la línea --> "start": "nodemon index"
    
    Proyecto "Node_base"
    Desarrollo de Aplicaciones Informáticas - 5to Informática
    
    Docentes: Nicolás Facón, Martín Rivas
    
    Revisión 1 - Año 2021
*/
//Cargo librerías instaladas y necesarias
const express = require('express'); //Para el manejo del servidor Web
const exphbs  = require('express-handlebars'); //Para el manejo de los HTML
const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql'); //Añado el archivo mysql.js presente en la carpeta módulos
const session = require('express-session');
const app = express(); //Inicializo express para el manejo de las peticiones

app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Web

const server = app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

const io = require('socket.io')(server);

const sessionMiddleware = session({
    secret: 'sararasthastka',
    resave: true,
    saveUninitialized: false,
});

app.use(sessionMiddleware);

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});
/*
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
*/

app.get('/', function(req, res)
{
    //Petición GET con URL = "/", lease, página principal.
    console.log(req.query); //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('login', null); //Renderizo página "login" sin pasar ningún objeto a Handlebars
});

app.put('/login', async function(req, res){
    console.log("Soy un pedido PUT", req.body);

    let respuesta= await MySQL.realizarQuery(` SELECT * FROM Contactos WHERE user= "${req.body.usuario}" AND password = "${req.body.pass}"`)
    
    if (respuesta.length > 0) {
        res.send({validar: true})
    
    }
    else{
        res.send({validar:false})    
    } 
});

app.get('/registrarse', function(req, res){
    //Petición GET con URL = "/login"
    console.log("Soy un pedido GET", req.query); 
    //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('Registro', null); //Renderizo página "home" sin pasar ningún objeto a Handlebars
});

app.post('/nuevoUsuario', async function(req, res)
{
    let validar = true
    //Petición POST con URL = "/login"
    console.log("Soy un pedido POST", req.body); 
    let users= await MySQL.realizarQuery("SELECT * FROM Usuarios")
    if (req.body.mail.length == 0 || req.body.user.length == 0 || req.body.pass.length == 0 ){
        validar = false 
    }
    for (let i in users){
        if (req.body.mail == users[i].mail){
            console.log("falso")
            validar = false
        }
    }
    if (validar==true) {
        await MySQL.realizarQuery (`INSERT INTO Usuarios VALUES("${req.body.mail}", "${req.body.user}", "${req.body.pass}",${false},${0})`) 
        mailLogueado = req.body.mail
        console.log(mailLogueado)   
        console.log("verdadero")
        res.send({validar:true}); //Renderizo página "home" enviando un objeto de 2 parámetros a Handlebars
    }
    else if (validar==false){
        console.log("falso2")
        res.send({validar:false})
    }
    
    //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método POST
    
    //res.render('home', null); //Renderizo página "home" sin pasar ningún objeto a Handlebars
});

app.post('/login', function(req, res)
{
    //Petición GET con URL = "/login"
    console.log("Soy un pedido Post login", req.query); 
    //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('home', null); //Renderizo página "home" sin pasar ningún objeto a Handlebars
});


app.delete('/login', function(req, res) {
    //Petición DELETE con URL = "/login"
    console.log("Soy un pedido DELETE", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método DELETE
    res.send(null);
});

io.on("connection", (socket) => {
    //Esta línea es para compatibilizar con lo que venimos escribiendo
    const req = socket.request;

    //Función Listener
    //Esto serìa el equivalente a un app.post, app.get...

    

    socket.on('incoming-message', data => {
        mensajess=data.mensaje
        console.log(mensajess)
 //       respuesta= await MySQL.realizarQuery(` INSERT INTO mensajes VALUE "${mensajess}"`)
        console.log("INCOMING MESSAGE:", data);   
        io.emit("server-message", data);     
    });
    
});
//setInterval(() => io.emit("server-message", { mensaje: "MENSAJE DEL SERVIDOR" }), 2000);