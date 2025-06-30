import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  AlertTitle,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Security,
  Assessment,
  BugReport,
  NewReleases,
  AccountBalance,
  Warning,
  OpenInNew,
  Sort,
  SwapVert,
  Timeline,
  Title,
  Source,
  Hub,
} from '@mui/icons-material';
import { useApiData } from '../hooks/useApiData';
import { useBackendData } from '../hooks/useBackendData';
import MetricCard from '../components/MetricCard';

const DashboardOverview: React.FC = () => {
  const { health, stats, protocols } = useApiData();
  const { 
    threatIntel, 
    stablecoins, 
    stablecoinAlerts,
    loading,
    threatIntelLoading
  } = useBackendData();

  // Sorting state for threat intelligence
  const [sortBy, setSortBy] = useState<'date' | 'threat_level' | 'title' | 'source' | 'protocols'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as 'date' | 'threat_level' | 'title' | 'source' | 'protocols';
    setSortBy(value);
    // Default sort orders for different fields
    if (value === 'date') {
      setSortOrder('desc'); // Newest first
    } else if (value === 'threat_level') {
      setSortOrder('desc'); // Highest threat level first
    } else if (value === 'title') {
      setSortOrder('asc'); // Alphabetical
    } else if (value === 'source') {
      setSortOrder('asc'); // Alphabetical
    } else if (value === 'protocols') {
      setSortOrder('desc'); // Most protocols first
    }
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Sorted threat intelligence data
  const sortedThreatIntel = useMemo(() => {
    if (!threatIntel || threatIntel.length === 0) return [];

    return [...threatIntel].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date': {
          const dateA = new Date(a.published_date).getTime();
          const dateB = new Date(b.published_date).getTime();
          comparison = dateA - dateB;
          break;
        }
        
        case 'threat_level':
          comparison = a.threat_level - b.threat_level;
          break;

        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;

        case 'source':
          comparison = a.source.localeCompare(b.source);
          break;

        case 'protocols':
          comparison = a.protocols_mentioned.length - b.protocols_mentioned.length;
          break;
        
        default:
          return 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [threatIntel, sortBy, sortOrder]);

  // Helper functions
  const getThreatLevelColor = (level: number) => {
    if (level >= 8) return 'error';
    if (level >= 6) return 'warning';
    if (level >= 4) return 'info';
    return 'success';
  };

  // Calculate real metrics from actual backend data
  const metrics = {
    threatIntelCount: threatIntel.length,
    stablecoinCount: stablecoins.length,
    criticalAlerts: stablecoinAlerts.filter(a => a.severity === 'critical').length,
    highThreatNews: threatIntel.filter(t => t.threat_level >= 8).length,
    monitoredProtocols: protocols?.total || 0,
    trackedAddresses: stats?.tracked_addresses || 0,
    overallRiskLevel: (stablecoinAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length > 0 ? 'HIGH' : 
                     stablecoinAlerts.filter(a => a.severity === 'medium').length > 0 ? 'MEDIUM' : 'LOW') as 'HIGH' | 'MEDIUM' | 'LOW'
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        DeFi Security Dashboard
      </Typography>

      {/* Key Metrics - Only Real Data */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Threat Intelligence"
            value={metrics.threatIntelCount}
            subtitle="Recent reports"
            riskLevel={metrics.highThreatNews > 5 ? "HIGH" : metrics.highThreatNews > 2 ? "MEDIUM" : "LOW"}
            icon={<BugReport />}
            color={metrics.highThreatNews > 5 ? "error.main" : "warning.main"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Stablecoins"
            value={metrics.stablecoinCount}
            subtitle="Monitored coins"
            icon={<AccountBalance />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Critical Alerts"
            value={metrics.criticalAlerts}
            subtitle="Stablecoin issues"
            icon={<Warning />}
            color={metrics.criticalAlerts > 0 ? "error.main" : "success.main"}
            riskLevel={metrics.criticalAlerts > 0 ? "CRITICAL" : "LOW"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="High Threat News"
            value={metrics.highThreatNews}
            subtitle="Level 8+ reports"
            icon={<NewReleases />}
            color={metrics.highThreatNews > 3 ? "error.main" : "warning.main"}
            riskLevel={metrics.highThreatNews > 3 ? "HIGH" : "MEDIUM"}
          />
        </Grid>
      </Grid>

      {/* Backend Integration Metrics */}
      {health && stats && protocols && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Attack Surface"
              value={metrics.monitoredProtocols}
              subtitle="Monitored protocols"
              icon={<Security />}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Tracked Addresses"
              value={metrics.trackedAddresses}
              subtitle="Under monitoring"
              icon={<Assessment />}
              color="info.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="System Status"
              value={health.status.toUpperCase()}
              subtitle="Backend health"
              icon={<Security />}
              color={health.status === 'healthy' ? "success.main" : "error.main"}
              riskLevel={health.status === 'healthy' ? "LOW" : "HIGH"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Overall Risk"
              value={metrics.overallRiskLevel}
              subtitle="Platform status"
              icon={<Assessment />}
              color={metrics.overallRiskLevel === 'HIGH' ? "error.main" : 
                     metrics.overallRiskLevel === 'MEDIUM' ? "warning.main" : "success.main"}
              riskLevel={metrics.overallRiskLevel}
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Stablecoin Alerts - Real Data Only */}
        {stablecoinAlerts.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Stablecoin Security Alerts
                  <Chip 
                    label={`${stablecoinAlerts.length} alerts`} 
                    size="small" 
                    sx={{ ml: 2 }} 
                    color={stablecoinAlerts.some(a => a.severity === 'critical') ? "error" : "warning"}
                  />
                </Typography>
                <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                  {stablecoinAlerts.slice(0, 5).map((alert) => (
                    <Alert 
                      key={alert.id}
                      severity={
                        alert.severity === 'critical' ? 'error' : 
                        alert.severity === 'high' ? 'error' :
                        alert.severity === 'medium' ? 'warning' : 'info'
                      }
                      sx={{ mb: 2 }}
                    >
                      <AlertTitle>
                        {alert.coin_symbol} - {alert.alert_type}
                        <Chip 
                          label={alert.severity.toUpperCase()} 
                          size="small" 
                          sx={{ ml: 1 }} 
                          color={
                            alert.severity === 'critical' ? 'error' : 
                            alert.severity === 'high' ? 'error' :
                            alert.severity === 'medium' ? 'warning' : 'info'
                          }
                        />
                      </AlertTitle>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </Typography>
                    </Alert>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Stablecoin Monitoring */}
        {stablecoins.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Stablecoin Price Monitoring
                  <Chip 
                    label={`${stablecoins.length} coins tracked`} 
                    size="small" 
                    sx={{ ml: 2 }} 
                    color="primary"
                  />
                </Typography>
                <Grid container spacing={2}>
                  {stablecoins.slice(0, 6).map((coin) => (
                    <Grid item xs={12} sm={6} md={4} key={coin.symbol}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {coin.symbol}
                          </Typography>
                          <Chip
                            label={coin.status.toUpperCase()}
                            size="small"
                            color={
                              coin.status === 'stable' ? 'success' :
                              coin.status === 'warning' ? 'warning' : 'error'
                            }
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {coin.name}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Current Price:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${coin.current_price.toFixed(4)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Target Price:</Typography>
                          <Typography variant="body2">
                            ${coin.target_price.toFixed(4)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Deviation:</Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              color: Math.abs(coin.deviation_percentage) > 0.5 ? 'error.main' : 
                                     Math.abs(coin.deviation_percentage) > 0.2 ? 'warning.main' : 'success.main'
                            }}
                          >
                            {coin.deviation_percentage > 0 ? '+' : ''}{coin.deviation_percentage.toFixed(2)}%
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Threat Intelligence News - Always Show */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Latest Threat Intelligence
                  </Typography>
                  <Chip 
                    label={loading || threatIntelLoading ? 'Loading...' : `${sortedThreatIntel.length} reports`} 
                    size="small" 
                    color={loading || threatIntelLoading ? "warning" : "secondary"}
                  />
                  {sortedThreatIntel.length > 0 && (
                    <Chip 
                      label={`Sorted by ${sortBy.replace('_', ' ')} (${sortOrder.toUpperCase()})`}
                      size="small" 
                      variant="outlined"
                      color="primary"
                    />
                  )}
                </Box>
                
                {sortedThreatIntel.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <InputLabel>Sort by</InputLabel>
                      <Select
                        value={sortBy}
                        label="Sort by"
                        onChange={handleSortChange}
                        startAdornment={<Sort sx={{ mr: 1, color: 'text.secondary' }} />}
                        disabled={loading || threatIntelLoading}
                      >
                        <MenuItem value="date">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Timeline fontSize="small" />
                            Date
                          </Box>
                        </MenuItem>
                        <MenuItem value="threat_level">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Assessment fontSize="small" />
                            Threat Level
                          </Box>
                        </MenuItem>
                        <MenuItem value="title">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Title fontSize="small" />
                            Title
                          </Box>
                        </MenuItem>
                        <MenuItem value="source">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Source fontSize="small" />
                            Source
                          </Box>
                        </MenuItem>
                        <MenuItem value="protocols">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Hub fontSize="small" />
                            Protocol Count
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'} - Click to toggle`}>
                      <IconButton 
                        size="small" 
                        onClick={toggleSortOrder}
                        disabled={loading || threatIntelLoading}
                        sx={{ 
                          border: 1, 
                          borderColor: 'divider',
                          backgroundColor: 'background.paper'
                        }}
                      >
                        <SwapVert 
                          sx={{ 
                            transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.3s ease'
                          }} 
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
              
              {/* Loading State */}
              {(loading || threatIntelLoading) && sortedThreatIntel.length === 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minHeight: 300,
                  gap: 2
                }}>
                  <CircularProgress size={40} color="primary" />
                  <Typography variant="body1" color="text.secondary">
                    {threatIntelLoading ? 'Loading threat intelligence data...' : 'Connecting to threat intelligence service...'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This may take a few moments while we fetch the latest security reports.
                  </Typography>
                </Box>
              )}

              {/* No Data State */}
              {!loading && !threatIntelLoading && sortedThreatIntel.length === 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minHeight: 300,
                  gap: 2
                }}>
                  <Warning sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="h6" color="text.secondary">
                    No Threat Intelligence Data Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Unable to load threat intelligence reports. Please check your connection to the backend services.
                  </Typography>
                </Box>
              )}

              {/* Data List with Loading Overlay */}
              {sortedThreatIntel.length > 0 && (
                <Box sx={{ position: 'relative' }}>
                  {/* Loading Overlay for Fresh Data */}
                  {threatIntelLoading && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      zIndex: 10,
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.15) 100%)', 
                      borderRadius: 1, 
                      p: 2, 
                      border: '2px solid rgba(76, 175, 80, 0.3)',
                      backdropFilter: 'blur(3px)',
                      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <LinearProgress 
                          color="success" 
                          sx={{ 
                            flex: 1, 
                            height: 6, 
                            borderRadius: 3,
                          }} 
                        />
                        <Chip 
                          label="🔴 REFRESHING" 
                          size="small" 
                          color="success" 
                          variant="filled"
                          sx={{ 
                            fontWeight: 600,
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.7 }
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="success.dark" sx={{ textAlign: 'center', fontWeight: 500 }}>
                        Fetching latest threat intelligence...
                      </Typography>
                    </Box>
                  )}
                  
                  <List sx={{ 
                    maxHeight: 500, 
                    overflowY: 'auto',
                    minHeight: 300,
                    padding: 0,
                    opacity: threatIntelLoading ? 0.7 : 1,
                    transition: 'opacity 0.3s ease',
                  }}>
                    {sortedThreatIntel.map((threat, index) => (
                      <div key={threat.id}>
                        <ListItem sx={{ px: 0, py: 2 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 500, flex: 1 }}>
                                  {threat.title}
                                </Typography>
                                <Chip
                                  label={`Level ${threat.threat_level}/10`}
                                  size="small"
                                  color={getThreatLevelColor(threat.threat_level)}
                                />
                                <Tooltip title="Open source">
                                  <IconButton 
                                    size="small" 
                                    href={threat.url} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <OpenInNew fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {threat.summary}
                                </Typography>
                                
                                {threat.protocols_mentioned.length > 0 && (
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      Protocols:
                                    </Typography>
                                    {threat.protocols_mentioned.map((protocol) => (
                                      <Chip
                                        key={protocol}
                                        label={protocol}
                                        size="small"
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                )}
                                
                                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(threat.published_date).toLocaleDateString()}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Source: {threat.source}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < sortedThreatIntel.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default DashboardOverview;
