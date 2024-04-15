const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  
  socket.on("data", (data) => {
    
    const requestData = data.toString();
    
    const requestLines = requestData.split("\r\n");
    
    const [method, path, httpVersion] = requestLines[0].split(" ");
    if (path == '/'){
      const response = "HTTP/1.1 200 OK\r\n\r\n";
      socket.write(response);
    }else if(path.startsWith('/echo/')){
      const str = path.slice(6);
      const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`;
      socket.write(response);
    }
    else{
      const response = "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(response);
    }
    socket.end();
    //server.close();
  });
});

server.listen(4221, "localhost");
