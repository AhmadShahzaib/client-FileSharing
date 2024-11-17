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
        { "source": "/**", "destination": "/index.html" }
      ])
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
}; 