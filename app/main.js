const net = require("net");

const fs = require("fs");
const pathUtil = require("path");

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
      const fileName = path.replace("/files/", "");
      console.log(process.argv);
      const directory = process.argv[3] ?? __dirname;
      console.log("directory",directory);
      const filePath = pathUtil.join(directory, fileName);
      console.log("filePath",filePath);
      if (!fs.existsSync(filePath)) {
        console.log(404);
        socket.write("HTTP/1.1  404 Not Found\r\n\r\n", console.error);
      } else {
        const data = fs.readFileSync(filePath, "utf8");
        console.log("content: ", data);
        socket.write("HTTP/1.1  200 OK\r\n");
        socket.write("Content-Type: application/octet-stream\r\n");
        socket.write(`Content-Length: ${data.length}\r\n\r\n`);
        socket.write(data);
1
      }
    }else{
      const response = "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(response);
    }
    socket.end();
 
  });
});

server.listen(4221, "localhost");
