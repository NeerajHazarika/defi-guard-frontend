# Threat Intelligence Service Documentation

## Overview

The Threat Intelligence Service is a Python-based OSINT (Open Source Intelligence) monitoring system that automatically collects, processes, and categorizes DeFi security threats from various sources.

## Service Details

- **Port:** 8000
- **Technology:** Python 3.11, FastAPI, SQLite
- **Repository:** `defi-guard-threat-intel-osint` (external dependency)
- **Purpose:** Automated threat intelligence collection and analysis

## Core Features

### 🕵️ OSINT Data Collection
- Automated web scraping from security sources
- Real-time threat intelligence aggregation
- Multi-source data correlation
- Intelligent content classification

### 📊 Threat Analysis
- Automated threat severity scoring
- Protocol-specific threat detection
- Attack vector classification
- Trend analysis and pattern recognition

### 🔔 Alert Generation
- Real-time threat notifications
- Severity-based alerting
- Protocol-specific alerts
- Custom alert thresholds

## API Endpoints

### Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "DeFi Guard OSINT API is running",
  "status": "healthy"
}
```

### Threat Intelligence Data
```http
GET /api/v1/threat-intel?limit={limit}&fresh_scrape={boolean}
```

**Parameters:**
- `limit` (optional): Number of results to return (default: 50)
- `fresh_scrape` (optional): Force fresh data collection (default: true)

**Response:**
```json
{
  "status": "success",
  "count": 25,
  "total_count": 150,
  "data": [
    {
      "id": "threat-001",
      "title": "Critical Vulnerability in Protocol X",
      "description": "Detailed threat description...",
      "source_url": "https://source.com/article",
      "source_name": "SecurityBlog",
      "published_date": "2025-07-01T08:00:00Z",
      "severity_score": 85,
      "risk_level": "high",
      "protocol_name": "Uniswap",
      "attack_type": "Flash Loan",
      "additional_data": {
        "attack_vector": "Smart Contract",
        "affected_tokens": ["ETH", "USDC"],
        "estimated_loss": "5000000"
      }
    }
  ]
}
```

### Specific Threat Details
```http
GET /api/v1/threat-intel/{threat_id}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "threat-001",
    "title": "Critical Vulnerability in Protocol X",
    "full_content": "Complete article content...",
    "analysis": {
      "severity_breakdown": {
        "impact": 9,
        "likelihood": 8,
        "exploitability": 7
      },
      "keywords": ["flash loan", "reentrancy", "defi"],
      "related_threats": ["threat-002", "threat-003"]
    },
    "metadata": {
      "created_at": "2025-07-01T08:00:00Z",
      "updated_at": "2025-07-01T08:30:00Z",
      "processed_at": "2025-07-01T08:05:00Z"
    }
  }
}
```

## Data Models

### Threat Intelligence Item

```typescript
interface ThreatIntelItem {
  id: string;                           // Unique identifier
  title: string;                        // Threat title
  summary: string;                      // Brief description (mapped from description)
  url: string;                          // Source URL (mapped from source_url)
  source: string;                       // Source name (mapped from source_name)
  published_date: string;               // Publication timestamp
  threat_level: number;                 // Threat level 0-100 (mapped from severity_score)
  protocols_mentioned: string[];       // Affected protocols
  classification: {
    exploit_type?: string;              // Type of exploit (mapped from attack_type)
    attack_vector?: string;             // Attack method
    severity: 'low' | 'medium' | 'high' | 'critical';  // Risk level
  };
}
```

### Raw API Response Structure

```typescript
interface ThreatIntelRawItem {
  id: string;
  title: string;
  description: string;                  // Raw description from source
  source_url: string;                   // Original source URL
  source_name: string;                  // Source publication name
  published_date: string;               // ISO timestamp
  severity_score: number;               // 0-100 severity score
  risk_level: string;                   // "low", "medium", "high", "critical"
  protocol_name?: string;               // Primary affected protocol
  attack_type?: string;                 // Classification of attack
  additional_data?: {
    attack_vector?: string;
    affected_tokens?: string[];
    estimated_loss?: string;
    technical_details?: any;
  };
}
```

## Data Sources

### Primary Sources
1. **Rekt.news** - DeFi exploit reporting
2. **CoinTelegraph** - Cryptocurrency security news
3. **The Block** - Blockchain security coverage
4. **Security Blogs** - Specialized security research
5. **GitHub Advisories** - Code vulnerability reports

### Data Collection Process
```
1. Web Scraping → 2. Content Extraction → 3. NLP Processing → 4. Classification → 5. Storage
```

## Frontend Integration

### API Service Usage

```typescript
// Get threat intelligence data
const response = await apiService.getThreatIntelNews(50, true);

