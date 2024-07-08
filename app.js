const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const { url, method } = req;
    if (url === '/') {

        res.write('<html>');
        res.write('<head><title>NODEJS Application</title></head>');
        res.write('<body>');
        res.write('<form action="/message" method="POST">');
        res.write('<input type="text" name="message">');
        res.write('<button method="submit">Save</button>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');

        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        res.statusCode = 302;
        res.setHeader('Location', '/')
        return res.end();
    }

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>NODEJS Application</title></head>');
    res.write('<body><h1>Hello to my first NodeJS application</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(3000);