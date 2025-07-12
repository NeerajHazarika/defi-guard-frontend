import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  AlertTitle,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalance,
  Warning,
} from '@mui/icons-material';
import { useBackendData } from '../hooks/useBackendData';

const StablecoinMonitoring: React.FC = () => {
  const { 
    stablecoins, 
    stablecoinAlerts,
    loading,
  } = useBackendData();

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <AccountBalance sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Stablecoin Monitoring
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Real-time stablecoin price tracking and security alerts
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 400,
          gap: 2
        }}>
          <CircularProgress size={40} color="primary" />
          <Typography variant="body1" color="text.secondary">
            Loading stablecoin monitoring data...
          </Typography>
        </Box>
      )}

      {/* Content */}
      <Grid container spacing={3}>
        {/* Stablecoin Alerts */}
        {!loading && stablecoinAlerts.length > 0 && (
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
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {stablecoinAlerts.map((alert) => (
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

        {/* Stablecoin Price Monitoring */}
        {!loading && stablecoins.length > 0 && (
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
                  {stablecoins.map((coin) => (
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

        {/* No Data State */}
        {!loading && stablecoinAlerts.length === 0 && stablecoins.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
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
                    No Stablecoin Data Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Unable to load stablecoin monitoring data. Please check your connection to the backend services.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StablecoinMonitoring;
