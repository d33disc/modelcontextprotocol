# Sequential Thinking MCP Server Documentation

## Overview

The Sequential Thinking MCP Server implements the Model Context Protocol (MCP) to provide step-by-step thinking capability for AI systems and other compatible clients. It helps structure and process sequential thoughts, making it easier to solve complex problems through methodical reasoning.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [API Reference](#api-reference)
4. [Usage Examples](#usage-examples)
5. [Advanced Topics](#advanced-topics)
6. [Integration Guide](#integration-guide)
7. [FAQ](#faq)

## Installation

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Global Installation

```bash
# Install from npm registry
npm install -g @modelcontextprotocol/server-sequential-thinking

# Or install from local directory
cd /path/to/sequentialthinking
npm install -g .
```

### Local Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/modelcontextprotocol.git
cd modelcontextprotocol/servers/src/sequentialthinking

# Install dependencies
npm install
```

### Docker Installation

```bash
# Build the Docker image
docker build -t sequential-thinking-mcp .

# Run the container
docker run -p 3000:3000 sequential-thinking-mcp
```

## Configuration

The server can be configured using environment variables or command-line arguments.

### Environment Variables

| Variable      | Description                    | Default    |
|---------------|--------------------------------|------------|
| `MCP_PORT`    | Port for the MCP server        | `3000`     |
| `MCP_HOST`    | Host address to listen on      | `0.0.0.0`  |
| `LOG_LEVEL`   | Logging level                  | `info`     |
| `DEBUG`       | Enable debug mode              | (not set)  |

### Command-Line Arguments

```bash
# Run with different port
mcp-sequential-thinking --port=3001

# Enable debugging
mcp-sequential-thinking --debug

# Validate schema only
mcp-sequential-thinking --validate
```

## API Reference

The server implements the `sequential_thinking` method according to the MCP specification.

### Method: `sequential_thinking`

#### Request Parameters

| Parameter           | Type     | Required | Description                           |
|---------------------|----------|----------|---------------------------------------|
| `thought`           | string   | Yes      | The current thinking step             |
| `nextThoughtNeeded` | boolean  | Yes      | Whether another thought is needed     |
| `thoughtNumber`     | integer  | Yes      | Current thought number                |
| `totalThoughts`     | integer  | Yes      | Estimated total thoughts needed       |
| `isRevision`        | boolean  | No       | Whether this revises previous thought |
| `revisesThought`    | integer  | No       | Which thought is being reconsidered   |
| `branchFromThought` | integer  | No       | Branching point thought number        |
| `branchId`          | string   | No       | Branch identifier                     |
| `needsMoreThoughts` | boolean  | No       | If more thoughts are needed           |

#### Response Fields

| Field              | Type     | Description                           |
|--------------------|----------|---------------------------------------|
| `thoughtProcessed` | boolean  | Confirmation that thought was processed |
| `thoughtNumber`    | integer  | The processed thought number          |
| `guidance`         | string   | Optional guidance for next steps      |

#### Example Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sequential_thinking",
  "params": {
    "thought": "First I need to understand the problem domain.",
    "nextThoughtNeeded": true,
    "thoughtNumber": 1,
    "totalThoughts": 5
  }
}
```

#### Example Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "thoughtProcessed": true,
    "thoughtNumber": 1,
    "guidance": "Continue with your sequential thinking process."
  }
}
```

## Usage Examples

### Basic Usage

1. Start the server:
   ```bash
   mcp-sequential-thinking
   ```

2. Send a request with curl:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{
     "jsonrpc": "2.0",
     "id": 1,
     "method": "sequential_thinking",
     "params": {
       "thought": "First I need to understand the problem domain.",
       "nextThoughtNeeded": true,
       "thoughtNumber": 1,
       "totalThoughts": 5
     }
   }' http://localhost:3000
   ```

### Node.js Client Example

```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const reqData = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'sequential_thinking',
  params: {
    thought: 'First I need to understand the problem domain.',
    nextThoughtNeeded: true,
    thoughtNumber: 1,
    totalThoughts: 5
  }
});

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(JSON.parse(data));
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(reqData);
req.end();
```

### Python Client Example

```python
import requests
import json

url = 'http://localhost:3000'
headers = {'Content-Type': 'application/json'}
data = {
    'jsonrpc': '2.0',
    'id': 1,
    'method': 'sequential_thinking',
    'params': {
        'thought': 'First I need to understand the problem domain.',
        'nextThoughtNeeded': True,
        'thoughtNumber': 1,
        'totalThoughts': 5
    }
}

response = requests.post(url, headers=headers, data=json.dumps(data))
result = response.json()
print(json.dumps(result, indent=2))
```

## Advanced Topics

### Thought Revisions

The server supports thought revisions, allowing for corrections to previous thoughts:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sequential_thinking",
  "params": {
    "thought": "I realize my initial assumption was incorrect.",
    "nextThoughtNeeded": true,
    "thoughtNumber": 3,
    "totalThoughts": 5,
    "isRevision": true,
    "revisesThought": 1
  }
}
```

### Thought Branching

The server supports branching from previous thoughts to explore alternative paths:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sequential_thinking",
  "params": {
    "thought": "Let's explore an alternative approach.",
    "nextThoughtNeeded": true,
    "thoughtNumber": 4,
    "totalThoughts": 7,
    "branchFromThought": 2,
    "branchId": "alternative-b"
  }
}
```

### Dynamic Thought Adjustment

When the thinking process needs to be extended:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sequential_thinking",
  "params": {
    "thought": "This problem requires more steps than initially estimated.",
    "nextThoughtNeeded": true,
    "thoughtNumber": 5,
    "totalThoughts": 8,
    "needsMoreThoughts": true
  }
}
```

## Integration Guide

### Integrating with AI Systems

For AI systems using the MCP protocol, you can integrate with the Sequential Thinking Server:

1. Establish a connection to the MCP server
2. Structure your thinking process as sequential steps
3. Send each thought to the server for processing
4. Use the guidance from responses to inform the next thought

### Production Deployment

For production environments:

1. Use Docker Compose for easy deployment:
   ```bash
   docker-compose up -d
   ```

2. Set up a reverse proxy (Nginx or similar):
   ```nginx
   server {
       listen 80;
       server_name mcp.example.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. Configure TLS for secure communication:
   ```bash
   # Generate a Let's Encrypt certificate
   certbot --nginx -d mcp.example.com
   ```

## FAQ

### How does this differ from other MCP servers?

The Sequential Thinking MCP Server specifically focuses on structured thinking processes, enabling step-by-step reasoning with support for revisions and branching.

### Can I modify the server for custom behavior?

Yes, you can extend the server by:
1. Modifying the handler in index.js
2. Adding additional methods beyond sequential_thinking
3. Implementing custom response logic

### How many concurrent connections can it handle?

The default Node.js implementation can handle hundreds of concurrent connections, depending on your hardware. For high-load scenarios, consider:
1. Horizontal scaling (multiple instances)
2. Load balancing
3. Clustering with Node.js cluster module

### Is persistent storage supported?

The base implementation does not include persistent storage, but you can add it by:
1. Integrating a database (MongoDB, Redis, etc.)
2. Modifying the handler to store thoughts
3. Implementing a retrieval system for past thoughts
