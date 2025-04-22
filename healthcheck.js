const http = require('http');

http.get({host:'localhost', path: '/healthcheck', port: '3000'}, (res) => {
  process.exitCode = res.statusCode === 200 ? 0 : 1;
  process.exit();
}).on('error', (err) => {
  console.error(err);
  process.exit(1);
});