# Architecture Overview

## System Architecture

DeFi Guard Frontend is a microservices-based security monitoring platform with four core services:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │ Sanction         │    │ Threat Intel    │
│   (React/TS)    │◄──►│ Detector         │    │ OSINT Service   │
│   Port: 3002    │    │ Port: 3000       │    │ Port: 8000      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │              ┌─────────▼──────────┐             │
         └──────────────►│  Stablecoin       │◄────────────┘
                        │  Monitor Service  │
                        │  Port: 8001       │
                        └───────────────────┘
```

## Service Responsibilities

### 🎨 Frontend Service (React/TypeScript)
- **Port:** 3002
- **Technology:** React 18, TypeScript, Material-UI
- **Purpose:** User interface for security monitoring
- **Key Features:**
  - Address screening interface
  - Transaction screening with multi-hop analysis
  - Bulk screening operations
  - Real-time threat intelligence dashboard
  - Stablecoin monitoring alerts

### 🛡️ Sanction Detector Service
- **Port:** 3000
- **Technology:** Node.js, TypeScript
- **Purpose:** Bitcoin address and transaction screening
- **Key Features:**
  - OFAC sanctions list checking
  - Multi-hop transaction analysis
  - Risk scoring algorithm
  - Bulk screening operations
  - Real-time blockchain data integration

### 🕵️ Threat Intelligence Service
- **Port:** 8000
- **Technology:** Python, FastAPI
- **Purpose:** OSINT threat monitoring and analysis
- **Key Features:**
  - Automated threat intelligence collection
  - DeFi exploit monitoring
  - Security news aggregation
  - Threat classification and scoring
  - Alert generation

### 💰 Stablecoin Monitor Service
- **Port:** 8001
- **Technology:** Python, FastAPI
- **Purpose:** Stablecoin depeg detection and monitoring
- **Key Features:**
  - Real-time price monitoring
  - Depeg alert system
  - Historical trend analysis
  - Market volatility tracking
  - Multi-stablecoin support

## Data Flow Architecture

### 1. Address Screening Flow
```
User Input → Frontend → Sanction Detector → Blockchain APIs → Risk Assessment → UI Display
```

### 2. Transaction Screening Flow
```
TX Hash → Frontend → Sanction Detector → Blockchain TX Data → Multi-hop Analysis → Risk Report
```

### 3. Threat Intelligence Flow
```
OSINT Sources → Threat Intel Service → Data Processing → Classification → Frontend Dashboard
```

### 4. Stablecoin Monitoring Flow
```
Price APIs → Stablecoin Monitor → Depeg Detection → Alert Generation → Frontend Notifications
```

## Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **UI Library:** Material-UI (MUI) v5
- **Build Tool:** Vite
- **Deployment:** Nginx in Docker container

### Backend Services
- **Sanction Detector:** Node.js with TypeScript, Express.js
- **Threat Intel:** Python 3.11, FastAPI, SQLite
- **Stablecoin Monitor:** Python 3.9, FastAPI, In-memory storage

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Networking:** Docker bridge network
- **Load Balancing:** Nginx (frontend)
- **Health Checks:** Built-in service health endpoints

## Communication Patterns

### REST API Communication
All services communicate via REST APIs with JSON payloads:

```typescript
// Example API call pattern
const response = await fetch(`${SERVICE_URL}/api/endpoint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

### Error Handling
Standardized error response format across all services:

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  correlationId: string;
}
```

### Health Check Pattern
All services implement health check endpoints:

```typescript
interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services?: Record<string, boolean>;
}
```

## Security Considerations

### API Security
- CORS configuration for cross-origin requests
- Input validation on all endpoints
- Rate limiting implementation
- Error message sanitization

### Data Privacy
- No persistent storage of user queries
- Anonymized logging
- No sensitive data in error messages
- Minimal data retention

### Network Security
- Internal Docker network isolation
- External access only through defined ports
- Health check endpoints rate limited
- Service-to-service communication encrypted

## Scalability Design

### Horizontal Scaling
- Stateless service design
- Docker container orchestration ready
- Load balancer compatible
- Database-per-service pattern

### Performance Optimization
- Efficient API response caching
- Minimal payload sizes
- Asynchronous operation handling
- Resource usage monitoring

## Deployment Architecture

### Development Environment
```bash
npm run dev  # Frontend development server
# Backend services run in Docker containers
```

### Production Environment
```bash
docker-compose up -d  # All services in containers
# Nginx serving static frontend files
# Health checks and auto-restart policies
```

## Monitoring & Observability

### Logging
- Structured logging with correlation IDs
- Service-specific log levels
- Error tracking and alerting
- Performance metrics collection

### Health Monitoring
- Service health check endpoints
- Dependency health validation
- Uptime tracking
- Resource usage monitoring

## Development Guidelines

### Code Organization
- Modular service architecture
- Shared TypeScript interfaces
- Consistent error handling patterns
- Comprehensive type safety

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end testing for critical flows
- Docker container testing

### CI/CD Considerations
- Multi-stage Docker builds
- Service dependency management
- Health check validation
- Rolling deployment support
