# Sequential Thinking MCP Server: Troubleshooting Guide

This guide addresses common issues you might encounter when installing, running, or connecting to the Sequential Thinking MCP Server.

## Installation Issues

### Error: EACCES: permission denied

**Symptoms:**
- Error message contains `EACCES: permission denied`
- Installation fails when trying to install globally

**Solution:**
1. Install with sudo (Linux/macOS):
   ```bash
   sudo npm install -g .
   ```

2. Or fix npm permissions:
   ```bash
   mkdir -p ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
   source ~/.profile
   npm install -g .
   ```

### Error: Cannot find module '@modelcontextprotocol/mcp'

**Symptoms:**
- Error message contains `Cannot find module '@modelcontextprotocol/mcp'`
- Server fails to start

**Solution:**
1. Install the MCP package:
   ```bash
   cd /Users/chrisdavis/code/modelcontextprotocol/mcp
   npm install
   npm link
   cd /Users/chrisdavis/code/modelcontextprotocol/servers/src/sequentialthinking
   npm link @modelcontextprotocol/mcp
   ```

## Server Start Issues

### Error: Server disconnected

**Symptoms:**
- Server starts but immediately disconnects
- Error message: `Server disconnected. For troubleshooting guidance...`

**Solution:**
1. Check for JSON parsing errors:
   ```bash
   npm run validate
   ```

2. Fix any JSON syntax issues in the schema

3. Run with debug flag:
   ```bash
   mcp-sequential-thinking --debug
   ```

### Error: Port already in use

**Symptoms:**
- Error message contains `EADDRINUSE` or `address already in use`
- Server fails to start

**Solution:**
1. Find the process using the port:
   ```bash
   # Linux/macOS
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

2. Kill the process:
   ```bash
   # Linux/macOS
   kill -9 <PID>
   
   # Windows
   taskkill /F /PID <PID>
   ```

3. Or start the server on a different port:
   ```bash
   export MCP_PORT=3001
   mcp-sequential-thinking
   ```

## Connection Issues

### Error: Connection refused

**Symptoms:**
- Client cannot connect to the server
- Error message contains `ECONNREFUSED`

**Solution:**
1. Check if the server is running:
   ```bash
   ps aux | grep sequential-thinking
   ```

2. Verify that firewall allows connections:
   ```bash
   # Linux
   sudo ufw status
   
   # macOS
   sudo pfctl -s rules
   ```

3. Try connecting to localhost explicitly:
   ```bash
   node examples/test-server.js localhost 3000
   ```

### Error: Invalid JSON

**Symptoms:**
- Server logs show JSON parsing errors
- Client receives "Invalid request" response

**Solution:**
1. Validate your client request format:
   ```bash
   # Check against the sample request
   cat examples/sample-request.json
   ```

2. Ensure proper content-type headers:
   ```bash
   # The content-type must be application/json
   curl -X POST -H "Content-Type: application/json" -d @examples/sample-request.json http://localhost:3000
   ```

## Schema Validation Issues

### Error: Schema validation failed

**Symptoms:**
- Server fails to start with schema validation errors
- Error message contains "Schema validation failed"

**Solution:**
1. Check the schema structure:
   ```bash
   npm run validate
   ```

2. Common issues to fix:
   - Replace single quotes with double quotes
   - Remove trailing commas in JSON objects
   - Ensure property names are enclosed in double quotes
   - Verify required fields are properly defined

3. If needed, manually fix the schema in index.js

## Docker Issues

### Error: Docker image build failed

**Symptoms:**
- Docker build command fails
- Error in Dockerfile execution

**Solution:**
1. Ensure Docker is installed and running:
   ```bash
   docker --version
   ```

2. Check for syntax errors in Dockerfile:
   ```bash
   docker build --no-cache -t sequential-thinking-mcp .
   ```

3. Try building with verbose output:
   ```bash
   docker build --no-cache -t sequential-thinking-mcp . --progress=plain
   ```

### Error: Container exits immediately

**Symptoms:**
- Docker container starts but exits immediately
- No error message or logs

**Solution:**
1. Run the container with interactive mode:
   ```bash
   docker run -it --rm sequential-thinking-mcp sh
   ```

2. Check logs:
   ```bash
   docker logs <container_id>
   ```

3. Run the container with environment variables:
   ```bash
   docker run -p 3000:3000 -e DEBUG=mcp:* sequential-thinking-mcp
   ```

## Debugging Tips

### Enable verbose logging

Set the DEBUG environment variable:
```bash
# Linux/macOS
export DEBUG=mcp:*
mcp-sequential-thinking

# Windows
set DEBUG=mcp:*
mcp-sequential-thinking
```

### Test server with curl

```bash
curl -X POST -H "Content-Type: application/json" -d @examples/sample-request.json http://localhost:3000
```

### Inspect RPC communication

```bash
# Install tcpdump if needed
sudo apt-get install tcpdump

# Capture traffic on port 3000
sudo tcpdump -i lo -A -s 0 'port 3000'
```

### Check for memory issues

```bash
node --inspect bin/cli.js
```

Then open Chrome and navigate to `chrome://inspect` to debug.

## Getting Help

If you continue to experience issues after trying these troubleshooting steps, please:

1. Open an issue on the GitHub repository
2. Include detailed information:
   - Operating system and version
   - Node.js and npm versions
   - Complete error logs
   - Steps to reproduce
   - Any modifications made to the code

## Reporting Bugs

When reporting bugs, please include:

1. The exact error message
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Any relevant log files
6. Environment details
