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
  LinearProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Security,
  Warning,
  OpenInNew,
  Refresh,
  TrendingUp,
  BugReport,
  Assessment,
  Timeline,
  Sort,
  SwapVert,
  Title,
  Source,
  Hub,
} from '@mui/icons-material';
import { useBackendData } from '../hooks/useBackendData';
import MetricCard from '../components/MetricCard';

const ThreatIntelligence: React.FC = () => {
  const { 
    threatIntel, 
    loading,
    threatIntelLoading,
    error,
    refreshData,
    refreshThreatIntel,
    lastUpdated 
  } = useBackendData();

  // Sorting state
  const [sortBy, setSortBy] = useState<'date' | 'threat_level' | 'severity' | 'title' | 'source' | 'protocols'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page - now configurable

  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as 'date' | 'threat_level' | 'severity' | 'title' | 'source' | 'protocols';
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting changes
    
    // Default sort orders for different fields
    if (value === 'date') {
      setSortOrder('desc'); // Newest first
    } else if (value === 'threat_level') {
      setSortOrder('desc'); // Highest threat level first
    } else if (value === 'severity') {
      setSortOrder('desc'); // Most severe first
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
    setCurrentPage(1); // Reset to first page when sort order changes
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
        
        case 'severity': {
          const severityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
          const severityA = severityOrder[a.classification.severity] || 0;
          const severityB = severityOrder[b.classification.severity] || 0;
          comparison = severityA - severityB;
          break;
        }

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

  // Paginated threat intelligence data
  const paginatedThreatIntel = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedThreatIntel.slice(startIndex, endIndex);
  }, [sortedThreatIntel, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedThreatIntel.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // Scroll to top of threats list when changing page
    const threatsSection = document.getElementById('threats-list');
    if (threatsSection) {
      threatsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    setItemsPerPage(event.target.value as number);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate threat intelligence metrics
  const metrics = {
    totalThreats: sortedThreatIntel.length,
    criticalThreats: sortedThreatIntel.filter(t => t.classification.severity === 'critical').length,
    highThreats: sortedThreatIntel.filter(t => t.classification.severity === 'high').length,
    recentThreats: sortedThreatIntel.filter(t => {
      const threatDate = new Date(t.published_date);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return threatDate > dayAgo;
    }).length,
    averageThreatLevel: sortedThreatIntel.length > 0 
      ? (sortedThreatIntel.reduce((sum, t) => sum + t.threat_level, 0) / sortedThreatIntel.length).toFixed(1)
      : '0.0',
    topProtocols: sortedThreatIntel
      .flatMap(t => t.protocols_mentioned)
      .reduce((acc: Record<string, number>, protocol) => {
        acc[protocol] = (acc[protocol] || 0) + 1;
        return acc;
      }, {})
  };

  const topProtocolsList = Object.entries(metrics.topProtocols)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getThreatLevelColor = (level: number) => {
    if (level >= 8) return 'error';
    if (level >= 6) return 'warning';
    if (level >= 4) return 'info';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Threat Intelligence (OSINT)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {lastUpdated && (
            <Typography variant="body2" color="text.secondary">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={refreshThreatIntel}
            disabled={threatIntelLoading}
          >
            {threatIntelLoading ? 'Fresh Scraping...' : 'Fresh Scrape'}
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={refreshData}
            disabled={loading}
          >
            Refresh All
          </Button>
        </Box>
      </Box>

      {/* Loading State - Only show when no data exists and loading */}
      {(loading || threatIntelLoading) && sortedThreatIntel.length === 0 && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            {threatIntelLoading ? 'Fresh scraping threat intelligence data...' : 'Loading data...'}
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Connection Error</AlertTitle>
          Unable to fetch threat intelligence data: {error}
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Total Threats"
            value={metrics.totalThreats}
            subtitle="All reports"
            icon={<Security />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Critical Threats"
            value={metrics.criticalThreats}
            subtitle="Immediate attention"
            icon={<Warning />}
            color="error.main"
            riskLevel="CRITICAL"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="High Priority"
            value={metrics.highThreats}
            subtitle="High severity"
            icon={<BugReport />}
            color="warning.main"
            riskLevel="HIGH"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Recent (24h)"
            value={metrics.recentThreats}
            subtitle="New threats"
            icon={<TrendingUp />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Avg Threat Level"
            value={metrics.averageThreatLevel}
            subtitle="Out of 10"
            icon={<Assessment />}
            color={parseFloat(metrics.averageThreatLevel) >= 7 ? "error.main" : 
                  parseFloat(metrics.averageThreatLevel) >= 5 ? "warning.main" : "success.main"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Threat Intelligence Reports */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ minHeight: 500, height: 'fit-content' }}>
            <CardContent sx={{ position: 'relative', minHeight: 450 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Latest Threat Reports
                  </Typography>
                  <Chip 
                    label={threatIntelLoading ? 'Refreshing...' : `${sortedThreatIntel.length} reports`} 
                    size="small" 
                    color={threatIntelLoading ? "warning" : "secondary"}
                  />
                  <Chip 
                    label={`Sorted by ${sortBy.replace('_', ' ')} (${sortOrder.toUpperCase()})`}
                    size="small" 
                    variant="outlined"
                    color="primary"
                  />
                  {totalPages > 1 && (
                    <Chip 
                      label={`Page ${currentPage} of ${totalPages}`}
                      size="small" 
                      variant="outlined"
                      color="info"
                    />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort by"
                      onChange={handleSortChange}
                      startAdornment={<Sort sx={{ mr: 1, color: 'text.secondary' }} />}
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
                      <MenuItem value="severity">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Warning fontSize="small" />
                          Severity
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
                  
                  {/* Items per page selector */}
                  <FormControl size="small">
                    <InputLabel id="items-per-page-label">Items/Page</InputLabel>
                    <Select
                      labelId="items-per-page-label"
                      id="items-per-page-select"
                      value={itemsPerPage}
                      label="Items/Page"
                      onChange={handleItemsPerPageChange}
                      sx={{ 
                        minWidth: 100,
                        backgroundColor: 'background.paper'
                      }}
                    >
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              
              {sortedThreatIntel.length > 0 ? (
                <Box sx={{ position: 'relative', minHeight: 400 }}>
                  {/* Loading Overlay - Enhanced with better visual feedback */}
                  {threatIntelLoading && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      zIndex: 10,
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.15) 100%)', 
                      borderRadius: 1, 
                      p: 3, 
                      border: '2px solid rgba(76, 175, 80, 0.3)',
                      backdropFilter: 'blur(3px)',
                      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                        <LinearProgress 
                          color="success" 
                          sx={{ 
                            flex: 1, 
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                            }
                          }} 
                        />
                        <Chip 
                          label="🔴 LIVE SCRAPING" 
                          size="small" 
                          color="success" 
                          variant="filled"
                          sx={{ 
                            fontWeight: 700,
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.7 }
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="success.dark" sx={{ textAlign: 'center', fontWeight: 600, mb: 0.5 }}>
                        🔄 Fresh scraping threat intelligence from multiple sources...
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                        📊 Cached data shown below while fetching latest threats
                      </Typography>
                    </Box>
                  )}
                  
                  <List sx={{ 
                    opacity: threatIntelLoading ? 0.8 : 1,
                    transition: 'opacity 0.3s ease',
                    minHeight: 350,
                    padding: 0
                  }} id="threats-list">
                    {paginatedThreatIntel.map((threat, index) => (
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
                              <Chip
                                label={threat.classification.severity.toUpperCase()}
                                size="small"
                                color={getSeverityColor(threat.classification.severity)}
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
                                {threat.classification.exploit_type && (
                                  <Typography variant="caption" color="text.secondary">
                                    Type: {threat.classification.exploit_type}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < paginatedThreatIntel.length - 1 && <Divider />}
                    </div>
                  ))}
                  </List>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                      <Stack spacing={2}>
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                          size="large"
                          showFirstButton
                          showLastButton
                        />
                        <Typography variant="caption" color="text.secondary" align="center">
                          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedThreatIntel.length)}-{Math.min(currentPage * itemsPerPage, sortedThreatIntel.length)} of {sortedThreatIntel.length} threats
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8, 
                  minHeight: 400,
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  {/* Loading overlay for empty state - Enhanced */}
                  {threatIntelLoading && (
                    <Box sx={{ 
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      right: 20,
                      zIndex: 10,
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.15) 100%)', 
                      borderRadius: 2, 
                      p: 3,
                      border: '2px solid rgba(76, 175, 80, 0.3)',
                      backdropFilter: 'blur(3px)',
                      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                        <LinearProgress 
                          color="success" 
                          sx={{ 
                            flex: 1, 
                            height: 6, 
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              background: 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                            }
                          }} 
                        />
                        <Chip 
                          label="🔴 LIVE SCRAPING" 
                          size="small" 
                          color="success" 
                          variant="filled"
                          sx={{ 
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.7 }
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="success.dark" sx={{ textAlign: 'center', fontWeight: 600 }}>
                        🔄 Fresh scraping threat intelligence...
                      </Typography>
                    </Box>
                  )}
                  
                  <Security sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    {threatIntelLoading ? 'Loading Fresh Threat Data...' : 'No Threat Data Available'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loading || threatIntelLoading ? 'Scraping latest threat intelligence from multiple sources...' : 'Check your connection to the threat intelligence service.'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar Analytics */}
        <Grid item xs={12} lg={4}>
          {/* Top Affected Protocols */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                Most Mentioned Protocols
              </Typography>
              {topProtocolsList.length > 0 ? (
                <List dense>
                  {topProtocolsList.map(([protocol, count]) => (
                    <ListItem key={protocol} sx={{ px: 0 }}>
                      <ListItemText
                        primary={protocol}
                        secondary={`${count} mentions`}
                      />
                      <Chip label={count} size="small" color="primary" />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No protocol data available
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Threat Distribution */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Threat Severity Distribution
              </Typography>
              <Box sx={{ space: 2 }}>
                {['critical', 'high', 'medium', 'low'].map((severity) => {
                  const count = sortedThreatIntel.filter(t => t.classification.severity === severity).length;
                  const percentage = sortedThreatIntel.length > 0 ? (count / sortedThreatIntel.length) * 100 : 0;
                  
                  return (
                    <Box key={severity} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {severity}
                        </Typography>
                        <Typography variant="body2">
                          {count} ({percentage.toFixed(0)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={getSeverityColor(severity) as any}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThreatIntelligence;
