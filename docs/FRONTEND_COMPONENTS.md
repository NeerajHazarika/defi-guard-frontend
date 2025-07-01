# Frontend Components Documentation

## Overview

Complete reference for React components, UI patterns, and frontend architecture in the DeFi Guard application.

## Component Architecture

### 📁 Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── Header.tsx
│   ├── MetricCard.tsx
│   └── Sidebar.tsx
├── pages/              # Route-level components
│   ├── AddressScreening.tsx
│   ├── Analytics.tsx
│   ├── AttackSurfaceMonitoring.tsx
│   ├── DashboardOverview.tsx
│   ├── DeFiRiskAssessment.tsx
│   ├── ExploitMonitoring.tsx
│   ├── FraudIntelligence.tsx
│   ├── MixerDetection.tsx
│   ├── OFACCompliance.tsx
│   └── ThreatIntelligence.tsx
├── hooks/              # Custom React hooks
│   ├── useApiData.ts
│   ├── useBackendData.ts
│   └── useSimpleApiData.ts
└── services/           # API services
    └── api.ts
```

## 🧩 Core Components

### MetricCard Component
**File:** `src/components/MetricCard.tsx`

Reusable card component for displaying key metrics across the application.

```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

// Usage example
<MetricCard
  title="High Risk Addresses"
  value={highRiskCount}
  icon={<Security />}
  trend={{
    value: 5.2,
    label: "from last week",
    isPositive: false
  }}
  color="error"
  onClick={() => navigate('/address-screening')}
/>
```

### Header Component  
**File:** `src/components/Header.tsx`

Application header with navigation and status indicators.

```typescript
interface HeaderProps {
  title: string;
  showHealthStatus?: boolean;
  onMenuToggle?: () => void;
}

// Features:
// - Service health status indicators
// - Real-time connection status
// - Navigation breadcrumbs
// - Mobile-responsive menu toggle
```

### Sidebar Component
**File:** `src/components/Sidebar.tsx`

Navigation sidebar with route management and status indicators.

```typescript
interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}

