#!/bin/bash

# Start script for Sequential Thinking MCP Server
# Usage: ./start.sh [mode]
# Modes: development, production, cluster

# Set default mode
MODE=${1:-development}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Display header
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Sequential Thinking MCP Server        ${NC}"
echo -e "${BLUE}  Mode: ${GREEN}${MODE}${BLUE}                      ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Validate the server first
echo -e "${YELLOW}Validating server configuration...${NC}"
node ../validate.js
if [ $? -ne 0 ]; then
    echo -e "${RED}Validation failed. Exiting.${NC}"
    exit 1
fi
echo -e "${GREEN}Validation successful!${NC}"

# Set environment variables based on mode
case $MODE in
    development)
        export NODE_ENV=development
        export DEBUG=mcp:*
        export LOG_LEVEL=debug
        export MCP_PORT=3000
        
        echo -e "${YELLOW}Starting in development mode with live reload...${NC}"
        if command -v npx &> /dev/null; then
            npx nodemon --watch "../" ./cli.js
        else
            echo -e "${RED}nodemon not found. Install with 'npm install -g nodemon' or run without live reload.${NC}"
            node ./cli.js
        fi
        ;;
        
    production)
        export NODE_ENV=production
        export LOG_LEVEL=info
        export MCP_PORT=3000
        
        echo -e "${YELLOW}Starting in production mode...${NC}"
        node ./cli.js
        ;;
        
    cluster)
        export NODE_ENV=production
        export LOG_LEVEL=info
        export MCP_PORT=3000
        
        echo -e "${YELLOW}Starting in cluster mode...${NC}"
        
        # Simple cluster implementation
        cat > cluster_launcher.js << EOL
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(\`Master process \${process.pid} is running\`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died\`);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  // Workers can share the TCP connection
  require('./cli.js');
  console.log(\`Worker \${process.pid} started\`);
}
EOL
        
        node cluster_launcher.js
        ;;
        
    *)
        echo -e "${RED}Unknown mode: ${MODE}${NC}"
        echo -e "Valid modes: development, production, cluster"
        exit 1
        ;;
esac
