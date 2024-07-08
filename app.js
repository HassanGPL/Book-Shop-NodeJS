const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req);
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>NODEJS Application</title></head>');
    res.write('<body><h1>Hello to my first NodeJS application</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(3000);