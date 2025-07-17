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

## [1.1.0] - 2025-07-17

### Added
- **AWS EC2 Deployment Support**: Complete AWS deployment configuration and automation
  - Added `deploy-aws.sh` automated deployment script with public IP detection
  - Created comprehensive AWS deployment guide (`AWS_DEPLOYMENT.md`)
  - Added `EXTERNAL_HOST` environment variable for dynamic API URL configuration
  - Implemented CORS configuration for backend services
- **Pagination System**: Comprehensive pagination for Threat Intelligence page
  - Configurable items per page (5, 10, 25, 50, 100)
  - Smooth scrolling navigation between pages
  - Page indicators and item count display
  - Integration with existing sorting functionality
- **New Components**: Enhanced UI components and mapping features
  - `InteractiveWorldMap.tsx`: Interactive global threat visualization
  - `WorldMap.tsx`: SVG-based world map component
  - Enhanced Material-UI pagination with first/last buttons
- **Stablecoin OSINT Integration**: Advanced stablecoin monitoring service
  - `useStablecoinOsint.ts`: React hook for stablecoin OSINT data
  - `stablecoinOsint.ts`: Service layer for advanced stablecoin analysis
  - Enhanced error handling and loading states

### Fixed
- **Frontend-Backend Communication**: Resolved AWS EC2 deployment connectivity issues
  - Fixed localhost URL hardcoding preventing external access
  - Implemented build-time API URL configuration
  - Added proper Docker networking for cloud deployment
- **Docker Configuration**: Enhanced container reliability and deployment
  - Added restart policies (`unless-stopped`) for all services
  - Fixed health check endpoints with proper error handling
  - Improved build process with debug output and validation

### Changed
- **Default Route**: Set Threat Intelligence as the default application route (removed Dashboard)
  - Removed Dashboard page and menu navigation
  - Updated routing configuration in `App.tsx`
  - Simplified navigation structure in `Sidebar.tsx`
- **Environment Configuration**: Enhanced deployment flexibility
  - Updated `.env.example` with AWS deployment variables
  - Added blockchain RPC URL configurations
  - Included comprehensive API key documentation
- **UI/UX Improvements**: Enhanced user experience across components
  - Improved loading states with individual component loading
  - Enhanced error boundaries and fallback states
  - Better responsive design for different screen sizes

### Removed
- **Dashboard Page**: Removed redundant dashboard implementation
  - Eliminated `Dashboard.tsx` and related dependencies
  - Cleaned up routing and navigation references
  - Streamlined application structure

### Technical
- **Docker Compose**: Major improvements for cloud deployment
  - Dynamic API URL configuration using environment variables
  - Enhanced service networking and communication
  - Proper build arguments for frontend API configuration
- **Build System**: Enhanced Vite build configuration
  - Improved environment variable handling
  - Better debug output during build process
  - Optimized production build for AWS deployment

### Security
- **CORS Configuration**: Proper cross-origin resource sharing setup
  - Added CORS headers to all backend services
  - Configured allowed origins for frontend access
  - Implemented preflight request handling

### Documentation
- **AWS Deployment**: Comprehensive deployment documentation
  - Step-by-step AWS EC2 setup instructions
  - Security group configuration guide
  - Troubleshooting and maintenance procedures
  - Production deployment best practices
