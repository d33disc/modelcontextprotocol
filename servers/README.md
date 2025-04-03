# Model Context Protocol (MCP) Servers

This repository contains various MCP server implementations that can be used with Claude and other MCP-compatible AI systems.

## Available Servers

- **Sequential Thinking**: A server for dynamic and reflective problem-solving through structured thinking

## Building

To build all servers:

```bash
npm install
```

To build a specific server (e.g., Sequential Thinking):

```bash
cd src/sequentialthinking
npm install
```

## Docker Builds

To build the Docker image for Sequential Thinking:

```bash
docker build -t mcp/sequentialthinking -f src/sequentialthinking/Dockerfile .
```

## Usage with Claude Desktop

### Automatic Configuration

The easiest way to configure Claude Desktop is to use the included update script:

```bash
# Run with default config location
./scripts/update-claude-config.sh

# Or specify a custom config location
./scripts/update-claude-config.sh /path/to/your/claude_desktop_config.json
```

This script will automatically:
- Find the Claude Desktop config file based on your operating system
- Create the config file if it doesn't exist
- Add the Sequential Thinking server configuration without removing any existing configurations
- Preserve all other settings in your config file

### Manual Configuration

Alternatively, you can manually add the desired server configuration to your `claude_desktop_config.json`. For example:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ]
    }
  }
}
```

## License

This project is licensed under the MIT License.
