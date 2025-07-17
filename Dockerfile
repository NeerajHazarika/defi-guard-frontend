# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Define build arguments for environment variables
ARG VITE_THREAT_INTEL_API_URL=http://defi-guard-threat-intel:8000
ARG VITE_STABLECOIN_MONITOR_API_URL=http://defi-guard-stablecoin-monitor:8001
ARG VITE_STABLECOIN_OSINT_API_URL=http://defi-guard-stablecoin-advanced:8080
ARG VITE_SANCTION_DETECTOR_API_URL=http://sanction-detector:3000
ARG VITE_SCAM_DETECTOR_API_URL=http://scam-detector:3001
ARG VITE_DEFI_RISK_ASSESSMENT_API_URL=http://defi-risk-assessment:3003

# Set environment variables for Vite build
ENV VITE_THREAT_INTEL_API_URL=$VITE_THREAT_INTEL_API_URL
ENV VITE_STABLECOIN_MONITOR_API_URL=$VITE_STABLECOIN_MONITOR_API_URL
ENV VITE_STABLECOIN_OSINT_API_URL=$VITE_STABLECOIN_OSINT_API_URL
ENV VITE_SANCTION_DETECTOR_API_URL=$VITE_SANCTION_DETECTOR_API_URL
ENV VITE_SCAM_DETECTOR_API_URL=$VITE_SCAM_DETECTOR_API_URL
ENV VITE_DEFI_RISK_ASSESSMENT_API_URL=$VITE_DEFI_RISK_ASSESSMENT_API_URL

# Debug: Print environment variables
RUN echo "Building with URLs:" && \
    echo "THREAT_INTEL: $VITE_THREAT_INTEL_API_URL" && \
    echo "STABLECOIN: $VITE_STABLECOIN_MONITOR_API_URL" && \
    echo "STABLECOIN_OSINT: $VITE_STABLECOIN_OSINT_API_URL" && \
    echo "SANCTION: $VITE_SANCTION_DETECTOR_API_URL" && \
    echo "SCAM: $VITE_SCAM_DETECTOR_API_URL" && \
    echo "DEFI_RISK: $VITE_DEFI_RISK_ASSESSMENT_API_URL"

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
