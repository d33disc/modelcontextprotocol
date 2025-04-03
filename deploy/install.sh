#!/bin/bash

# Sequential Thinking MCP Server Installation Script
echo "=== Installing Sequential Thinking MCP Server ==="

# Install the MCP core package
echo "Installing MCP Core Package..."
npm install -g ./modelcontextprotocol-mcp-0.1.0.tgz
if [ $? -ne 0 ]; then
    echo "Error installing MCP Core Package. Please check the error message above."
    exit 1
fi

# Install the Sequential Thinking MCP Server
echo "Installing Sequential Thinking MCP Server..."
npm install -g ./modelcontextprotocol-server-sequential-thinking-1.0.0.tgz
if [ $? -ne 0 ]; then
    echo "Error installing Sequential Thinking MCP Server. Please check the error message above."
    exit 1
fi

# Update Claude Desktop configuration
echo "Updating Claude Desktop configuration..."
bash ./scripts/update-claude-config.sh
if [ $? -ne 0 ]; then
    echo "Error updating Claude Desktop configuration. Please check the error message above."
    exit 1
fi

echo "=== Installation Complete ==="
echo "The Sequential Thinking MCP Server has been installed and configured for Claude Desktop."
echo "Please restart Claude Desktop to apply the changes."
