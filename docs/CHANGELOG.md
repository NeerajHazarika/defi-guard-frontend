# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **DeFi Risk Assessment Service**: Resolved connection issues and proxy configuration
  - Fixed "connection refused" errors by consolidating nginx proxy configuration
  - Updated Docker environment variables to use proxy paths instead of direct service access
  - Removed duplicate nginx proxy services that were causing port conflicts
  - DeFi Risk Assessment now properly accessible through /defi-api/ proxy path
- **Service Integration**: Improved backend service communication
  - All services now route through single nginx proxy with proper CORS headers
  - Eliminated configuration conflicts between separate proxy services
  - Verified health check endpoints working correctly through proxy

### Changed
- **Docker Configuration**: Consolidated proxy architecture
  - Single nginx.conf handles routing for all backend services
  - Updated VITE_DEFI_RISK_ASSESSMENT_API_URL to use localhost:3002/defi-api
  - Removed separate defi-risk-assessment-proxy service
  - Maintained backward compatibility with existing service endpoints

## [1.3.0] - 2025-01-19

### Changed
- **Sanction Detector Service**: Replaced mock implementation with real OFAC sanctions data integration
  - Integrated actual GitHub repository (Parsh/sanction-detector) for Bitcoin address screening
  - Replaced hardcoded mock responses with real-time OFAC cryptocurrency sanctions database
  - Added proper TypeScript-based service with comprehensive logging and error handling
  - Service now correctly identifies sanctioned Bitcoin addresses with detailed entity information
  - Enhanced API responses with confidence scores, risk levels, and sanction match details

### Fixed
- **API Response Format Issues**: Resolved frontend display problems with transaction screening
  - Fixed bulk screening showing 0 counts despite API returning correct high-risk data
  - Updated `bulkScreening()` transformation to use new response format with `riskLevel` instead of `sanctioned` boolean
  - Fixed transaction screening to properly handle nested data structure from real API
  - Corrected address screening to parse new response format with sanction match details
  - All screening features now correctly display risk levels and sanction information
- **CORS Configuration**: Fixed cross-origin request issues
  - Added nginx proxy configuration with proper CORS headers for sanction detection service
  - Fixed Docker compose nginx configuration file mounting issue
  - Configured /sanction-api/ proxy path for containerized access to real sanction detector
- **Docker Configuration**: Resolved container startup and proxy issues
  - Fixed nginx configuration file mounting error in docker-compose.yml
  - Updated environment variables to use nginx proxy instead of direct service access
  - Ensured all containers start successfully with proper health checks

### Removed
- **Test and Mock Files**: Cleaned up development artifacts and test files
  - Removed `DeFiRiskAssessment.test.tsx` - test file for DeFi risk assessment component
  - Removed `testConnection.ts` - utility for testing API connections
  - Removed `mock-risk-assessment.js` - mock API server for development
  - Removed `cors-test.html` - CORS testing utility
  - Removed `test-data.json` - sample test data file
- **Multinode Configuration**: Removed multinode deployment files
  - Removed `docker-compose.multinode.yml` - multinode Docker configuration
  - Removed `nginx.multinode.conf` - multinode nginx configuration
- **Documentation Cleanup**: Removed outdated and redundant documentation
  - Removed `parsh.md` - outdated research documentation
  - Removed `SERVICE_REPORTS.md` - redundant service reports documentation

### Enhanced
- **Sanction Detection Accuracy**: Significantly improved Bitcoin address risk assessment
  - Real OFAC sanctions data now provides accurate HIGH/LOW risk classifications
  - Detailed sanction match information including entity names, IDs, and violation types
  - Support for multiple cryptocurrency types (Bitcoin, Ethereum, Litecoin, etc.)
  - Enhanced confidence scoring and processing time metrics
