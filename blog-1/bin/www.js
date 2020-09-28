const http = require('http');
const PORT = 8000;
const handleServer = require('../app');
const server = http.createServer(handleServer);
server.listen(PORT);
