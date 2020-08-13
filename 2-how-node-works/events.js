const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const emitter = new Sales();

emitter.on("newSale", () => {
  console.log("There was a new sale");
});

emitter.on("newSale", (id) => {
  console.log("Costumer name: Ivan, ID: ", id);
});

emitter.emit("newSale", 9);

///////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request recieved");
  console.log(req.url);
  res.end("Request recieved 😲");
});

server.on("request", (req, res) => {
  console.log("😲");
  res.end("😲");
});

server.on("close", () => {
  console.log("Server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server listening on port 8000");
});
