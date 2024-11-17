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
        { "source": "/login", "destination": "/index.html" },
        { "source": "/register", "destination": "/index.html" },
        { "source": "/dashboard", "destination": "/index.html" },
        { "source": "/share/*", "destination": "/index.html" },
        { "source": "/", "destination": "/index.html" }
      ]),
      PM2_SERVE_NO_REDIRECT: 'true'
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
}; 