const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  
  socket.on("data", (data) => {
    
    const requestData = data.toString();
    
    const requestLines = requestData.split("\r\n");

    console.log(requestLines);
    
    const [method, path, httpVersion] = requestLines[0].split(" ");
    if (path == '/'){
      const response = "HTTP/1.1 200 OK\r\n\r\n";
      socket.write(response);
    }else if(path.startsWith('/echo/')){
      const str = path.slice(6);
      const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`;
      socket.write(response);
    }else if(path === '/user-agent') {
      let userAgent = '';
      for (let i = 1; i < requestLines.length; i++) {
        if (requestLines[i].startsWith('User-Agent:')) {
          userAgent = requestLines[i].substring(12);
          break;
        }
      }

      const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
      socket.write(response);
    }else if(path.startsWith('/files/')){
      const filename = path.substring(7);
      console.log("filename",filename);
      const filepath = path.resolve(__dirname, filename);
      console.log("filepath",filepath);

      fs.readFile(filepath, (err, fileData) => {
        if (err) {
          console.error("Error reading file:", err);
          socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
          socket.end();
          return;
        }

        console.log("Sending file contents:", fileData.length, "bytes");
        const response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileData.length}\r\n\r\n`;
        socket.write(response);
        socket.write(fileData);
        socket.end();
      });
    }else{
      const response = "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(response);
    }
    socket.end();
 
  });
});

server.listen(4221, "localhost");
