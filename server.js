const StaticServer = require('static-server');

const server = new StaticServer({
  rootPath: './build',
  port: 3000,
  cors: true,
  followSymlink: true,
  templates: {
    notFound: 'build/index.html'  // Redirect all 404s to index.html
  }
});

server.start(() => {
  console.log('Server started on port', server.port);
}); 