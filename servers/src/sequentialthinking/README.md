# Sequential Thinking MCP Server

A Model Context Protocol (MCP) server that implements sequential thinking functionality, allowing for step-by-step problem-solving and analysis.

## Overview

This MCP server provides an API for processing sequential thoughts, enabling structured thinking processes for complex problem-solving. It's designed to work with any MCP-compatible client, including AI systems that can benefit from externalized sequential reasoning.

## Installation

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Install from NPM

```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
```

### Install from Source

1. Clone the repository:
```bash
git clone https://github.com/yourusername/modelcontextprotocol.git
cd modelcontextprotocol/servers/src/sequentialthinking
```

2. Install dependencies:
```bash
npm install
```

3. Install globally (optional):
```bash
npm install -g .
```

## Usage

### Start the Server

If installed globally:

```bash
mcp-sequential-thinking
```

If not installed globally:

```bash
# From the project directory
npm start

# Or directly
node bin/cli.js
```

### Command Line Options

- `--validate`: Validate the schema without starting the server
- `--debug`: Show detailed debugging information

### API

The server implements a single method called `sequential_thinking` with the following interface:

#### Input Parameters

- `thought` (string, required): The current thinking step
- `nextThoughtNeeded` (boolean, required): Whether another thought step is needed
- `thoughtNumber` (integer, required): Current thought number
- `totalThoughts` (integer, required): Estimated total thoughts needed
- `isRevision` (boolean): Whether this revises previous thinking
- `revisesThought` (integer): Which thought is being reconsidered
- `branchFromThought` (integer): Branching point thought number
- `branchId` (string): Branch identifier
- `needsMoreThoughts` (boolean): If more thoughts are needed

#### Return Values

- `thoughtProcessed` (boolean, required): Confirmation that the thought was processed
- `thoughtNumber` (integer, required): The processed thought number
- `guidance` (string): Optional guidance for the next steps

## Troubleshooting

### Common Issues

#### JSON Parsing Errors

If you see errors like "Unexpected token", it usually indicates a problem with the JSON structure. Run the validation script to get detailed feedback:

```bash
npm run validate
```

#### Connection Issues

If clients can't connect to the server:

1. Ensure the server is running and check for any error messages
2. Verify that the correct port is being used (default is 3000)
3. Check if any firewall is blocking the connection

#### Unexpected Server Disconnection

If the server disconnects unexpectedly:

1. Run with the `--debug` flag to get more information:
```bash
mcp-sequential-thinking --debug
```

2. Check your logs for errors or exceptions

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm pack
```
This will create a tarball that can be installed globally.

## License

MIT