// Response transformation handled automatically
interface ThreatIntelResponse {
  items: ThreatIntelItem[];     // Transformed items
  total: number;                // Total available items
  page: number;                 // Current page
  per_page: number;             // Items per page
}
```

### Data Transformation Logic

```typescript
// Automatic transformation in apiService.getThreatIntelNews()
const transformedItems: ThreatIntelItem[] = response.data.map(item => ({
  id: item.id,
  title: item.title,
  summary: item.description,                    // description → summary
  url: item.source_url,                        // source_url → url
  source: item.source_name,                    // source_name → source
  published_date: item.published_date,
  threat_level: item.severity_score,           // severity_score → threat_level
  protocols_mentioned: item.protocol_name ? [item.protocol_name] : [],
  classification: {
    exploit_type: item.attack_type,            // attack_type → exploit_type
    attack_vector: item.additional_data?.attack_vector,
    severity: item.risk_level as 'low' | 'medium' | 'high' | 'critical'
  }
}));
```

## Configuration

### Environment Variables

```bash
# Database configuration
DATABASE_URL=sqlite:////app/data/threat_intel.db

# OpenAI integration (optional)
OPENAI_API_KEY=${OPENAI_API_KEY:-}

# Scraping configuration
DEBUG=false
SCRAPER_DELAY=2                    # Delay between requests (seconds)
MAX_CONCURRENT_REQUESTS=5          # Concurrent scraping requests

# Service configuration
PORT=8000
HOST=0.0.0.0
WORKERS=1                          # Uvicorn workers

# Data retention
MAX_ITEMS_STORED=10000             # Maximum items in database
DATA_RETENTION_DAYS=30             # Days to keep old data
```

### Docker Configuration

```yaml
defi-guard-threat-intel:
  image: python:3.11-slim
  command: >
    sh -c "
      apt-get update && 
      apt-get install -y curl git && 
      git clone https://github.com/NeerajHazarika/defi-guard-threat-intel-osint.git /app &&
      cd /app && 
      mkdir -p /app/data &&
      pip install -r requirements.txt && 
      python -c 'from app.database.database import create_tables; create_tables()' &&
      uvicorn app.main:app --host 0.0.0.0 --port 8000
    "
  ports:
    - "8000:8000"
  environment:
    - DATABASE_URL=sqlite:////app/data/threat_intel.db
    - OPENAI_API_KEY=${OPENAI_API_KEY:-}
    - DEBUG=false
    - SCRAPER_DELAY=2
    - MAX_CONCURRENT_REQUESTS=5
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8000/"]
    interval: 30s
    timeout: 10s
    retries: 3
  volumes:
    - threat_intel_data:/app/data
  networks:
    - defi-guard-network
```

## Data Processing Pipeline

### 1. Collection Phase
```python
# Automated scraping process
async def collect_threats():
    sources = ['rekt.news', 'cointelegraph.com', 'theblock.co']
    
    for source in sources:
        articles = await scrape_source(source)
        for article in articles:
            await process_article(article)
```

### 2. Processing Phase
```python
# Content analysis and classification
async def process_article(article):
    # Extract key information
    severity = calculate_severity(article.content)
    protocols = extract_protocols(article.content)
    attack_type = classify_attack(article.content)
    
    # Store in database
    await store_threat_item({
        'title': article.title,
        'severity_score': severity,
        'protocols_mentioned': protocols,
        'attack_type': attack_type
    })
