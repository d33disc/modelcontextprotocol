/**
 * Test utilities for Sequential Thinking MCP Server
 */

// Create a mock client for connecting to the server
class MockClient {
  constructor(port = 3000) {
    this.port = port;
    this.connected = false;
  }
  
  async connect() {
    // Simulate connection
    this.connected = true;
    return true;
  }
  
  async disconnect() {
    this.connected = false;
    return true;
  }
  
  async callMethod(method, params) {
    if (!this.connected) {
      throw new Error('Client not connected');
    }
    
    if (method !== 'sequential_thinking') {
      throw new Error(`Method "${method}" not supported`);
    }
    
    // Validate required parameters
    const requiredParams = ['thought', 'nextThoughtNeeded', 'thoughtNumber', 'totalThoughts'];
    for (const param of requiredParams) {
      if (params[param] === undefined) {
        throw new Error(`Missing required parameter: ${param}`);
      }
    }
    
    // Mock response based on input
    return {
      thoughtProcessed: true,
      thoughtNumber: params.thoughtNumber,
      guidance: params.nextThoughtNeeded 
        ? 'Continue with your sequential thinking process.'
        : 'You have completed your sequential thinking process.'
    };
  }
}

// Create test input data
function createTestThought(overrides = {}) {
  return {
    thought: 'This is a test thought',
    nextThoughtNeeded: true,
    thoughtNumber: 1,
    totalThoughts: 5,
    ...overrides
  };
}

// Export utilities
module.exports = {
  MockClient,
  createTestThought
};
