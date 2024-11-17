module.exports = {
  apps: [{
    name: "file-sharing-client",
    script: "serve",
    env: {
      PM2_SERVE_PATH: './build',
      PM2_SERVE_PORT: 3000
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
}; 