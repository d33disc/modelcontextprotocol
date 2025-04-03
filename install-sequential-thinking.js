#!/usr/bin/env node

/**
 * Installation script for Sequential Thinking MCP Server
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Helper function to execute commands and log output
function runCommand(command, options = {}) {
  console.log(`${colors.cyan}> ${command}${colors.reset}`);
  
  try {
    const output = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return options.silent ? output.toString().trim() : true;
  } catch (error) {
    if (options.ignoreError) {
      console.warn(`${colors.yellow}Command failed but continuing: ${error.message}${colors.reset}`);
      return false;
    }
    
    console.error(`${colors.red}Command failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Header
console.log(`
${colors.magenta}╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  ${colors.cyan}Sequential Thinking MCP Server Installation${colors.magenta}                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝${colors.reset}
`);

// Step 1: Check if Node.js and npm are installed
console.log(`\n${colors.blue}Step 1: Checking environment...${colors.reset}`);

try {
  const nodeVersion = execSync('node --version', { stdio: 'pipe' }).toString().trim();
  console.log(`${colors.green}✓ Node.js ${nodeVersion} is installed${colors.reset}`);
  
  const npmVersion = execSync('npm --version', { stdio: 'pipe' }).toString().trim();
  console.log(`${colors.green}✓ npm ${npmVersion} is installed${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}✗ Node.js or npm is not installed or not in PATH${colors.reset}`);
  console.error(`${colors.red}Please install Node.js from https://nodejs.org/${colors.reset}`);
  process.exit(1);
}

// Step 2: Install the sequential-thinking server
console.log(`\n${colors.blue}Step 2: Installing Sequential Thinking MCP Server...${colors.reset}`);

const serverPath = path.join(__dirname, 'servers', 'src', 'sequentialthinking');

if (!fs.existsSync(serverPath)) {
  console.error(`${colors.red}✗ Server source not found at ${serverPath}${colors.reset}`);
  process.exit(1);
}

// Change to the server directory
process.chdir(serverPath);
console.log(`${colors.green}✓ Changed directory to ${serverPath}${colors.reset}`);

// Install dependencies
console.log(`\n${colors.blue}Step 3: Installing dependencies...${colors.reset}`);
runCommand('npm install');
console.log(`${colors.green}✓ Dependencies installed${colors.reset}`);

// Run validation
console.log(`\n${colors.blue}Step 4: Validating server configuration...${colors.reset}`);
runCommand('node validate.js');
console.log(`${colors.green}✓ Validation successful${colors.reset}`);

// Install globally
console.log(`\n${colors.blue}Step 5: Installing server globally...${colors.reset}`);
runCommand('npm install -g .');
console.log(`${colors.green}✓ Server installed globally${colors.reset}`);

// Success message
console.log(`
${colors.green}╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  Installation Complete!                                        ║
║                                                                ║
║  You can now start the Sequential Thinking MCP Server with:    ║
║  ${colors.white}mcp-sequential-thinking${colors.green}                                    ║
║                                                                ║
║  For more options, run:                                        ║
║  ${colors.white}mcp-sequential-thinking --help${colors.green}                             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝${colors.reset}
`);
