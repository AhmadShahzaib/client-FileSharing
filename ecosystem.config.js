module.exports = {
  apps: [{
    name: "file-sharing-client",
    script: "serve",
    env: {
      PM2_SERVE_PATH: './build',
      PM2_SERVE_PORT: 3000,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html',
      PM2_SERVE_REWRITE_RULES: JSON.stringify([
        { "from": "/login", "to": "/index.html" },
        { "from": "/register", "to": "/index.html" },
        { "from": "/dashboard", "to": "/index.html" },
        { "from": "/share/*", "to": "/index.html" }
      ])
    }
  }]
}; 