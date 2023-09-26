const IP = "ws://localhost:3000";
const socket = io(IP);

socket.on("connect", () => {
    console.log("Me conecté a WS");
});

function funcionPrueba() {
    socket.emit("incoming-message", { mensaje: "PRUEBA" });
}
socket.on("server-message", data => {
    
    console.log("Me llego del servidor", data);
});