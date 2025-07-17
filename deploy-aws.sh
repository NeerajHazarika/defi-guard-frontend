#!/bin/bash

# DeFi Guard AWS EC2 Deployment Script
# This script helps deploy the DeFi Guard frontend and backend services on AWS EC2

set -e

echo "🚀 DeFi Guard AWS EC2 Deployment Script"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running on AWS EC2
check_ec2() {
    if curl -s --max-time 5 http://169.254.169.254/latest/meta-data/instance-id > /dev/null 2>&1; then
        print_status "Running on AWS EC2 instance"
        return 0
    else
        print_warning "Not running on AWS EC2 (or metadata service not accessible)"
        return 1
    fi
}

# Get EC2 public IP
get_public_ip() {
    local public_ip=""
    
    if check_ec2; then
        # Try to get public IP from AWS metadata service
        public_ip=$(curl -s --max-time 5 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "")
    fi
    
    # Fallback to external IP detection
    if [ -z "$public_ip" ]; then
        public_ip=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || echo "")
    fi
    
    if [ -z "$public_ip" ]; then
        public_ip=$(curl -s --max-time 5 ipinfo.io/ip 2>/dev/null || echo "")
    fi
    
    echo "$public_ip"
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Docker service is running
    if ! docker info &> /dev/null; then
        print_error "Docker service is not running. Please start Docker first."
        exit 1
    fi
    
    print_status "All prerequisites satisfied"
}

# Setup environment file
setup_environment() {
    print_step "Setting up environment configuration..."
    
    local public_ip=$(get_public_ip)
    
    if [ -z "$public_ip" ]; then
        print_error "Could not determine public IP address"
        read -p "Please enter your EC2 public IP address or domain: " public_ip
    fi
    
    print_status "Using public IP/domain: $public_ip"
    
    # Create .env file from template
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_status "Created .env file from template"
        else
            print_error ".env.example file not found"
            exit 1
        fi
    fi
    
    # Update EXTERNAL_HOST in .env file
    sed -i.bak "s|EXTERNAL_HOST=http://localhost|EXTERNAL_HOST=http://$public_ip|g" .env
    print_status "Updated EXTERNAL_HOST to http://$public_ip"
    
    print_warning "Please review and update the .env file with your API keys if needed:"
    echo "  - OPENAI_API_KEY"
    echo "  - COINGECKO_API_KEY"
    echo "  - COINMARKETCAP_API_KEY"
    echo "  - Other API keys as needed"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to edit .env file first..."
}

# Configure AWS EC2 security group
configure_security_group() {
    print_step "Checking required ports..."
    
    print_status "Please ensure your EC2 Security Group allows inbound traffic on:"
    echo "  - Port 22 (SSH)"
    echo "  - Port 80 (HTTP) - for future nginx proxy"
    echo "  - Port 443 (HTTPS) - for future SSL"
    echo "  - Port 3002 (Frontend)"
    echo "  - Port 8000 (Threat Intel API)"
    echo "  - Port 8001 (Stablecoin Monitor API)"
    echo "  - Port 8080 (Stablecoin OSINT API)"
    echo "  - Port 3000 (Sanction Detector API)"
    echo "  - Port 3001 (Scam Detector API)"
    echo "  - Port 3003 (DeFi Risk Assessment API)"
    echo ""
    read -p "Have you configured the Security Group? (y/n): " configured
    
    if [[ $configured != "y" && $configured != "Y" ]]; then
        print_warning "Please configure your Security Group first"
        exit 1
    fi
}

# Deploy services
deploy_services() {
    print_step "Deploying DeFi Guard services..."
    
    # Stop any existing containers
    print_status "Stopping existing containers..."
    docker-compose down --remove-orphans || true
    
    # Clean up old images (optional)
    read -p "Remove old Docker images to free space? (y/n): " cleanup
    if [[ $cleanup == "y" || $cleanup == "Y" ]]; then
        docker system prune -f
        print_status "Cleaned up old Docker images"
    fi
    
    # Build and start services
    print_status "Building and starting services..."
    docker-compose up --build -d
    
    print_status "Services started successfully!"
}

# Check service health
check_services() {
    print_step "Checking service health..."
    
    local public_ip=$(grep "EXTERNAL_HOST" .env | cut -d'=' -f2 | sed 's|http://||')
    
    echo "Waiting for services to start..."
    sleep 30
    
    local services=(
        "Frontend:$public_ip:3002"
        "Threat Intel:$public_ip:8000"
        "Stablecoin Monitor:$public_ip:8001"
        "Stablecoin OSINT:$public_ip:8080"
        "Sanction Detector:$public_ip:3000"
        "Scam Detector:$public_ip:3001"
        "DeFi Risk Assessment:$public_ip:3003"
    )
    
    for service in "${services[@]}"; do
        local name=$(echo $service | cut -d':' -f1)
        local host=$(echo $service | cut -d':' -f2)
        local port=$(echo $service | cut -d':' -f3)
        
        printf "Checking %-20s " "$name:"
        if curl -s --max-time 10 "http://$host:$port/health" > /dev/null 2>&1 || \
           curl -s --max-time 10 "http://$host:$port/" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ OK${NC}"
        else
            echo -e "${RED}✗ Failed${NC}"
        fi
    done
}

# Display access information
show_access_info() {
    print_step "Deployment completed!"
    
    local public_ip=$(grep "EXTERNAL_HOST" .env | cut -d'=' -f2 | sed 's|http://||')
    
    echo ""
    echo "🎉 DeFi Guard is now deployed on AWS EC2!"
    echo ""
    echo "Access URLs:"
    echo "  Frontend:              http://$public_ip:3002"
    echo "  Threat Intel API:      http://$public_ip:8000"
    echo "  Stablecoin Monitor:    http://$public_ip:8001"
    echo "  Stablecoin OSINT:      http://$public_ip:8080"
    echo "  Sanction Detector:     http://$public_ip:3000"
    echo "  Scam Detector:         http://$public_ip:3001"
    echo "  DeFi Risk Assessment:  http://$public_ip:3003"
    echo ""
    echo "📊 Monitor logs with:"
    echo "  docker-compose logs -f"
    echo ""
    echo "🔄 Restart services with:"
    echo "  docker-compose restart"
    echo ""
    echo "🛑 Stop services with:"
    echo "  docker-compose down"
    echo ""
    print_warning "Note: For production use, consider setting up:"
    echo "  - SSL certificates (Let's Encrypt)"
    echo "  - Domain name"
    echo "  - Nginx reverse proxy"
    echo "  - Monitoring and logging"
    echo "  - Backup strategy"
}

# Main execution
main() {
    check_prerequisites
    configure_security_group
    setup_environment
    deploy_services
    check_services
    show_access_info
}

# Run main function
main "$@"
