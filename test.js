// curl -k https://localhost:8000/
const https = require('https');
const fs = require('fs');
const port = 3000;
const options = {
  key: fs.readFileSync('./test/server.key'),
  cert: fs.readFileSync('./test/server.crt')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(port);

console.log('server listen ', port);