// Navigation items with icons and active state management
const navigationItems = [
  { path: '/', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/address-screening', label: 'Address Screening', icon: <Security /> },
  { path: '/threat-intelligence', label: 'Threat Intelligence', icon: <Intelligence /> },
  // ... more items
];
```

### ErrorBoundary Component
**File:** `src/components/ErrorBoundary.tsx`

React error boundary for graceful error handling.

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Features:
// - Error logging and reporting
// - User-friendly error messages
// - Recovery suggestions
// - Error details for development
```

## 📄 Page Components

### AddressScreening Component
**File:** `src/pages/AddressScreening.tsx`

**Most Complex Component** - Multi-tab interface for comprehensive address and transaction screening.

#### Features:
- **Tab 1: Address Screening** - Individual address risk assessment
- **Tab 2: Transaction Screening** - TXID-based analysis with multi-hop
- **Tab 3: Bulk Screening** - Batch processing of addresses and transactions

#### State Management:
```typescript
// Tab management
const [tabValue, setTabValue] = useState(0);

// Address screening state
const [address, setAddress] = useState('');
const [singleResult, setSingleResult] = useState<AddressScreeningResult | null>(null);
const [singleLoading, setSingleLoading] = useState(false);
const [singleError, setSingleError] = useState<string | null>(null);

// Transaction screening state
const [txHash, setTxHash] = useState('');
const [txDirection, setTxDirection] = useState<'inputs' | 'outputs' | 'both'>('both');
const [includeMetadata, setIncludeMetadata] = useState(false);
const [txResult, setTxResult] = useState<TransactionScreeningResult | null>(null);
const [txLoading, setTxLoading] = useState(false);
const [txError, setTxError] = useState<string | null>(null);

// Bulk screening state
const [bulkAddresses, setBulkAddresses] = useState('');
const [bulkTransactions, setBulkTransactions] = useState('');
const [bulkResult, setBulkResult] = useState<BulkScreeningResponse | null>(null);
const [bulkLoading, setBulkLoading] = useState(false);
const [bulkError, setBulkError] = useState<string | null>(null);

// Settings
const [includeTransactionAnalysis, setIncludeTransactionAnalysis] = useState(false);
const [maxHops, setMaxHops] = useState(5);
```

#### Validation Functions:
```typescript
const isValidBitcoinAddress = (addr: string): boolean => {
  const legacyPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const segwitPattern = /^bc1[a-z0-9]{39,59}$/;
  const testnetPattern = /^[mn2][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  return legacyPattern.test(addr) || segwitPattern.test(addr) || testnetPattern.test(addr);
};

const isValidTransactionHash = (hash: string): boolean => {
  return /^[a-fA-F0-9]{64}$/.test(hash);
};
```

#### API Integration:
```typescript
// Address screening handler
const handleSingleScreening = useCallback(async () => {
  if (!address.trim() || !isValidBitcoinAddress(address.trim())) {
    setSingleError('Please enter a valid Bitcoin address');
    return;
  }

  setSingleLoading(true);
  setSingleError(null);
  setSingleResult(null);

  try {
    const result = await apiService.screenAddress(
      address.trim(),
      includeTransactionAnalysis,
      maxHops
    );
    setSingleResult(result);
  } catch (err) {
    setSingleError(String(err));
  } finally {
    setSingleLoading(false);
  }
}, [address, includeTransactionAnalysis, maxHops]);

// Transaction screening handler
const handleTransactionScreening = useCallback(async () => {
  const request: TransactionScreeningRequest = {
    txHash: txHash.trim(),
    direction: txDirection,
    includeMetadata,
  };
  
  const result = await apiService.screenTransaction(request);
  setTxResult(result);
}, [txHash, txDirection, includeMetadata]);
```

#### UI Components:
```typescript
// Tab interface
<Tabs value={tabValue} onChange={handleTabChange}>
  <Tab label="Address Screening" icon={<Security />} />
  <Tab label="Transaction Screening" icon={<Receipt />} />
  <Tab label="Bulk Screening" icon={<Upload />} />
</Tabs>

// Risk score visualization
<Box display="flex" alignItems="center" gap={1}>
  <Box
    width={20}
    height={20}
    borderRadius="50%"
    bgcolor={getRiskScoreColor(result.riskScore)}
  />
  <Typography variant="h6">
    Risk Score: {result.riskScore}/100
  </Typography>
  <Chip
    label={result.riskLevel}
    color={getRiskLevelColor(result.riskLevel)}
    size="small"
  />
</Box>
```

### DashboardOverview Component
**File:** `src/pages/DashboardOverview.tsx`

Main dashboard with service health monitoring and key metrics.

```typescript
// Service health integration
const [healthStatuses, setHealthStatuses] = useState({
  sanctionDetector: 'loading',
  threatIntel: 'loading',
  stablecoinMonitor: 'loading'
});

// Health check implementation
useEffect(() => {
  const checkServiceHealth = async () => {
    const [sanctionHealth, threatHealth, stablecoinHealth] = await Promise.allSettled([
      apiService.getSanctionDetectorHealth(),
      apiService.getThreatIntelHealth(),
      apiService.getStablecoinHealth()
    ]);

    setHealthStatuses({
      sanctionDetector: sanctionHealth.status === 'fulfilled' ? 'healthy' : 'error',
      threatIntel: threatHealth.status === 'fulfilled' ? 'healthy' : 'error',
      stablecoinMonitor: stablecoinHealth.status === 'fulfilled' ? 'healthy' : 'error'
    });
  };

  checkServiceHealth();
  const interval = setInterval(checkServiceHealth, 30000); // Every 30 seconds
  return () => clearInterval(interval);
}, []);
```

### ThreatIntelligence Component
**File:** `src/pages/ThreatIntelligence.tsx`

Real-time threat intelligence monitoring and visualization.

```typescript
// Threat intelligence data fetching
const { data: threatData, loading, error } = useApiData(
  () => apiService.getThreatIntelNews(50, true),
  []
);

// Threat level filtering and sorting
const filteredThreats = useMemo(() => {
  return threatData?.items
    ?.filter(item => item.classification.severity === selectedSeverity)
    ?.sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
    || [];
}, [threatData, selectedSeverity]);
```

## 🎣 Custom Hooks

### useApiData Hook
**File:** `src/hooks/useApiData.ts`

Generic hook for API data fetching with loading and error states.

```typescript
interface UseApiDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useApiData<T>(
  apiCall: () => Promise<T>,
  deps: React.DependencyList
): UseApiDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
```

### useBackendData Hook
**File:** `src/hooks/useBackendData.ts`

Specialized hook for backend service data with automatic refresh.

```typescript
interface UseBackendDataOptions {
  refreshInterval?: number;
  enabled?: boolean;
  onError?: (error: string) => void;
}

function useBackendData<T>(
  apiCall: () => Promise<T>,
  options: UseBackendDataOptions = {}
): UseApiDataResult<T> {
  const { refreshInterval = 0, enabled = true, onError } = options;
  
  // Implementation with auto-refresh and error handling
}
```

## 🎨 UI Patterns & Styling

### Material-UI Theme Integration
```typescript
// Theme configuration in src/theme.ts
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
    },
  },
});
```

### Common UI Patterns

#### Loading States
```typescript
{loading ? (
  <Box display="flex" justifyContent="center" p={3}>
    <CircularProgress />
  </Box>
) : (
  <ResultComponent data={data} />
)}
```

#### Error Display
```typescript
{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}
```

#### Empty States
```typescript
{data?.length === 0 && (
  <Box textAlign="center" py={4}>
    <Typography variant="h6" color="textSecondary">
      No data available
    </Typography>
  </Box>
)}
```

### Responsive Design Patterns
```typescript
// Mobile-responsive layouts
<Grid container spacing={3}>
  <Grid item xs={12} md={6} lg={4}>
    <MetricCard {...props} />
  </Grid>
</Grid>

// Responsive tables
<TableContainer>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Address</TableCell>
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          Risk Score
        </TableCell>
      </TableRow>
    </TableHead>
  </Table>
</TableContainer>
```

## 🧪 Component Testing

### Testing Patterns
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddressScreening } from '../AddressScreening';

