function login(){
    user = document.getElementById("usuarioId").value
    passw = document.getElementById("passwordId").value
    data = {
        usuario: user,
        pass: passw
    }
    entrar(data)
}

async function entrar(data){
    try {
        const response = await fetch("/login", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        //En result obtengo la respuesta
        const result = await response.json();
        console.log("Success:", result);
    
        if (result.validar == false) {
          alert("Los datos son incorrectos")
        } 
        else {
            {document.getElementById("loguearse").submit()}        
          }
      } catch (error) {
        console.error("Error:", error);
      }
}

function nuevoUsuario(){

  let usuario = document.getElementById("usuarioId").value
  let contraseña = document.getElementById("passwordId").value

  let data = {
    user: usuario,
    pass: contraseña
  }
    registrarse(data)

}
function guardarMensaje(){
  let mensaje= document.getElementById("msj").value
  let msj={
    message: mensaje
  }
  guardarMsj(msj)
}
async function guardarMsj(msj){
  try {
    const response = await fetch("/guardarMensaje", {
      method: "POST", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msj),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    
    } catch (error) {
      console.error("Error:", error);
    }
}
async function registrarse(data){
    try {
    const response = await fetch("/nuevoUsuario", {
      method: "POST", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    if (result.validar == false) {
      alert("El usuario no se puede crear")
      location.href = '/Registro'
    }
    else{
      console.log("Usuario creado con exito")
      location.href = '/home'
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function mostrar() {
  try {
    const response = await fetch("/mostrarChats", {
      method: "PUT", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({validar: true}),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();

    console.log("Success:", result);
    let vector = result
    console.log("Success:", vector); 
    console.log("dd", vector.chats[0][0].nombre) 

    for (let i = 0; i < vector.chats[0].length; i++) {
      const element = vector.chats[0][i];
      console.log("Elemnt: ",element.nombre)
      let html = `
        <div name="chatid" class="friend-drawer friend-drawer--onhover" title = "${element.nombre}" id=${element.id_chat} onclick=entrarChat(this)>
        <div class="text">`
      html+=`
        <h6 id="nombreChat">${element.nombre}</h6>
      `;
      html += `</div>
            <span class="time text-muted small">13:21</span>
        </div> 
      <hr>`;
      document.getElementById("chats").innerHTML += html;
    }
    
  }
  catch (error) {
    console.error("Error:", error);
  
}
}

/*function mostrarMensasjes(){
  console.log("se pueden hacer funciones por websocket")
}*/

async function mostrarMensasjes() {
  try {
    const response = await fetch("/mostrarMensajes", {
      method: "PUT", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({validar: true}),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();

    console.log("Success:", result);
    let vector = result.mensajes
    let usuario = result.user
    console.log("Soy el usuario ", usuario)
    console.log(result.mensajes[0][0].mensaje)
    for (let i = 0; i < result.mensajes[0].length; i++){
      const element = result.mensajes[0][i];
      //console.log("Elemnt: ",element.mensaje)
      //console.log("Elemnt: ",element.ID_contact)
      let html = `<div class="row no-gutters" id=${element.id_mensaje} >
      `
      if(element.ID_contact != usuario){
        html += `<div class="col-md-3">
                <div class="chat-bubble chat-bubble--left">
          ${element.mensaje} 
        </div></div>`} 
        else{
          html += `<div class="col-md-3 offset-md-9">
                  <div class="chat-bubble chat-bubble--right">
          ${element.mensaje} 
        </div></div>`
        }
      html+= `</div>  
    </div>
    `
    document.getElementById("mensajesViejos").innerHTML += html;
    }
  }
  catch (error) {
    console.error("Error:", error);
  
}
}



/*$( '.friend-drawer--onhover' ).on( 'click',  function() {
  
  $( '.chat-bubble' ).hide('slow').show('slow');
  
});*/




