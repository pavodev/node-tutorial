// core modules
const fs = require("fs");
const http = require("http");
const url = require("url");

// own modules
const replaceTemplate = require("./modules/replaceTemplate");

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

const overviewTemp = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const productTemp = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const cardTemp = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

/*
  Each time a request comes to the server, this function will be called;
*/
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(cardTemp, el))
      .join("");
    const output = overviewTemp.replace("{%PRODUCT_CARD%}", cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const output = replaceTemplate(productTemp, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);

    // Not found
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
