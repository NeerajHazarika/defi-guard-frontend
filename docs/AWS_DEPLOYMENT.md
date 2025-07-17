# AWS EC2 Deployment Guide

This guide will help you deploy the DeFi Guard application on AWS EC2 using Docker Compose.

## Prerequisites

1. **AWS EC2 Instance**
   - Minimum recommended: t3.medium (2 vCPU, 4 GB RAM)
   - For production: t3.large or larger (4 vCPU, 8 GB RAM)
   - Storage: At least 20 GB SSD
   - Operating System: Amazon Linux 2, Ubuntu 20.04+, or similar

2. **Security Group Configuration**
   - Ensure your EC2 Security Group allows inbound traffic on these ports:
     - Port 22 (SSH)
     - Port 3002 (Frontend)
     - Port 8000 (Threat Intel API)
     - Port 8001 (Stablecoin Monitor API)
     - Port 8080 (Stablecoin OSINT API)
     - Port 3000 (Sanction Detector API)
     - Port 3001 (Scam Detector API)
     - Port 3003 (DeFi Risk Assessment API)

## Quick Deployment

### Step 1: Connect to your EC2 instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

### Step 2: Install Docker and Docker Compose

For Amazon Linux 2:
```bash
sudo yum update -y
sudo yum install -y docker git
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

For Ubuntu:
```bash
sudo apt update
sudo apt install -y docker.io docker-compose git
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

**Important**: Log out and log back in for the Docker group changes to take effect.

### Step 3: Clone the repository

```bash
git clone https://github.com/NeerajHazarika/defi-guard-frontend.git
cd defi-guard-frontend
```

### Step 4: Run the deployment script

```bash
./deploy-aws.sh
```

The script will:
- Detect your public IP automatically
- Configure environment variables
- Deploy all services using Docker Compose
- Check service health
- Display access URLs

## Manual Deployment

If you prefer to deploy manually:

### Step 1: Set up environment variables

```bash
cp .env.example .env
```

Edit the `.env` file and replace `localhost` with your EC2 public IP:

```bash
# Replace <YOUR_EC2_PUBLIC_IP> with your actual public IP
EXTERNAL_HOST=http://<YOUR_EC2_PUBLIC_IP>

# Add your API keys (optional but recommended)
OPENAI_API_KEY=your_openai_api_key_here
COINGECKO_API_KEY=your_coingecko_api_key_here
# ... other API keys
```

### Step 2: Deploy services

```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Access Your Application

After deployment, you can access:

- **Frontend**: `http://your-ec2-public-ip:3002`
- **Threat Intel API**: `http://your-ec2-public-ip:8000`
- **Stablecoin Monitor**: `http://your-ec2-public-ip:8001`
- **Stablecoin OSINT**: `http://your-ec2-public-ip:8080`
- **Sanction Detector**: `http://your-ec2-public-ip:3000`
- **Scam Detector**: `http://your-ec2-public-ip:3001`
- **DeFi Risk Assessment**: `http://your-ec2-public-ip:3003`

## Troubleshooting

### Frontend can't connect to backend services

This was the main issue you experienced. The solution implemented:

1. **Environment Variables**: The Docker Compose file now uses `EXTERNAL_HOST` variable to set the correct API URLs
2. **Build-time Configuration**: Backend URLs are baked into the frontend build using build arguments
3. **Public IP Detection**: The deployment script automatically detects your EC2 public IP

### Common Issues and Solutions

1. **Services not starting**
   ```bash
   # Check logs
   docker-compose logs service-name
   
   # Restart a specific service
   docker-compose restart service-name
   ```

2. **Port conflicts**
   ```bash
   # Check what's using ports
   sudo netstat -tulpn | grep :3002
   
   # Stop conflicting services
   sudo systemctl stop service-name
   ```

3. **Memory issues**
   ```bash
   # Check memory usage
   free -h
   
   # Check Docker container resource usage
   docker stats
   ```

4. **Disk space issues**
   ```bash
   # Clean up Docker
   docker system prune -f
   
   # Remove unused images
   docker image prune -a
   ```

### Service Health Checks

Check individual service health:

```bash
# Frontend
curl http://your-ec2-ip:3002/health

# Threat Intel API
curl http://your-ec2-ip:8000/health

# Other services
curl http://your-ec2-ip:8001/health
curl http://your-ec2-ip:8080/health
curl http://your-ec2-ip:3000/health
curl http://your-ec2-ip:3001/health
curl http://your-ec2-ip:3003/health
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f defi-guard-frontend

# Last 100 lines
docker-compose logs --tail=100 service-name
```

## Production Considerations

For production deployment, consider:

1. **SSL/HTTPS Setup**
   - Use Let's Encrypt for free SSL certificates
   - Set up nginx as a reverse proxy
   - Update security groups to use ports 80/443

2. **Domain Name**
   - Register a domain name
   - Point it to your EC2 elastic IP
   - Update `EXTERNAL_HOST` to use your domain

3. **Monitoring**
   - Set up CloudWatch monitoring
   - Configure log aggregation
   - Set up health check alarms

4. **Backup Strategy**
   - Regular database backups
   - Application data backups
   - Infrastructure as code (CloudFormation/Terraform)

5. **Security**
   - Regularly update packages
   - Use AWS secrets manager for API keys
   - Enable CloudTrail logging
   - Implement rate limiting

6. **Scaling**
   - Use Application Load Balancer
   - Consider ECS or EKS for container orchestration
   - Set up auto-scaling groups

## API Keys Configuration

The application supports various API keys for enhanced functionality:

- **OPENAI_API_KEY**: For AI-powered threat analysis
- **COINGECKO_API_KEY**: For cryptocurrency data
- **COINMARKETCAP_API_KEY**: Alternative crypto data source
- **ETHERSCAN_API_KEY**: For Ethereum blockchain data
- **BSCSCAN_API_KEY**: For BSC blockchain data
- **POLYGONSCAN_API_KEY**: For Polygon blockchain data

Add these to your `.env` file for full functionality.

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify security group settings
3. Ensure all ports are accessible
4. Check EC2 instance resources (CPU, memory, disk)
5. Verify environment variables are set correctly

## Updates and Maintenance

To update the application:

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

For regular maintenance:

```bash
# Clean up old containers and images
docker system prune -f

# Update system packages
sudo yum update -y  # Amazon Linux
# or
sudo apt update && sudo apt upgrade -y  # Ubuntu
```
