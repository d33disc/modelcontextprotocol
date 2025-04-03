#!/usr/bin/env node

/**
 * Monitoring utility for Sequential Thinking MCP Server
 * 
 * This script connects to a running MCP server and displays runtime
 * statistics and health information.
 */

const http = require('http');
const os = require('os');
const readline = require('readline');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bright: '\x1b[1m',
  dim: '\x1b[2m'
};

// Process command line arguments
const args = process.argv.slice(2);
const host = args[0] || 'localhost';
const port = parseInt(args[1], 10) || 3000;

// Print header
console.log(`
${colors.blue}${colors.bright}Sequential Thinking MCP Server Monitor${colors.reset}
${colors.cyan}──────────────────────────────────────────${colors.reset}
${colors.yellow}Target server: ${colors.white}${host}:${port}${colors.reset}
${colors.yellow}Press Ctrl+C to exit${colors.reset}
`);

// Setup refresh interval (default 5 seconds)
const REFRESH_INTERVAL = process.env.REFRESH_INTERVAL || 5000;

// Variables to store stats
let serverStats = {
  status: 'unknown',
  uptime: '0',
  totalThoughtsProcessed: 0,
  revisions: 0,
  branches: 0,
  lastChecked: new Date()
};

let systemStats = {
  cpuUsage: 0,
  memoryUsage: 0,
  totalMemory: os.totalmem(),
  freeMemory: 0,
  loadAvg: [0, 0, 0]
};

// Function to get server health status
function checkServerHealth() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: host,
      port: port,
      path: '/health',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const health = JSON.parse(data);
            resolve({
              status: 'online',
              ...health
            });
          } else {
            resolve({
              status: 'error',
              statusCode: res.statusCode,
              message: data
            });
          }
        } catch (err) {
          resolve({
            status: 'error',
            message: 'Invalid response format'
          });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({
        status: 'offline',
        message: err.message
      });
    });
    
    req.end();
  });
}

// Function to update system stats
function updateSystemStats() {
  // CPU load
  systemStats.loadAvg = os.loadAvg();
  
  // Memory stats
  systemStats.freeMemory = os.freemem();
  systemStats.memoryUsage = ((systemStats.totalMemory - systemStats.freeMemory) / systemStats.totalMemory * 100).toFixed(2);
  
  return systemStats;
}

// Format bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

// Function to render the dashboard
function renderDashboard() {
  // Clear the console
  console.clear();
  
  // Status color
  const statusColor = 
    serverStats.status === 'online' ? colors.green :
    serverStats.status === 'offline' ? colors.red :
    colors.yellow;
  
  // Format timestamp
  const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
  
  // Print header
  console.log(`
${colors.blue}${colors.bright}Sequential Thinking MCP Server Monitor${colors.reset}
${colors.cyan}──────────────────────────────────────────${colors.reset}
${colors.yellow}Target server: ${colors.white}${host}:${port}${colors.reset}
${colors.yellow}Last updated: ${colors.white}${timestamp}${colors.reset}
${colors.yellow}Press Ctrl+C to exit${colors.reset}

${colors.bright}Server Status${colors.reset}
  Status:        ${statusColor}${serverStats.status.toUpperCase()}${colors.reset}
  Version:       ${colors.white}${serverStats.version || 'N/A'}${colors.reset}
  Uptime:        ${colors.white}${serverStats.uptime || 'N/A'}${colors.reset}

${colors.bright}Server Statistics${colors.reset}
  Thoughts:      ${colors.white}${serverStats.totalThoughtsProcessed || 0}${colors.reset}
  Revisions:     ${colors.white}${serverStats.revisions || 0}${colors.reset}
  Branches:      ${colors.white}${serverStats.branches || 0}${colors.reset}

${colors.bright}System Statistics${colors.reset}
  CPU Load:      ${colors.white}${systemStats.loadAvg.map(load => load.toFixed(2)).join(', ')}${colors.reset}
  Memory Usage:  ${colors.white}${systemStats.memoryUsage}%${colors.reset}
  Free Memory:   ${colors.white}${formatBytes(systemStats.freeMemory)}${colors.reset}
  Total Memory:  ${colors.white}${formatBytes(systemStats.totalMemory)}${colors.reset}
`);

  // Display error message if server is offline
  if (serverStats.status !== 'online') {
    console.log(`${colors.red}${colors.bright}ERROR: ${colors.reset}${colors.red}${serverStats.message || 'Unable to connect to server'}${colors.reset}`);
    console.log(`${colors.yellow}Make sure the server is running and accessible at ${host}:${port}${colors.reset}`);
  }
}

// Function to update all statistics
async function updateStats() {
  try {
    // Update server health
    serverStats = await checkServerHealth();
    serverStats.lastChecked = new Date();
    
    // Update system statistics
    updateSystemStats();
    
    // Render dashboard
    renderDashboard();
  } catch (error) {
    console.error(`Error updating stats: ${error.message}`);
    serverStats.status = 'error';
    serverStats.message = error.message;
    renderDashboard();
  }
}

// Initial update
updateStats();

// Set up interval for updates
const intervalId = setInterval(updateStats, REFRESH_INTERVAL);

// Handle Ctrl+C to exit gracefully
process.on('SIGINT', () => {
  clearInterval(intervalId);
  console.log('\nMonitoring stopped. Goodbye!');
  process.exit(0);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception: ${error.message}`);
  console.error(error.stack);
  clearInterval(intervalId);
  process.exit(1);
});
