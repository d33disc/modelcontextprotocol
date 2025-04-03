#!/bin/bash

# Script to update the Claude Desktop config file with sequential thinking MCP server
# Usage: ./update-claude-config.sh [config-path]

# Default config path based on common locations
DEFAULT_MAC_PATH="$HOME/Library/Application Support/Claude Desktop/claude_desktop_config.json"
DEFAULT_LINUX_PATH="$HOME/.config/Claude Desktop/claude_desktop_config.json" 
DEFAULT_WIN_PATH="$APPDATA\\Claude Desktop\\claude_desktop_config.json"

# Determine OS and set default path
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    DEFAULT_PATH="$DEFAULT_MAC_PATH"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    DEFAULT_PATH="$DEFAULT_LINUX_PATH"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    DEFAULT_PATH="$DEFAULT_WIN_PATH"
    # Convert to Unix path for Git Bash if needed
    if [[ -n "$MSYSTEM" ]]; then
        DEFAULT_PATH=$(cygpath -u "$DEFAULT_PATH")
    fi
else
    echo "Unsupported OS: $OSTYPE"
    echo "Please specify the config path manually"
    exit 1
fi

# Use provided path or default
CONFIG_PATH="${1:-$DEFAULT_PATH}"

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Run the Node.js script
node "$SCRIPT_DIR/update-config.js" "$CONFIG_PATH"

# Check if successful
if [ $? -eq 0 ]; then
    echo "✅ Claude Desktop configuration updated successfully!"
    echo "Configuration added:"
    echo "  - Sequential Thinking MCP Server"
    echo ""
    echo "Restart Claude Desktop to apply the changes."
else
    echo "❌ Failed to update configuration."
fi
