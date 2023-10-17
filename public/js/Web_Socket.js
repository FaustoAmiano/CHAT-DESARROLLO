const IP = "ws://localhost:3000";
const socket = io(IP);
let room;

socket.on("connect", () => {
    console.log("Me conecté a WS");
});


function mandarMensaje() {
    textoEnviado = document.getElementById("msj").value
    if (textoEnviado==""){
      console.log("No escribio nada")
    }else{
      data={
          mensaje: textoEnviado
      }
      socket.emit("incoming-message", { mensaje: textoEnviado });
      document.getElementById("msj").value="";
    }
}
socket.on("server-message", data => {
    
    console.log("Me llego del servidor", data);
    document.getElementById("mensajesViejos").innerHTML += `
    <div class="chat-panel">
    <div class="row no-gutters">
      <div class="col-md-3 offset-md-9">
        <div class="chat-bubble chat-bubble--right">
          ${data.mensaje}
        </div>
      </div>
    </div>
    `;  
    
    
});


/*socket.on("room", data => {
  room=data;
})*/
function entrarChat(div){
  data={
    mandar: div.id,
    nombre: div.title
  }
  socket.emit('room', data)  
}

async function backChats(){
  try {
    const response = await fetch("/buscarChat", {
      method: "POST", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

socket.on("cambioSala", nom2=>{
  console.log("nombre", nom2)
  mostrarMensasjes()
  document.getElementById("cuerpo").innerHTML =`
    <div class="col-md-8">
      <div class="settings-tray">
          <div class="friend-drawer no-gutters friend-drawer--grey">
          <img class="profile-image" src="https://randomuser.me/api/portraits/men/30.jpg" alt="">
          <div class="text">
            <h6>${nom2}</h6>
            <p class="text-muted">Te tengo al lado y me siento solo...</p>
          </div>
          <span class="settings-tray--right">
            <i class="material-icons">cached</i>
          </span>
        </div>
      </div>
      
      <div class="chat-panel" id="chat-panel">
        <div class="row no-gutters" id="mensajesViejos" >
          <div class="col-md-3">
             
        </div>
        </div>
        <div class="row" id="escribir">
          <div class="col-12">
            <div class="chat-box-tray">
              <input type="text" placeholder="Type your message here..." id="msj">
              <input type="button" value="Enviar" id="Enviar" onclick="mandarMensaje()"> 
            </div>
          </div>
        </div>
      </div>
  </div>
    `;

})