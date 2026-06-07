module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "server.js",
      cwd: "/opt/nextjs-app",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Restart if app crashes or runs out of memory
      autorestart: true,
      max_memory_restart: "512M",
      // Merge logs into one file
      combine_logs: true,
      // Rotate logs daily
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      // Don't restart too fast
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 1000,
    },
  ],
};
