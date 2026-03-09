module.exports = {
  apps: [{
    name: 'everstays-backend',
    script: './dist/main.js',
    instances: 1, // Use 1 for single instance, or 'max' for cluster mode (one per CPU core)
    exec_mode: 'fork', // 'fork' for single instance, 'cluster' for load balancing
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false, // Set to true only in development
    max_memory_restart: '1G', // Restart if memory exceeds 1GB
    min_uptime: '10s', // Minimum uptime before considering app stable
    max_restarts: 10, // Maximum number of restarts
    restart_delay: 4000, // Delay between restarts (ms)
    kill_timeout: 5000, // Time to wait before force kill
    listen_timeout: 10000, // Time to wait for app to start listening
    shutdown_with_message: true
  }]
};
