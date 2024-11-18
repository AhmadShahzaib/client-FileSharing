module.exports = {
  apps: [{
    name: "file-sharing-client",
    script: "npx",
    args: "serve -s build -l 3000",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}; 