module.exports = {
  apps: [{
    name: "file-sharing-client",
    script: "./server.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}; 