```

### 3. Classification System

```python
# Threat severity calculation
def calculate_severity(content: str) -> int:
    factors = {
        'financial_loss': extract_loss_amount(content),
        'protocol_popularity': assess_protocol_impact(content),
        'exploit_complexity': analyze_technical_complexity(content),
        'user_impact': evaluate_user_impact(content)
    }
    
    return weighted_severity_score(factors)

# Attack type classification
ATTACK_TYPES = [
    'Flash Loan Attack',
    'Reentrancy',
    'Oracle Manipulation',
    'Governance Attack',
    'Smart Contract Bug',
    'Bridge Exploit',
    'MEV Attack'
]
```

## Performance Characteristics

### Data Collection
- **Scraping Frequency:** Every 30 minutes
- **Processing Time:** 2-5 minutes per source
- **Data Volume:** 50-200 new items per day
- **Storage Growth:** ~10MB per month

### API Performance
- **Response Time:** 100-500ms average
- **Concurrent Users:** 100+ supported
- **Rate Limiting:** 1000 requests/hour per IP
- **Caching:** 5-minute response cache

### Database Operations
- **Read Performance:** <100ms for typical queries
- **Write Performance:** <50ms for single inserts
- **Storage Efficiency:** SQLite with indexes
- **Backup Frequency:** Daily automated backups

## Monitoring & Alerts

### Health Monitoring
```python
# Health check endpoint implementation
@app.get("/")
async def health_check():
    try:
        # Check database connectivity
        db_status = await check_database_health()
        
        # Check recent data collection
        last_collection = await get_last_collection_time()
        
        # Check external source availability
        sources_status = await check_sources_health()
        
        return {
            "message": "DeFi Guard OSINT API is running",
            "status": "healthy",
            "database": db_status,
            "last_collection": last_collection,
            "sources": sources_status
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
```

### Alert Conditions
- Database connection failures
- Scraping errors (multiple consecutive failures)
- Disk space warnings (>80% usage)
- High severity threats detected
- External source unavailability

### Logging
```python
# Structured logging configuration
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/logs/threat_intel.log'),
        logging.StreamHandler()
    ]
)

# Log threat collection
logger.info(f"Collected {count} new threats", extra={
    'source': source_name,
    'processing_time': processing_time,
    'severity_distribution': severity_stats
})
```

## Development & Testing

### Local Development
```bash
# Clone repository
git clone https://github.com/NeerajHazarika/defi-guard-threat-intel-osint.git
cd defi-guard-threat-intel-osint

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -c "from app.database.database import create_tables; create_tables()"

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Testing
```bash
# Run unit tests
pytest tests/

# Test API endpoints
curl http://localhost:8000/
curl "http://localhost:8000/api/v1/threat-intel?limit=5"

# Test data collection
python -m app.collectors.test_scraper
```

### Mock Data for Testing
```python
# Test data for development
MOCK_THREATS = [
    {
        "id": "test-001",
        "title": "Test Flash Loan Attack on DEX",
        "description": "Mock threat for testing purposes",
        "severity_score": 75,
        "risk_level": "high",
        "protocol_name": "TestDEX",
        "attack_type": "Flash Loan"
    }
]
```

## Security Considerations

### Data Validation
- Input sanitization for all scraped content
- URL validation for external sources
- Content filtering for malicious scripts
- Rate limiting to prevent abuse

### Privacy & Compliance
- No personal data collection
- Public source information only
- GDPR compliance for EU users
- Data retention policies

### Error Handling
```python
# Robust error handling
async def safe_scrape_source(source_url: str):
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(source_url)
            response.raise_for_status()
            return response.text
    except httpx.TimeoutException:
        logger.warning(f"Timeout scraping {source_url}")
        return None
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error {e.response.status_code} for {source_url}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error scraping {source_url}: {e}")
        return None
```
