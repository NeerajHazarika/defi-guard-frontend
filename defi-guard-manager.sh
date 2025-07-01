#!/bin/bash

# DeFi Guard Quick Start Script
# This script helps you quickly start and manage your DeFi Guard services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    DeFi Guard Manager                        ║"
    echo "║                                                              ║"
    echo "║  Complete microservices stack for DeFi security monitoring  ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are available"
}

start_services() {
    print_status "Starting DeFi Guard services..."
    
    # Start all services
    echo "Starting all DeFi Guard services..."
    docker-compose up -d
    
    print_status "All services started!"
}

check_health() {
    echo "Checking service health..."
    
    # Wait a moment for services to initialize
    sleep 5
    
    # Check frontend (nginx serves static files, no /health endpoint)
    if curl -f -s "http://localhost:3002/" > /dev/null 2>&1; then
        print_status "defi-guard-frontend is healthy (port 3002)"
    else
        print_warning "defi-guard-frontend health check failed (port 3002)"
    fi
    
    # Check sanction detector service
    if curl -f -s "http://localhost:3000/" > /dev/null 2>&1; then
        print_status "sanction-detector is healthy (port 3000)"
    else
        print_warning "sanction-detector health check failed (port 3000)"
    fi
    
    # Check threat intel service (FastAPI root endpoint)
    if curl -f -s "http://localhost:8000/" > /dev/null 2>&1; then
        print_status "defi-guard-threat-intel is healthy (port 8000)"
    else
        print_warning "defi-guard-threat-intel health check failed (port 8000)"
    fi
    
    # Check stablecoin monitor (FastAPI root endpoint)
    if curl -f -s "http://localhost:8001/" > /dev/null 2>&1; then
        print_status "defi-guard-stablecoin-monitor is healthy (port 8001)"
    else
        print_warning "defi-guard-stablecoin-monitor health check failed (port 8001)"
    fi
}

show_status() {
    echo "Service Status:"
    docker-compose ps
    
    echo ""
    echo "Access URLs:"
    echo "  Frontend:              http://localhost:3002"
    echo "  Sanction Detector:     http://localhost:3000"
    echo "  Threat Intel API:      http://localhost:8000"
    echo "  Stablecoin Monitor:    http://localhost:8001"
}

show_logs() {
    echo "Recent logs from all services:"
    docker-compose logs --tail=20
}

stop_services() {
    print_warning "Stopping all DeFi Guard services..."
    docker-compose down
    print_status "All services stopped"
}

cleanup() {
    print_warning "Stopping services and removing volumes (this will delete all data)..."
    docker-compose down -v
    print_status "Cleanup complete"
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1) Start all services"
    echo "2) Check service health"
    echo "3) Show service status"
    echo "4) Show recent logs"
    echo "5) Stop all services"
    echo "6) Cleanup (stop + remove data)"
    echo "7) Exit"
    echo ""
    read -p "Please select an option (1-7): " choice
}

# Main script
main() {
    print_header
    check_docker
    
    while true; do
        show_menu
        
        case $choice in
            1)
                start_services
                check_health
                show_status
                ;;
            2)
                check_health
                ;;
            3)
                show_status
                ;;
            4)
                show_logs
                ;;
            5)
                stop_services
                ;;
            6)
                cleanup
                ;;
            7)
                echo "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please select 1-7."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Handle Ctrl+C
trap 'echo -e "\n${YELLOW}Operation cancelled.${NC}"; exit 1' INT

# Run main function
main
