# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed
- **Backend Service Status Components**: Cleaned up frontend UI by removing technical service health indicators
  - Removed service health status Alert components from DeFi Risk Assessment and Threat Intelligence pages
  - Cleaned up unused state variables and API calls related to service health monitoring
  - Streamlined user interface to focus on core functionality rather than technical service status
- **Development and Test Files**: Removed redundant files to clean up repository
  - Removed `DeFiRiskAssessment.test.tsx` - redundant test file
  - Removed `mock-risk-assessment.js` - development mock API server
  - Removed `cors-test.html` - CORS testing utility
  - Removed `nginx-cors.conf` and `nginx-server.conf` - redundant nginx configurations
  - Removed `test-data.json` - test data file
- **Unused Page Components**: Cleaned up redundant page components
  - Removed `DashboardTest.tsx` - unused dashboard test component
  - Removed `DeFiRiskAssessmentNew.tsx` - redundant risk assessment component
  - Removed `GlobalStablecoinMapSVG.tsx` - unused SVG map component  
  - Removed `StablecoinMonitoring_new.tsx` - redundant stablecoin monitoring component

### Enhanced
- **Type Definitions**: Updated TypeScript interfaces for enhanced DeFi protocol analysis
  - Added comprehensive `VulnerabilityDetection` interface for security analysis results
  - Added `SecurityAnalysisResult` interface with metadata tracking
  - Added `ProtocolAssessmentStatus` interface for real-time assessment progress
  - Added `EnhancedRiskLevel` interface with multi-dimensional scoring
- **Documentation**: Updated comprehensive service architecture documentation
  - Enhanced `SERVICE_REPORTS.md` with detailed technical analysis
  - Updated `parsh.md` with complete academic research documentation
  - Added performance metrics and security analysis sections

### Technical
- **Code Quality**: Improved codebase organization and maintainability
  - Removed unused imports and dependencies from frontend components
  - Cleaned up redundant configuration files and development utilities
  - Streamlined API integration layer for better performance
- **UI/UX**: Enhanced user experience by removing technical noise
  - Simplified interface by removing backend service health status displays
  - Focused UI on core security functionality and risk assessment features

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
