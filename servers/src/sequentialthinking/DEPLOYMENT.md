# Sequential Thinking MCP Server Deployment Guide

This guide provides instructions for deploying the Sequential Thinking MCP Server in various environments.

## Table of Contents

1. [Local Deployment](#local-deployment)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
   - [AWS](#aws)
   - [Google Cloud](#google-cloud)
   - [Azure](#azure)
4. [Monitoring and Maintenance](#monitoring-and-maintenance)
5. [Security Considerations](#security-considerations)

## Local Deployment

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation Steps

1. Install the server globally:

```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
```

2. Start the server:

```bash
mcp-sequential-thinking
```

### Running as a Service

#### Linux (systemd)

1. Create a system service file:

```bash
sudo nano /etc/systemd/system/mcp-sequential-thinking.service
```

2. Add the following content:

```ini
[Unit]
Description=Sequential Thinking MCP Server
After=network.target

[Service]
Type=simple
User=<your-user>
ExecStart=/usr/local/bin/mcp-sequential-thinking
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=mcp-sequential-thinking
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:

```bash
sudo systemctl enable mcp-sequential-thinking
sudo systemctl start mcp-sequential-thinking
```

4. Check status:

```bash
sudo systemctl status mcp-sequential-thinking
```

#### macOS (launchd)

1. Create a plist file:

```bash
nano ~/Library/LaunchAgents/com.mcp.sequential-thinking.plist
```

2. Add the following content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.mcp.sequential-thinking</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/mcp-sequential-thinking</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardErrorPath</key>
    <string>/tmp/mcp-sequential-thinking.err</string>
    <key>StandardOutPath</key>
    <string>/tmp/mcp-sequential-thinking.out</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>NODE_ENV</key>
        <string>production</string>
    </dict>
</dict>
</plist>
```

3. Load the service:

```bash
launchctl load ~/Library/LaunchAgents/com.mcp.sequential-thinking.plist
```

4. Check status:

```bash
launchctl list | grep com.mcp.sequential-thinking
```

## Docker Deployment

### Using Pre-built Docker Image

1. Pull the image:

```bash
docker pull modelcontextprotocol/sequential-thinking
```

2. Run the container:

```bash
docker run -d --name sequential-thinking -p 3000:3000 modelcontextprotocol/sequential-thinking
```

### Building Your Own Docker Image

1. Clone the repository:

```bash
git clone https://github.com/yourusername/modelcontextprotocol.git
cd modelcontextprotocol/servers/src/sequentialthinking
```

2. Build the image:

```bash
docker build -t sequential-thinking-mcp .
```

3. Run the container:

```bash
docker run -d --name sequential-thinking -p 3000:3000 sequential-thinking-mcp
```

### Using Docker Compose

1. Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  sequential-thinking:
    image: modelcontextprotocol/sequential-thinking
    container_name: sequential-thinking-mcp
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
    volumes:
      - ./logs:/app/logs
```

2. Start the service:

```bash
docker-compose up -d
```

3. Check logs:

```bash
docker-compose logs -f
```

## Cloud Deployment

### AWS

#### Using EC2

1. Launch an EC2 instance (t3.micro or larger recommended)
2. Connect to your instance:

```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

3. Install Node.js:

```bash
curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs
```

4. Install and start the server:

```bash
sudo npm install -g @modelcontextprotocol/server-sequential-thinking
mcp-sequential-thinking
```

#### Using AWS Elastic Beanstalk

1. Create a `.ebextensions` directory in your project
2. Create a configuration file `.ebextensions/nodecommand.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
```

3. Deploy using the EB CLI:

```bash
eb init
eb create sequential-thinking-env
```

### Google Cloud

#### Using Google App Engine

1. Create an `app.yaml` file:

```yaml
runtime: nodejs14

env_variables:
  NODE_ENV: "production"
```

2. Deploy to App Engine:

```bash
gcloud app deploy
```

#### Using Google Cloud Run

1. Build and push the Docker image:

```bash
gcloud builds submit --tag gcr.io/your-project-id/sequential-thinking
```

2. Deploy to Cloud Run:

```bash
gcloud run deploy sequential-thinking --image gcr.io/your-project-id/sequential-thinking --platform managed
```

### Azure

#### Using Azure App Service

1. Create an App Service:

```bash
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name sequential-thinking --runtime "NODE|14-lts"
```

2. Configure deployment settings:

```bash
az webapp config appsettings set --resource-group myResourceGroup --name sequential-thinking --settings NODE_ENV=production
```

3. Deploy your code:

```bash
az webapp deployment source config-local-git --resource-group myResourceGroup --name sequential-thinking
git remote add azure <git-url-from-previous-command>
git push azure main
```

## Monitoring and Maintenance

### Using the Built-in Monitor

The server includes a monitoring tool that displays real-time statistics:

```bash
node bin/monitor.js [host] [port]
```

### Setting Up External Monitoring

#### Using Prometheus and Grafana

1. Install Prometheus Node.js client:

```bash
npm install prom-client
```

2. The server already exposes metrics at the `/metrics` endpoint

3. Configure Prometheus to scrape this endpoint

4. Set up Grafana dashboards to visualize the metrics

#### Health Checks

The server provides a health check endpoint at `/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2025-04-02T20:05:45.702Z",
  "service": "sequential-thinking-mcp",
  "version": "1.0.0"
}
```

You can use this endpoint with external monitoring tools like Pingdom, UptimeRobot, or AWS CloudWatch.

## Security Considerations

### Network Security

1. Run the server behind a reverse proxy (Nginx, Apache, etc.)
2. Enable TLS/SSL for all connections
3. Implement proper firewall rules to restrict access

### Example Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name mcp.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Authentication

For production environments, you should implement authentication. Here's a simple token-based approach:

1. Set an environment variable with your token:

```bash
export MCP_AUTH_TOKEN="your-secret-token"
```

2. Configure clients to include this token in an Authorization header:

```
Authorization: Bearer your-secret-token
```

### Rate Limiting

To prevent abuse, implement rate limiting using a reverse proxy or load balancer:

```nginx
# Example Nginx rate limiting configuration
limit_req_zone $binary_remote_addr zone=mcp_limit:10m rate=10r/s;

server {
    # Other configuration...

    location / {
        limit_req zone=mcp_limit burst=20 nodelay;
        proxy_pass http://localhost:3000;
        # Other proxy settings...
    }
}
```

## Troubleshooting

If you encounter issues during deployment, please refer to the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file for common problems and solutions.
