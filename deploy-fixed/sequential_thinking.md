# Sequential Thinking MCP Server (Fixed Version)

An MCP server implementation that provides a tool for dynamic and reflective problem-solving through a structured thinking process.

## Installation

### Automatic Installation

Run the installation script:

```bash
./install.sh
```

This will:
1. Install the MCP core package
2. Install the Sequential Thinking MCP Server
3. Validate the JSON schema
4. Update Claude Desktop configuration

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

3. Validate the installation:
   ```bash
   npx mcp-sequential-thinking --validate
   ```

4. Update Claude Desktop configuration:
   ```bash
   bash ./scripts/update-claude-config.sh
   ```

## Features

- Break down complex problems into manageable steps
- Revise and refine thoughts as understanding deepens
- Branch into alternative paths of reasoning
- Adjust the total number of thoughts dynamically
- Generate and verify solution hypotheses

## Troubleshooting

If you encounter JSON parsing errors like:
- "Unexpected token" 
- "is not valid JSON"
- "Expected property name"

These are typically caused by improperly formatted JSON in the server schema. The latest version includes validation to prevent these issues.

### Common Solutions:

1. **Reinstall with fixed version**: 
   ```bash
   npm uninstall -g @modelcontextprotocol/server-sequential-thinking
   npm install -g ./modelcontextprotocol-server-sequential-thinking-1.0.0.tgz
   ```

2. **Validate schema**:
   ```bash
   npx mcp-sequential-thinking --validate
   ```

3. **Check Claude Desktop logs**:
   The logs may provide additional information about the errors.

4. **Restart Claude Desktop**:
   After making any changes, restart Claude Desktop to apply them.

## After Installation

After installation, restart Claude Desktop to apply the changes. The Sequential Thinking tool will be available in your Claude interface.
