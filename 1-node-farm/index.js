const fs = require("fs");
const http = require("http");
const url = require("url");

/* 
///////////////////////////
// FILES
///////////////////////////
// Blocking, synchronous way

const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textInput);

const textOut = `This is the text from the file: ${textInput}.\nCreated on ${Date.now()}`;

fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");

// Non-blocking, asynchronous way

fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  console.log(data1);
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("Your file has been written❕");
      });
    });
  });
});

console.log("Will read file!");

// ERROR HANDLING

fs.readFile("./txt/startttt.txt", "utf-8", (err, data1) => {
  console.log(data1);
  if (err) return console.log("ERROR! ⛔️");
});

*/

///////////////////////////
// WEB SERVER
///////////////////////////

/* 
  We do a synchronous action as we wont to execute this once 
  just at the beginning before everything 
*/
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
/*
  Each time a request comes to the server, this function will be called;
*/
const server = http.createServer((req, res) => {
  console.log(req.url); // we get '/' and '/favicon.ico' (the browser automatically makes it)

  // request url
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("this is the overview");
  } else if (pathName === "/product") {
    res.end("this is the product");
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("The page couldn't be found!");
  }
});

// start listening for the incoming requests
server.listen(8000, "127.0.0.1", () => {
  console.log("The server has been started on port 8000.");
});
