# Architecture Overview

## System Architecture

DeFi Guard Frontend is a microservices-based security monitoring platform with seven core services:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │ Sanction         │    │ Scam Detector   │
│   (React/TS)    │◄──►│ Detector         │    │ Service         │
│   Port: 3002    │    │ Port: 3000       │    │ Port: 3001      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │              ┌─────────▼──────────┐             │
         │              │ DeFi Risk          │             │
         │              │ Assessment         │             │
         │              │ Port: 3003         │             │
         │              └─────────┬──────────┘             │
         │                        │                        │
         │              ┌─────────▼──────────┐   ┌─────────▼─────────┐
         │              │  Threat Intel     │   │  Stablecoin       │
         │              │  Service          │   │  Monitor Service  │
         │              │  Port: 8000       │   │  Port: 8001       │
         │              └─────────┬─────────┘   └─────────┬─────────┘
         │                        │                       │
         │              ┌─────────▼─────────┐   ┌─────────▼─────────┐
         └──────────────►│ Stablecoin OSINT │   │   SQLite DB       │
                        │ Service           │   │   (Metrics)       │
                        │ Port: 8080        │   └───────────────────┘
                        └─────────┬─────────┘            
                                  │                       
                        ┌─────────▼─────────┐              
                        │  PostgreSQL DB    │              
                        │  (OSINT Data)     │              
                        └───────────────────┘              
```

## Service Responsibilities

### 🎨 Frontend Service (React/TypeScript)
- **Port:** 3002
- **Technology:** React 18, TypeScript, Material-UI, Nginx
- **Database:** None (stateless UI)
- **Purpose:** User interface for security monitoring
- **Key Features:**
  - Address screening interface
  - Transaction screening with multi-hop analysis
  - Bulk screening operations
  - Real-time threat intelligence dashboard
  - Stablecoin monitoring alerts
  - DeFi protocol risk assessment interface

### 🛡️ Sanction Detector Service
- **Port:** 3000
- **Technology:** Node.js, TypeScript, Express.js
- **Database:** In-memory caching + External APIs
- **Purpose:** Bitcoin address and transaction screening
- **Key Features:**
  - OFAC sanctions list checking
  - Multi-hop transaction analysis
  - Risk scoring algorithm
  - Bulk screening operations
  - Real-time blockchain data integration

### � Scam Detector Service
- **Port:** 3001
- **Technology:** Node.js, Express.js
- **Database:** In-memory storage
- **Purpose:** Multi-blockchain address risk assessment
- **Key Features:**
  - Scam address detection
  - Risk classification
  - Bulk address screening
  - Multi-blockchain support (BTC, ETH, BSC, Polygon, etc.)

### 📊 DeFi Risk Assessment Service
- **Port:** 3003
- **Technology:** Node.js, TypeScript
- **Database:** In-memory storage
- **Purpose:** DeFi protocol security analysis
- **Key Features:**
  - Smart contract risk assessment
  - Protocol security scoring
  - Vulnerability detection
  - Governance analysis

### �🕵️ Threat Intelligence Service
- **Port:** 8000
- **Technology:** Python 3.11, FastAPI
- **Database:** SQLite (threat_intelligence.db)
- **Purpose:** OSINT threat monitoring and analysis
- **Key Features:**
  - Automated threat intelligence collection
  - DeFi exploit monitoring
  - Security news aggregation
  - Threat classification and scoring
  - Alert generation

### 💰 Stablecoin Monitor Service
- **Port:** 8001
- **Technology:** Python 3.9, FastAPI
- **Database:** SQLite (stablecoin_metrics.db)
- **Purpose:** Stablecoin depeg detection and monitoring
- **Key Features:**
  - Real-time price monitoring
  - Depeg alert system
  - Historical trend analysis
  - Market volatility tracking
  - Multi-stablecoin support

### 🔍 Stablecoin OSINT Service
- **Port:** 8080
- **Technology:** Python 3.11, FastAPI
- **Database:** PostgreSQL + Redis
- **Purpose:** Stablecoin regulatory intelligence and geographic monitoring
- **Key Features:**
  - Country-specific stablecoin acceptance tracking
  - Regulatory status monitoring by region
  - News aggregation and sentiment analysis
  - Geographic compliance mapping
  - Exchange acceptance data
  - Real-time regulatory updates

## Database Architecture

### SQLite-Based Distributed Storage
Each service maintains its own SQLite database for optimal isolation and performance:

```
┌─────────────────────┐    ┌─────────────────────┐
│ Threat Intel        │    │ Stablecoin Monitor  │
│ Service             │    │ Service             │
│                     │    │                     │
│ ┌─────────────────┐ │    │ ┌─────────────────┐ │
│ │   SQLite DB     │ │    │ │   SQLite DB     │ │
│ │ threat_intel.db │ │    │ │ metrics.db      │ │
│ │                 │ │    │ │                 │ │
│ │ • Threats       │ │    │ │ • Price Data    │ │
│ │ • Indicators    │ │    │ │ • Alerts        │ │
│ │ • Classifications│ │    │ │ • Metrics       │ │
│ └─────────────────┘ │    │ └─────────────────┘ │
└─────────────────────┘    └─────────────────────┘

┌─────────────────────┐    ┌─────────────────────┐
│ Frontend Service    │    │ Other Services      │
│ (Stateless)         │    │ (In-Memory/APIs)    │
│                     │    │                     │
│ • No Database       │    │ • Sanction Detector │
│ • Session Storage   │    │ • Scam Detector     │
│ • Local Storage     │    │ • Risk Assessment   │
└─────────────────────┘    └─────────────────────┘
```

### Benefits of SQLite Architecture
1. **Service Isolation**: Each service owns its data completely
2. **Zero Configuration**: No external database setup required
3. **Development Friendly**: Easy to backup, restore, and debug
4. **Production Ready**: SQLite handles the current data volumes efficiently
5. **Docker Compatible**: Databases persist via volume mounts

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
- **Scam Detector:** Node.js with Express.js
- **DeFi Risk Assessment:** Node.js with TypeScript
- **Threat Intel:** Python 3.11, FastAPI, SQLite
- **Stablecoin Monitor:** Python 3.9, FastAPI, SQLite

### Data Storage
- **Threat Intelligence:** SQLite database for OSINT data persistence
- **Stablecoin Monitor:** SQLite database for metrics and alerts
- **Other Services:** In-memory storage with external API integration
- **Frontend:** Stateless with browser local/session storage

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
