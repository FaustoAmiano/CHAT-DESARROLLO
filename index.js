
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
    saveUninitialized: true,
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
    console.log(respuesta[0].ID_contact)
    req.session.conectado = req.body.usuario;
    req.session.identifi = respuesta[0].ID_contact
    console.log(respuesta)
    console.log(req.session.conectado)
    console.log(req.session.identifi)
    if (respuesta.length > 0) {
        res.send({validar: true})
    
    }
    else{ 
        res.send({validar:false})    
    } 
});

app.post('/login', function(req, res){
    console.log("Soy un pedido GET", req.query); 
    //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('home', {user: req.session.conectado}); //Renderizo página "home" sin pasar ningún objeto a Handlebars
});


app.get('/registrarse', function(req, res){
    console.log("Soy un pedido GET", req.query); 
    //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('Registro', null); //Renderizo página "home" sin pasar ningún objeto a Handlebars
});

app.post('/nuevoUsuario', async function(req, res)
{
    let validar = true
    console.log("Soy un pedido POST", req.body); 
    let users= await MySQL.realizarQuery("SELECT * FROM Contactos")
    if (req.body.user.length == 0 || req.body.pass.length == 0 ){
        validar = false 
    }
    for (let i in users){
        if (req.body.user == users[i].user){
            console.log("falso")
            validar = false
        }
    }
    if (validar==true) {
        await MySQL.realizarQuery (`INSERT INTO Contactos (user,password) VALUES("${req.body.user}", "${req.body.pass}")`)   
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


let roomCounter= 0;
io.on("connection", (socket) => {
    //Esta línea es para compatibilizar con lo que venimos escribiendo
    const req = socket.request;

    //Función Listener
    //Esto serìa el equivalente a un app.post, app.get...
    
    

    socket.on('incoming-message', data => {
        mensajess=data.mensaje
        console.log(mensajess)
        console.log(req.session.conectado)
        nameLogueado = req.session.conectado
        saveMessage(mensajess, req.session)
        console.log("INCOMING MESSAGE:", data);
        data.user = nameLogueado
        io.emit("server-message", data);     
    });

    socket.on('room', data => {
        //req.session.sala.destroy();
        socket.join("room"+data.mandar)
        nom=data.mandar
        nom2=data.nombre
        req.session.sala = data.mandar
        console.log(req.session.sala)
        req.session.room = "room"+data.mandar;
        console.log(req.session.room) 
        req.session.save();
        //io.to(req.session.room).emit('cambioSala', nom)
        io.to(req.session.room).emit('cambioSala', nom2)
    })
});

/*setInterval(() => io.to("room1").emit("server-message", { mensaje: "MENSAJE DEL SERVIDOR" }), 1000);*/



async function saveMessage(data, session)
{
    console.log(session.identifi)
    console.log(session.sala)
    respuesta= await MySQL.realizarQuery(` INSERT INTO mensajes(id_chat, ID_contact, mensaje, fecha) VALUES  ("${session.sala}", "${session.identifi}", "${data}", NOW())`)
};

io.on("connection", socket => {
    socket.join("some room");
});

app.put('/mostrarChats', async function(req, res) {
    console.log("Soy un pedido PUT", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT
    let vector = [await MySQL.realizarQuery(` SELECT * FROM chats inner join usuarios_chats on usuarios_chats.id_chat = chats.id_chat
    Where ID_contact = ${req.session.identifi}`)]
    let vector2 = [await MySQL.realizarQuery(` SELECT * FROM mensajes`)]
    console.log(vector2)    
    if (vector.length > 0) {
        res.send({chats: vector})    
    }
    else{
        res.send({chats:false})    
    }
});

app.put('/mostrarMensajes', async function(req, res) {
    console.log("Soy un pedido PUT", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método PUT
    console.log(req.session.sala)
    let vector2 = [await MySQL.realizarQuery(` SELECT * FROM mensajes where id_chat= ${req.session.sala}`)]
    console.log(req.session.identifi)
    idLog = req.session.identifi 
    console.log(vector2)
    console.log(idLog)    
    if (vector2.length > 0) {
        res.send({mensajes: vector2, user: idLog})    
    }
    else{
        res.send({mensajes:false})    
    }
});