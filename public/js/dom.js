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
        <div name="chatid" class="friend-drawer friend-drawer--onhover" id=${element.id_chat} onclick=entrarChat(this)>
        <div class="text">`
      html+=`
        <h6>${element.nombre}</h6>
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




/*$( '.friend-drawer--onhover' ).on( 'click',  function() {
  
  $( '.chat-bubble' ).hide('slow').show('slow');
  
});*/





