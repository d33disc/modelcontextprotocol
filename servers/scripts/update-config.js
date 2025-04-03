#!/usr/bin/env node

/**
 * update-config.js
 * 
 * This script updates the Claude Desktop configuration file to add the
 * sequential-thinking MCP server without removing existing configurations.
 * 
 * Usage:
 * node update-config.js <path-to-config-file>
 */

const fs = require('fs');
const path = require('path');

// Configuration to add
const sequentialThinkingConfig = {
  "sequential-thinking": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-sequential-thinking"
    ]
  }
};

// Get the config file path from command line arguments
const configPath = process.argv[2];

if (!configPath) {
  console.error('Error: Please provide the path to the Claude Desktop config file');
  console.error('Usage: node update-config.js <path-to-config-file>');
  process.exit(1);
}

// Try to read the existing config file
try {
  // Check if the file exists
  if (!fs.existsSync(configPath)) {
    // If it doesn't exist, create a new config with only our server
    const newConfig = {
      "mcpServers": sequentialThinkingConfig
    };
    
    // Create directory if it doesn't exist
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Write the config file
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    console.log(`Created new config file at ${configPath}`);
    process.exit(0);
  }
  
  // Read the existing config
  const configData = fs.readFileSync(configPath, 'utf8');
  let config;
  
  try {
    config = JSON.parse(configData);
  } catch (parseError) {
    console.error('Error: Could not parse the config file as JSON');
    console.error(parseError);
    process.exit(1);
  }
  
  // Ensure mcpServers exists
  if (!config.mcpServers) {
    config.mcpServers = {};
  }
  
  // Merge the sequential-thinking config with existing mcpServers
  config.mcpServers = {
    ...config.mcpServers,
    ...sequentialThinkingConfig
  };
  
  // Write the updated config back to the file
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Updated config file at ${configPath}`);
  
} catch (error) {
  console.error('Error updating the config file:');
  console.error(error);
  process.exit(1);
}
