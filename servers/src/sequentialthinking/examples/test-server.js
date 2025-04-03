#!/usr/bin/env node

/**
 * Test client for Sequential Thinking MCP Server
 * 
 * This script sends a test request to a running Sequential Thinking MCP Server
 * and displays the response.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Default server address and port
const SERVER_HOST = 'localhost';
const SERVER_PORT = 3000;

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Get the sample request data
const sampleRequestPath = path.join(__dirname, 'sample-request.json');
const requestData = fs.readFileSync(sampleRequestPath, 'utf8');

// Parse command line arguments
const args = process.argv.slice(2);
const host = args[0] || SERVER_HOST;
const port = parseInt(args[1], 10) || SERVER_PORT;

// Display test info
console.log(`${colors.blue}Sequential Thinking MCP Server Test Client${colors.reset}`);
console.log(`${colors.cyan}Target server: ${host}:${port}${colors.reset}`);
console.log(`${colors.cyan}Request data:${colors.reset}`);
console.log(JSON.stringify(JSON.parse(requestData), null, 2));

// Options for HTTP request
const options = {
  hostname: host,
  port: port,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestData)
  }
};

// Send the request
console.log(`\n${colors.yellow}Sending request...${colors.reset}`);

const req = http.request(options, (res) => {
  let data = '';
  
  // Collect response data
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // Process the complete response
  res.on('end', () => {
    console.log(`${colors.green}Response received (HTTP ${res.statusCode}):${colors.reset}`);
    
    try {
      // Try to parse the response as JSON
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
      
      // Check if the response has the expected structure
      if (jsonData.result && jsonData.result.thoughtProcessed === true) {
        console.log(`\n${colors.green}✓ Test successful! Server is working properly.${colors.reset}`);
      } else {
        console.log(`\n${colors.yellow}⚠ Response format is not as expected. Check server implementation.${colors.reset}`);
      }
    } catch (e) {
      console.log(`${colors.red}Failed to parse response as JSON:${colors.reset}`);
      console.log(data);
      console.log(`\n${colors.red}✗ Test failed! Server response is not valid JSON.${colors.reset}`);
    }
  });
});

// Handle request errors
req.on('error', (e) => {
  console.error(`${colors.red}Request failed: ${e.message}${colors.reset}`);
  console.log(`${colors.yellow}Is the server running at ${host}:${port}?${colors.reset}`);
});

// Send the request data
req.write(requestData);
req.end();
