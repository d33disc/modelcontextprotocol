# Model Context Protocol Implementation

This repository contains implementations of the Model Context Protocol (MCP), including servers and client libraries.

## Sequential Thinking MCP Server

The primary MCP server in this repository provides sequential thinking capabilities, helping AI systems and other clients process thoughts in a step-by-step manner with support for revisions and alternative branches.

### Features

- **Sequential Processing**: Break down complex thoughts into manageable steps
- **Thought Revision**: Support for revising previous thoughts
- **Thought Branching**: Explore alternative reasoning paths
- **Health Monitoring**: Built-in health checks and monitoring tools
- **Easy Deployment**: Support for local, Docker, and cloud deployments

### Quick Start

```bash
# Install globally
npm install -g @modelcontextprotocol/server-sequential-thinking

# Start the server
mcp-sequential-thinking
```

Or use the installation script:

```bash
# Run the installation script
node install-sequential-thinking.js
```

### Documentation

- [Sequential Thinking MCP Server Documentation](servers/src/sequentialthinking/DOCUMENTATION.md)
- [Deployment Guide](servers/src/sequentialthinking/DEPLOYMENT.md)
- [Troubleshooting Guide](servers/src/sequentialthinking/TROUBLESHOOTING.md)

## Directory Structure

- **mcp/**: Core MCP library implementation
- **servers/**: MCP server implementations
  - **src/sequentialthinking/**: Sequential Thinking MCP Server
    - **bin/**: Executable scripts
    - **examples/**: Example requests and responses
    - **tests/**: Test suite
- **install-sequential-thinking.js**: Installation script

## Development

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/modelcontextprotocol.git
cd modelcontextprotocol

# Build the MCP library
cd mcp
npm install
npm link

# Build and install the Sequential Thinking server
cd ../servers/src/sequentialthinking
npm install
npm link @modelcontextprotocol/mcp
npm test
```

### Running Tests

```bash
cd servers/src/sequentialthinking
npm test
```

### Docker Build

```bash
cd servers/src/sequentialthinking
docker build -t sequential-thinking-mcp .
docker run -p 3000:3000 sequential-thinking-mcp
```

## Recent Changes

- **2025-04-02**: Fixed JSON parsing issues in sequential-thinking MCP server
- **2025-04-02**: Added health check endpoint
- **2025-04-02**: Improved error handling and logging
- **2025-04-02**: Added monitoring tools
- **2025-04-02**: Created comprehensive documentation
- **2025-04-02**: Added Docker and cloud deployment support

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
