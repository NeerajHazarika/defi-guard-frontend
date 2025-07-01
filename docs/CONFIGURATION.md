# Configuration Guide

## Overview

Complete configuration reference for environment variables, service settings, and deployment configurations.

## 🌍 Environment Variables

### Frontend Environment Variables

#### Required Variables
```bash
# Backend Service URLs
VITE_THREAT_INTEL_API_URL=http://localhost:8000
VITE_STABLECOIN_MONITOR_API_URL=http://localhost:8001
VITE_SANCTION_DETECTOR_API_URL=http://localhost:3000
```

#### Optional Variables
```bash
# Legacy API support
VITE_API_URL=http://localhost:3001

# Application metadata
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
VITE_APP_NAME="DeFi Guard"

# Feature flags
VITE_ENABLE_EXPERIMENTAL_FEATURES=false
VITE_ENABLE_DEBUG_MODE=false

# API configuration
VITE_API_TIMEOUT=30000
VITE_MAX_BULK_ADDRESSES=100
VITE_MAX_BULK_TRANSACTIONS=50
```

### Docker Environment Configuration

#### docker-compose.yml Environment
```yaml
services:
  defi-guard-frontend:
    environment:
      # Production URLs (update for your deployment)
      - REACT_APP_THREAT_INTEL_API_URL=http://localhost:8000
      - REACT_APP_STABLECOIN_MONITOR_API_URL=http://localhost:8001
      - REACT_APP_SANCTION_DETECTOR_API_URL=http://localhost:3000
      
      # Application settings
      - REACT_APP_VERSION=1.0.0
      - REACT_APP_ENVIRONMENT=production
```

#### Backend Services Environment
```yaml
# Threat Intelligence Service
defi-guard-threat-intel:
  environment:
    - DATABASE_URL=sqlite:////app/data/threat_intel.db
    - OPENAI_API_KEY=${OPENAI_API_KEY:-}
    - DEBUG=false
    - SCRAPER_DELAY=2
    - MAX_CONCURRENT_REQUESTS=5

# Stablecoin Monitor Service  
defi-guard-stablecoin-monitor:
  environment:
    - DATABASE_PATH=/app/data/stablecoin_monitor.db
    - UPDATE_INTERVAL=60
    - ALERT_THRESHOLDS='{"depeg": 0.005, "warning": 0.002}'

# Sanction Detector Service
sanction-detector:
  environment:
    - NODE_ENV=production
    - SANCTIONS_UPDATE_INTERVAL=24h
    - BLOCKCHAIN_API_TIMEOUT=30s
    - MAX_BULK_ADDRESSES=100
    - MAX_BULK_TRANSACTIONS=50
```

## 🔧 Service Configuration Files

