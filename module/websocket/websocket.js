let ws = new WebSocket("ws://" + location.host);
// ws.close();

ws.onopen = function() {
  console.log("open");
  ws.send("hello");
}

ws.onmessage = function(evt) {
  console.log(evt)
}

ws.onerror = function(event){
  console.log('error ed', event)
}

ws.onclose = function(event){
  console.log('Client  has closed', event)
}

// ws.close();

export default ws;