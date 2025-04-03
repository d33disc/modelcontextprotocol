# Sequential Thinking MCP Server Deployment Package

This package contains the Sequential Thinking MCP Server for Claude Desktop, which provides a tool for dynamic and reflective problem-solving through a structured thinking process.

## Installation

### Automatic Installation

Run the installation script:

```bash
./install.sh
```

This will:
1. Install the MCP core package
2. Install the Sequential Thinking MCP Server
3. Update Claude Desktop configuration to use the server

### Manual Installation

If you prefer to install the components manually:

1. Install the MCP core package:
   ```bash
   npm install -g ./modelcontextprotocol-mcp-0.1.0.tgz
   ```

2. Install the Sequential Thinking MCP Server:
   ```bash
   npm install -g ./modelcontextprotocol-server-sequential-thinking-1.0.0.tgz
   ```

3. Update Claude Desktop configuration:
   ```bash
   bash ./scripts/update-claude-config.sh
   ```

## Docker Installation

If you prefer to use Docker:

1. Build the Docker image:
   ```bash
   docker build -t mcp/sequentialthinking .
   ```

2. Update Claude Desktop configuration to use Docker:
   ```
   {
     "mcpServers": {
       "sequentialthinking": {
         "command": "docker",
         "args": [
           "run",
           "--rm",
           "-i",
           "mcp/sequentialthinking"
         ]
       }
     }
   }
   ```

## Features

- Break down complex problems into manageable steps
- Revise and refine thoughts as understanding deepens
- Branch into alternative paths of reasoning
- Adjust the total number of thoughts dynamically
- Generate and verify solution hypotheses

## After Installation

After installation, restart Claude Desktop to apply the changes. The Sequential Thinking tool will be available in your Claude interface.
