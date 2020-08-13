const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  /* 
    Solution 1
    There is a problem: node would have to load the entire file into the 
    memory. Only after the file is ready node can send it back to the client.
  */
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) console.log(err);
  //     res.end(data);
  //   });
  /* 
    Solution 2: Streams
    There is still a problem: Readable stream is much faster than sending 
    the result over the network. This problem would overwhelm the response stream
    which cannot handle all the incoming data.
  */
  //   const readable = fs.createReadStream("test-file.txt");
  //   readable.on("data", (chunk) => {
  //     res.write(chunk);
  //   });
  //   readable.on("end", () => {
  //     console.log("Stream finished");
  //     res.end();
  //   });
  //   readable.on("error", (err) => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end("File not found");
  //   });

  /*
    Solution 3: pipe operator
    We need a readable source and we can put a writable source in it.
    The flow of data will be automatically managed so that the destination 
    Writable stream is not overwhelmed by a faster Readable stream
  */
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on 127.0.0.1:8000");
});