### Frontend Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        }
      }
    }
  },
  define: {
    // Expose environment variables to the app
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  // API proxy for development
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/services/*": ["src/services/*"],
      "@/types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### ESLint Configuration (eslint.config.js)

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)
```

## 🐳 Docker Configuration

### Dockerfile

```dockerfile
# Multi-stage build for production
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration (nginx.conf)

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name localhost;
        
        root /usr/share/nginx/html;
        index index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # API proxy (optional, if backend services on same server)
        location /api/ {
            proxy_pass http://sanction-detector:3000/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Static assets with cache headers
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  defi-guard-frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3002:80"
    depends_on:
      defi-guard-threat-intel:
        condition: service_healthy
      defi-guard-stablecoin-monitor:
        condition: service_healthy
      sanction-detector:
        condition: service_healthy
    environment:
      - REACT_APP_THREAT_INTEL_API_URL=http://localhost:8000
      - REACT_APP_STABLECOIN_MONITOR_API_URL=http://localhost:8001
      - REACT_APP_SANCTION_DETECTOR_API_URL=http://localhost:3000
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    networks:
      - defi-guard-network
    restart: unless-stopped

networks:
  defi-guard-network:
    driver: bridge

volumes:
  threat_intel_data:
  stablecoin_data:
  sanction_data:
```

## ⚙️ Runtime Configuration

### API Service Configuration

```typescript
// Service URLs configuration
const serviceConfig = {
  threatIntel: {
    baseUrl: import.meta.env.VITE_THREAT_INTEL_API_URL || 'http://localhost:8000',
    timeout: 30000,
    retryAttempts: 3,
    healthCheckInterval: 30000,
  },
  stablecoinMonitor: {
    baseUrl: import.meta.env.VITE_STABLECOIN_MONITOR_API_URL || 'http://localhost:8001',
    timeout: 15000,
    retryAttempts: 2,
    healthCheckInterval: 60000,
  },
  sanctionDetector: {
    baseUrl: import.meta.env.VITE_SANCTION_DETECTOR_API_URL || 'http://localhost:3000',
    timeout: 45000,
    retryAttempts: 3,
    healthCheckInterval: 30000,
  },
};

// Application configuration
const appConfig = {
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  features: {
    experimentalFeatures: import.meta.env.VITE_ENABLE_EXPERIMENTAL_FEATURES === 'true',
    debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  },
  limits: {
    maxBulkAddresses: parseInt(import.meta.env.VITE_MAX_BULK_ADDRESSES || '100'),
    maxBulkTransactions: parseInt(import.meta.env.VITE_MAX_BULK_TRANSACTIONS || '50'),
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  },
};
```

### Theme Configuration

```typescript
import { createTheme } from '@mui/material/styles';

const themeConfig = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#c51162',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
```

## 🔒 Security Configuration

### Content Security Policy

```typescript
// For production deployment
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' localhost:* ws://localhost:*",
  ].join('; '),
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
```

### CORS Configuration

```typescript
// API service CORS settings
const corsConfig = {
  origin: [
    'http://localhost:3002',
    'http://localhost:5173',
    'https://your-production-domain.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
```

## 📊 Monitoring Configuration

### Health Check Configuration

```typescript
// Service health check settings
const healthCheckConfig = {
  interval: 30000,      // 30 seconds
  timeout: 5000,        // 5 seconds  
  retries: 3,           // 3 attempts
  startPeriod: 10000,   // 10 seconds
  endpoints: {
    sanctionDetector: '/api/health',
    threatIntel: '/',
    stablecoinMonitor: '/',
  },
};
```

### Logging Configuration

```typescript
// Client-side logging configuration
const loggingConfig = {
  level: import.meta.env.VITE_APP_ENVIRONMENT === 'production' ? 'error' : 'debug',
  enableConsole: import.meta.env.VITE_APP_ENVIRONMENT !== 'production',
  enableRemote: false, // Set to true for production monitoring
  correlationId: true,
  includeStackTrace: import.meta.env.VITE_APP_ENVIRONMENT !== 'production',
};
```

## 🌐 Deployment Configurations

### Development Environment

```bash
# .env.development
VITE_THREAT_INTEL_API_URL=http://localhost:8000
VITE_STABLECOIN_MONITOR_API_URL=http://localhost:8001
VITE_SANCTION_DETECTOR_API_URL=http://localhost:3000
VITE_APP_ENVIRONMENT=development
VITE_ENABLE_DEBUG_MODE=true
```

### Staging Environment

```bash
# .env.staging
VITE_THREAT_INTEL_API_URL=https://threat-intel-staging.yourdomain.com
VITE_STABLECOIN_MONITOR_API_URL=https://stablecoin-staging.yourdomain.com
VITE_SANCTION_DETECTOR_API_URL=https://sanction-staging.yourdomain.com
VITE_APP_ENVIRONMENT=staging
VITE_ENABLE_DEBUG_MODE=false
```

### Production Environment

```bash
# .env.production
VITE_THREAT_INTEL_API_URL=https://threat-intel.yourdomain.com
VITE_STABLECOIN_MONITOR_API_URL=https://stablecoin.yourdomain.com
VITE_SANCTION_DETECTOR_API_URL=https://sanction.yourdomain.com
VITE_APP_ENVIRONMENT=production
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_EXPERIMENTAL_FEATURES=false
```

## 🔄 Configuration Validation

### Environment Variable Validation

```typescript
// Configuration validation utility
interface ConfigValidation {
  required: string[];
  optional: string[];
  validators: Record<string, (value: string) => boolean>;
}

const configValidation: ConfigValidation = {
  required: [
    'VITE_THREAT_INTEL_API_URL',
    'VITE_STABLECOIN_MONITOR_API_URL',
    'VITE_SANCTION_DETECTOR_API_URL',
  ],
  optional: [
    'VITE_API_URL',
    'VITE_APP_VERSION',
    'VITE_APP_ENVIRONMENT',
  ],
  validators: {
    VITE_THREAT_INTEL_API_URL: (value) => /^https?:\/\//.test(value),
    VITE_STABLECOIN_MONITOR_API_URL: (value) => /^https?:\/\//.test(value),
    VITE_SANCTION_DETECTOR_API_URL: (value) => /^https?:\/\//.test(value),
    VITE_MAX_BULK_ADDRESSES: (value) => !isNaN(Number(value)) && Number(value) > 0,
    VITE_MAX_BULK_TRANSACTIONS: (value) => !isNaN(Number(value)) && Number(value) > 0,
  },
};

function validateConfiguration(): boolean {
  const missing = configValidation.required.filter(
    key => !import.meta.env[key]
  );
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
}
```

## 📋 Configuration Checklist

### Pre-deployment Checklist

- [ ] All required environment variables set
- [ ] API URLs accessible from deployment environment
- [ ] Health check endpoints responding
- [ ] Docker containers building successfully
- [ ] CORS settings configured for production domain
- [ ] Security headers configured
- [ ] SSL certificates in place (production)
- [ ] Monitoring and logging configured
- [ ] Backup and recovery procedures documented

### Post-deployment Verification

- [ ] Frontend accessible via browser
- [ ] All API endpoints responding
- [ ] Health checks passing
- [ ] Address screening functional
- [ ] Transaction screening functional
- [ ] Bulk screening functional
- [ ] Error handling working correctly
- [ ] Performance acceptable
- [ ] Security headers present
- [ ] Monitoring alerts configured
