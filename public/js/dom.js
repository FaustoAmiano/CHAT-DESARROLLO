function login(){
    user = document.getElementById("usuarioId")
    pass = document.getElementById("passwordId")
    data = {
        usuario: user,
        pass: password
    }
    entrar(data)
}

async function entrar(data){
    try {
        const response = await fetch("/login", {
          method: "POST",
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
        } else {
            {document.getElementById("loguearse").submit()}        
          }
      } catch (error) {
        console.error("Error:", error);
      }
}
$( '.friend-drawer--onhover' ).on( 'click',  function() {
  
  $( '.chat-bubble' ).hide('slow').show('slow');
  
});