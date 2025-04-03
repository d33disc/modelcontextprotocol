FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Set execution permission for CLI
RUN chmod +x ./bin/cli.js

# Expose the default MCP port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').request({port: 3000, path: '/health', timeout: 5000}, res => res.statusCode === 200 ? process.exit(0) : process.exit(1)).on('error', () => process.exit(1)).end()"

# Run the server
CMD ["node", "./bin/cli.js"]
