# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2025-07-12

### Fixed
- **Header Component Build Error**: Fixed TypeScript compilation error by removing unused props interface from Header component
  - Simplified Header component to remove notification and settings functionality
  - Updated App.tsx to call Header without props
  - Successfully resolved Docker build failures
- **Port Configuration**: Updated frontend to run on port 3002 instead of 3000 to avoid conflicts

### Changed
- **Header Component**: Streamlined to focus on core branding and navigation with DeFi Guard branding
- **Component Architecture**: Removed prop dependencies between App and Header components
- **Documentation**: Moved CHANGELOG.md to docs/ folder for better organization

### Technical
- All Docker containers now build and run successfully
- TypeScript compilation passes without errors
- Frontend accessible on port 3002

## [1.0.2] - 2025-07-01

### Fixed
- **Health Check Failures**: Updated health check endpoints from `/health` to `/` for all backend services
- **Docker Compose Configuration**: Complete rewrite of docker-compose.yml with proper service definitions
- **Service Dependencies**: Added proper container dependencies and networking
- **Database Architecture**: Migrated from PostgreSQL/Redis to SQLite-based architecture

### Changed
- **Architecture**: Each service now uses its own SQLite database for better isolation
- **Health Monitoring**: Simplified health check endpoints across all services
- **Management Script**: Updated defi-guard-manager.sh with correct endpoints and removed database startup logic

### Removed
- **PostgreSQL**: Removed shared PostgreSQL database dependency
- **Redis**: Removed Redis cache dependency
- **Database Services**: Eliminated external database containers from docker-compose

### Added
- **SQLite Persistence**: Added volume mounts for SQLite database persistence
- **Environment Configuration**: Enhanced .env template with all required API keys
- **Service Documentation**: Updated API documentation to reflect current architecture

## [1.0.1] - 2025-07-01

### Fixed
- **Empty Docker Compose**: Created complete docker-compose.yml configuration
- **Incorrect Documentation**: Updated architecture diagrams to match SQLite implementation
- **Missing Environment Variables**: Added comprehensive .env.example

### Changed
- **Service Ports**: Clarified port assignments for all services
  - Frontend: 3002
  - Sanction Detector: 3000
  - Scam Detector: 3001
  - DeFi Risk Assessment: 3003
  - Threat Intelligence: 8000
  - Stablecoin Monitor: 8001

### Documentation
- **Architecture Diagram**: Updated to show correct SQLite-based services
- **Screening Capabilities**: Clarified Bitcoin-only vs multi-blockchain support
- **API References**: Updated all endpoint documentation
- **Troubleshooting**: Removed database-related troubleshooting sections

## [1.0.0] - 2025-07-12

### Added
- Initial release of DeFi Guard Frontend
- Complete React TypeScript dashboard for DeFi security monitoring
- Material-UI based responsive design
- Docker deployment with full orchestration
- Multi-service architecture with health checks

### Features
- **Dashboard Overview**: Centralized metrics and real-time monitoring
- **Threat Intelligence**: Live OSINT feeds from security sources
- **Address Screening**: Multi-blockchain address compliance checking
- **Transaction Screening**: Bitcoin transaction analysis with multi-hop tracking
- **DeFi Risk Assessment**: Protocol security analysis and scoring
- **Stablecoin Monitoring**: Price deviation and depeg alerts
- **OFAC Compliance**: Sanctions screening and monitoring
- **Fraud Intelligence**: Scam detection and risk profiling
- **Mixer Detection**: Privacy coin and tumbler identification

### Technical Stack
- React 18 with TypeScript 5.x
- Vite build system with HMR
- Material-UI (MUI) v5 for components
- Recharts for data visualization
- React Router DOM v6 for navigation
- Docker containerization
- Nginx reverse proxy

### Architecture
- Frontend: React application (Port 3002)
- Backend Services:
  - Sanction Detector (Port 3000)
  - Scam Detector (Port 3001)
  - DeFi Risk Assessment (Port 3003)
  - Threat Intelligence (Port 8000)
  - Stablecoin Monitor (Port 8001)
- SQLite databases for each service
- Health monitoring and automatic restarts