describe('AddressScreening Component', () => {
  it('should validate Bitcoin addresses correctly', () => {
    render(<AddressScreening />);
    
    const input = screen.getByLabelText('Bitcoin Address');
    fireEvent.change(input, { target: { value: 'invalid-address' } });
    
    const submitButton = screen.getByRole('button', { name: 'Screen Address' });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please enter a valid Bitcoin address')).toBeInTheDocument();
  });

  it('should handle API responses correctly', async () => {
    // Mock API response
    jest.spyOn(apiService, 'screenAddress').mockResolvedValue({
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      riskScore: 15,
      riskLevel: 'LOW',
      sanctionMatches: [],
      timestamp: '2025-07-01T08:00:00.000Z',
      confidence: 85,
      processingTimeMs: 25
    });

    render(<AddressScreening />);
    
    const input = screen.getByLabelText('Bitcoin Address');
    fireEvent.change(input, { target: { value: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' } });
    
    const submitButton = screen.getByRole('button', { name: 'Screen Address' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Risk Score: 15/100')).toBeInTheDocument();
    });
  });
});
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Lazy loading for route components
const AddressScreening = lazy(() => import('./pages/AddressScreening'));
const ThreatIntelligence = lazy(() => import('./pages/ThreatIntelligence'));

// Route configuration with Suspense
<Suspense fallback={<CircularProgress />}>
  <Routes>
    <Route path="/address-screening" element={<AddressScreening />} />
    <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
  </Routes>
</Suspense>
```

### Memoization
```typescript
// Expensive calculations with useMemo
const processedData = useMemo(() => {
  return rawData?.map(item => ({
    ...item,
    formattedDate: formatDate(item.timestamp),
    riskCategory: calculateRiskCategory(item.riskScore)
  }));
}, [rawData]);

// Event handlers with useCallback
const handleSubmit = useCallback((data: FormData) => {
  // Handle form submission
}, []);
```

### Virtual Scrolling for Large Lists
```typescript
// For large result sets
import { FixedSizeList as List } from 'react-window';

const ResultsList = ({ items }) => (
  <List
    height={400}
    itemCount={items.length}
    itemSize={60}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <ResultItem item={data[index]} />
      </div>
    )}
  </List>
);
```

## 📱 Mobile Responsiveness

### Breakpoint Usage
```typescript
// Material-UI breakpoints
const theme = {
  breakpoints: {
    xs: 0,     // Extra small devices
    sm: 600,   // Small devices
    md: 900,   // Medium devices
    lg: 1200,  // Large devices
    xl: 1536,  // Extra large devices
  }
}

// Responsive styling
<Box
  sx={{
    display: { xs: 'block', md: 'flex' },
    gap: { xs: 1, md: 2 },
    p: { xs: 2, md: 3 }
  }}
>
```

### Mobile-First Component Design
```typescript
// Adaptive component behavior
const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};

const ResponsiveComponent = () => {
  const isMobile = useIsMobile();
  
  return (
    <Paper sx={{ p: isMobile ? 2 : 3 }}>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </Paper>
  );
};
```
