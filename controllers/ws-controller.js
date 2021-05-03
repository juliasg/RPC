//va tever varios usuarios 
const users = [];

const send = (ws, data) => {
  const d = JSON.stringify({
    jsonrpc: '2.0',
    ...data
  });
  ws.send(d);
}
// funcion para verificar  si el usuario existe
const isUsernameTaken = (username) => {
  let taken = false;
  for (let i=0; i<users.length; i++) {
    if (users[i].username === username) {
      taken = true;
      break;
    }
  }
  return taken;
}

module.exports = (ws, req) => {

  ws.on('message', (msg) => {
    // Recibimos el JSON
    const data = JSON.parse(msg);
  // Accedemos al json a su llave method
    switch (data.method) {
      case 'username':
// Llamamos a la funcion para verificar si existe el usuario,
// Le pasamos el parametro recibido del JSON
        if (isUsernameTaken(data.params.username)) {
          send(ws, {id: data.id, error: {message: 'usuario ya existe'}})
        } else {
          users.push({
            username: data.params.username,
            ws: ws,
          });
          send(ws, {id: data.id, result: {status: 'conectado'}})
        }
        break;
        // En caso de que el valor de metodo sea message hara lo siguiene
      case 'message':
        // send message to all connected users
        const username = users.find(user => user.ws == ws).username;
        users.forEach(user => {
          send(user.ws, {method: 'update', params: {message: data.params.message, username:username}})
        })
        break;
    }
  })

}