- **DeFi Risk Assessment Integration**: Fixed connection and proxy configuration issues
  - Consolidated nginx proxy configuration to handle both sanction detector and DeFi risk assessment
  - Updated environment variables to use unified proxy paths (/sanction-api/ and /defi-api/)
  - Resolved connection refused errors by eliminating duplicate nginx proxy services
  - Fixed Docker compose configuration to route DeFi risk assessment through main nginx proxy
- **System Architecture**: Improved containerized service communication
  - Single nginx proxy now handles CORS and routing for all backend services
  - Eliminated port conflicts between separate proxy services
  - Streamlined Docker configuration for better maintainability
  - All services now accessible through standardized proxy paths
- **Service Architecture**: Improved microservices integration
  - Real sanction detector service with proper health checks and monitoring
  - Standardized API response format across all security services
  - Better error handling and correlation tracking for debugging

### Technical
- **Code Quality**: Repository cleanup and organization improvements
  - Removed development test files and mock implementations
  - Streamlined Docker configuration by removing unused multinode setup
  - Cleaned up documentation structure for better maintainability
- **Security**: Enhanced sanctions screening capabilities
  - Real-time access to updated OFAC cryptocurrency sanctions list
  - Proper entity matching with detailed violation information
  - Improved risk scoring algorithms based on actual regulatory data

## [1.2.0] - 2025-01-XX

### Added
- **Risk Assessment API v1.1 Integration**: Complete frontend integration with enhanced DeFi Risk Assessment API
  - **Enhanced Vulnerability Detection**: Support for 28+ Slither vulnerability detectors
  - **Multi-Analysis Types**: Static analysis (Slither), dynamic analysis, governance analysis, liquidity analysis
  - **Real-time Progress Tracking**: Live progress updates during security analysis
  - **Comprehensive Findings**: Detailed vulnerability reports with code locations and recommendations
  - **Service Health Monitoring**: Real-time health status for Risk Assessment service and Slither integration
  - **Performance Metrics**: Analysis time tracking and service statistics
- **Multinode Docker Deployment**: New docker-compose.multinode.yml for distributed EC2 deployment
  - **Service Isolation**: Each service can be deployed to separate EC2 instances
  - **Load Balancing**: Nginx configuration for API gateway and load balancing
  - **Scalability**: Support for multiple frontend instances and service redundancy
- **Enhanced UI Components**: Improved Risk Assessment interface with modern design
  - **Progress Indicators**: Linear progress bars for running assessments
  - **Service Status**: Real-time service health alerts
  - **Analysis Configuration**: Granular control over analysis types and detectors
  - **Enhanced Metrics**: Additional KPI cards for critical findings and active assessments

### Changed
- **API Service Layer**: Updated to use new Risk Assessment API v1.1 endpoints
  - **Port Configuration**: Updated Risk Assessment API from port 3003 to 3000
  - **Enhanced Interfaces**: Updated TypeScript interfaces for v1.1 API capabilities
  - **Error Handling**: Improved error handling and user feedback
- **Risk Assessment UI**: Complete redesign of DeFi Risk Assessment page
  - **Modern Layout**: Updated grid layout with 6 KPI cards instead of 4
  - **Analysis Types**: Interactive selection of analysis types with descriptions
  - **Enhanced Forms**: Updated protocol and assessment creation forms
- **Type Definitions**: Added comprehensive TypeScript types for new API features
  - **Vulnerability Detection**: VulnerabilityFinding, SlitherVulnerabilityType interfaces
  - **Analysis Progress**: AnalysisProgress interface for real-time updates
  - **Enhanced Results**: Updated Assessment interface with metadata and enhanced findings

### Technical
- **API Integration**: Complete frontend alignment with Risk Assessment API v1.1
- **Performance**: Support for 30-90 second analysis times with progress tracking
- **Security**: Enhanced vulnerability detection with HIGH/MEDIUM/LOW/INFO severity levels
- **Architecture**: Support for both single-node and multi-node deployment strategies
- **Monitoring**: Real-time service health and performance monitoring

## [1.1.0] - 2025-01-XX

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
