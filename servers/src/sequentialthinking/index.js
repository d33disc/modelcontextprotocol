const { MCPServer } = require('@modelcontextprotocol/mcp');
const http = require('http');

// Define the sequential_thinking tool schema with proper JSON format
const sequentialThinkingSchema = {
  "name": "sequential_thinking",
  "description": "Facilitates a detailed, step-by-step thinking process for problem-solving and analysis.",
  "parameters": {
    "type": "object",
    "properties": {
      "thought": {
        "type": "string",
        "description": "The current thinking step"
      },
      "nextThoughtNeeded": {
        "type": "boolean",
        "description": "Whether another thought step is needed"
      },
      "thoughtNumber": {
        "type": "integer",
        "description": "Current thought number"
      },
      "totalThoughts": {
        "type": "integer",
        "description": "Estimated total thoughts needed"
      },
      "isRevision": {
        "type": "boolean",
        "description": "Whether this revises previous thinking"
      },
      "revisesThought": {
        "type": "integer",
        "description": "Which thought is being reconsidered"
      },
      "branchFromThought": {
        "type": "integer",
        "description": "Branching point thought number"
      },
      "branchId": {
        "type": "string",
        "description": "Branch identifier"
      },
      "needsMoreThoughts": {
        "type": "boolean",
        "description": "If more thoughts are needed"
      }
    },
    "required": ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"]
  },
  "returns": {
    "type": "object",
    "properties": {
      "thoughtProcessed": {
        "type": "boolean",
        "description": "Confirmation that the thought was processed"
      },
      "thoughtNumber": {
        "type": "integer",
        "description": "The processed thought number"
      },
      "guidance": {
        "type": "string",
        "description": "Optional guidance for the next steps"
      }
    },
    "required": ["thoughtProcessed", "thoughtNumber"]
  }
};

// Create a server instance
const server = new MCPServer({
  tools: [sequentialThinkingSchema]
});

// Setup health check endpoint
const healthCheckPort = process.env.HEALTH_CHECK_PORT || 3000;
const healthCheckServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'sequential-thinking-mcp',
      version: '1.0.0'
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Store statistics about processed thoughts
const statistics = {
  totalThoughtsProcessed: 0,
  revisions: 0,
  branches: 0,
  startTime: new Date().toISOString()
};

// Implement the sequential_thinking tool
server.implement('sequential_thinking', async (params) => {
  try {
    const {
      thought,
      nextThoughtNeeded,
      thoughtNumber,
      totalThoughts,
      isRevision,
      revisesThought,
      branchFromThought,
      branchId,
      needsMoreThoughts
    } = params;

    // Log the received thought (in a real implementation, you might store these)
    console.log(`Processing thought #${thoughtNumber}/${totalThoughts}`);
    
    // Update statistics
    statistics.totalThoughtsProcessed++;
    
    if (isRevision) {
      console.log(`Revising thought #${revisesThought}`);
      statistics.revisions++;
    }
    
    if (branchFromThought) {
      console.log(`Branching from thought #${branchFromThought} with branch ID: ${branchId || 'unnamed'}`);
      statistics.branches++;
    }

    // Process the thought (this is where you would implement your actual logic)
    // For now, we'll just echo back confirmation
    
    let guidance = '';
    if (nextThoughtNeeded) {
      guidance = 'Continue with your sequential thinking process.';
    } else {
      guidance = 'You have completed your sequential thinking process.';
    }

    if (needsMoreThoughts) {
      guidance += ' Consider adding more thoughts to fully explore the problem space.';
    }

    // Return the result
    return {
      thoughtProcessed: true,
      thoughtNumber: thoughtNumber,
      guidance: guidance
    };
  } catch (error) {
    console.error('Error in sequential_thinking handler:', error);
    throw error; // Re-throw to let MCP server handle it
  }
});

// Export the server start function
module.exports = {
  start: () => {
    try {
      // Start the health check server
      healthCheckServer.listen(healthCheckPort, () => {
        console.log(`Health check server running on port ${healthCheckPort}`);
      });
      
      // Start the MCP server
      server.listen();
      console.log('Sequential Thinking MCP Server started successfully');
    } catch (error) {
      console.error('Failed to start Sequential Thinking MCP Server:', error);
      throw error;
    }
  },
  
  // Export statistics for monitoring
  getStatistics: () => {
    return {
      ...statistics,
      uptime: `${(new Date() - new Date(statistics.startTime)) / 1000} seconds`
    };
  }
};
