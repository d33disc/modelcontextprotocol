#!/usr/bin/env node

/**
 * Sequential Thinking MCP Server CLI
 */

// Process command line arguments
const args = process.argv.slice(2);
const validateOnly = args.includes('--validate');
const debug = args.includes('--debug');

// Set up error handling
process.on('uncaughtException', (error) => {
  console.error('\n❌ Uncaught Exception:');
  if (debug) {
    console.error(error);
  } else {
    console.error(`Error: ${error.message}`);
    console.error('Run with --debug for more details');
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ Unhandled Promise Rejection:');
  if (debug) {
    console.error('Promise:', promise);
    console.error('Reason:', reason);
  } else {
    console.error(`Error: ${reason}`);
    console.error('Run with --debug for more details');
  }
  process.exit(1);
});

// Run validation to ensure proper JSON structure before starting
try {
  require('../validate');
  
  if (validateOnly) {
    console.log('✅ Validation successful! Schema is properly formatted.');
    process.exit(0);
  }
} catch (error) {
  console.error('❌ Validation failed, server not started:');
  console.error(error.message);
  if (debug) {
    console.error(error.stack);
  }
  process.exit(1);
}

// If validation succeeds and not in validate-only mode, start the server
console.log('Starting Sequential Thinking MCP Server...');

try {
  const sequentialThinkingServer = require('../index');
  sequentialThinkingServer.start();
  
  console.log('\n✅ Server started successfully!');
  console.log('Listening for sequential thinking requests...');
  console.log('Press Ctrl+C to stop the server');
} catch (error) {
  console.error('\n❌ Failed to start server:');
  console.error(error.message);
  if (debug) {
    console.error(error.stack);
  }
  process.exit(1);
}
