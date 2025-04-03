/**
 * Mock implementation of MCP server for testing
 */

class MCPServer {
  constructor(options = {}) {
    this.options = options;
    this.tools = options.tools || [];
    this.handlers = {};
    
    console.log('Initialized MCP Server with tools:', this.tools);
  }
  
  implement(name, handler) {
    this.handlers[name] = handler;
    console.log(`Implemented tool: ${name}`);
    return this;
  }
  
  listen(port = 3000) {
    console.log(`MCP Server listening on port ${port}`);
    return this;
  }
}

module.exports = {
  MCPServer
};
