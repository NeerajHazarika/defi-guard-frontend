import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Button,
  Paper,
  LinearProgress,
  Alert,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CenterFocusStrong as CenterIcon,
} from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BackendCountry {
  id: number;
  name: string;
  code: string;
  region: string;
  crypto_friendly: boolean;
  regulatory_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface Country {
  name: string;
  code: string;
  status: 'banned' | 'restricted' | 'regulated' | 'unregulated' | 'friendly';
  coordinates: [number, number];
  region: string;
  cryptoFriendly: boolean;
  description: string;
  lastUpdated: string;
}

const GlobalStablecoinMapNew: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showTooltips, setShowTooltips] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Complete coordinate mapping for all countries in backend
  const countryCoordinates: { [key: string]: [number, number] } = {
    'US': [39.8283, -98.5795],
    'CA': [56.1304, -106.3468],
    'MX': [23.6345, -102.5528],
    'BR': [-14.2350, -51.9253],
    'AR': [-38.4161, -63.6167],
    'BO': [-16.2902, -63.5887],
    'EC': [-1.8312, -78.1834],
    'SV': [13.7942, -88.8965],
    'GB': [55.3781, -3.4360],
    'DE': [51.1657, 10.4515],
    'FR': [46.6034, 1.8883],
    'IT': [41.8719, 12.5674],
    'ES': [40.4637, -3.7492],
    'PT': [39.3999, -8.2245],
    'NL': [52.1326, 5.2913],
    'CH': [46.8182, 8.2275],
    'LU': [49.8153, 6.1296],
    'MT': [35.9375, 14.3754],
    'EE': [58.5953, 25.0136],
    'SE': [60.1282, 18.6435],
    'NO': [60.4720, 8.4689],
    'DK': [56.2639, 9.5018],
    'FI': [61.9241, 25.7482],
    'RU': [61.5240, 105.3188],
    'TR': [38.9637, 35.2433],
    'CN': [35.8617, 104.1954],
    'JP': [36.2048, 138.2529],
    'KR': [35.9078, 127.7669],
    'IN': [20.5937, 78.9629],
    'SG': [1.3521, 103.8198],
    'MY': [4.2105, 101.9758],
    'TH': [15.8700, 100.9925],
    'VN': [14.0583, 108.2772],
    'PH': [12.8797, 121.7740],
    'ID': [-0.7893, 113.9213],
    'AU': [-25.2744, 133.7751],
    'BD': [23.6850, 90.3563],
    'NP': [28.3949, 84.1240],
    'AE': [23.4241, 53.8478],
    'BH': [26.0667, 50.5577],
    'IR': [32.4279, 53.6880],
    'IQ': [33.2232, 43.6793],
    'MA': [31.7917, -7.0926],
    'DZ': [28.0339, 1.6596],
    'ZA': [-30.5595, 22.9375],
  };

  // Fetch countries directly from backend
  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use environment variable or fallback to localhost
      const apiUrl = import.meta.env.VITE_STABLECOIN_OSINT_API_URL || 'http://localhost:8080';
      const endpoint = `${apiUrl}/api/v1/countries/`;
      
      console.log('🔄 Fetching countries from backend...', endpoint);
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const backendCountries: BackendCountry[] = data.data?.countries || [];
      
      console.log('📊 Backend response:', {
        success: data.success,
        total: backendCountries.length,
        sampleCodes: backendCountries.slice(0, 5).map(c => c.code)
      });

      // Transform backend data to map format
      const transformedCountries: Country[] = backendCountries
        .filter(country => countryCoordinates[country.code]) // Only countries with coordinates
        .map(country => ({
          name: country.name,
          code: country.code,
          status: country.regulatory_status as Country['status'],
          coordinates: countryCoordinates[country.code],
          region: country.region,
          cryptoFriendly: country.crypto_friendly,
          description: country.notes || `${country.crypto_friendly ? 'Crypto-friendly' : 'Restrictive'} regulatory environment in ${country.name}`,
          lastUpdated: country.updated_at
        }));

      console.log('✅ Transformed countries:', {
        total: transformedCountries.length,
        withCoordinates: transformedCountries.length,
        missingCoordinates: backendCountries.length - transformedCountries.length,
        countryCodes: transformedCountries.map(c => c.code).sort()
      });

      setCountries(transformedCountries);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Error fetching countries:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'friendly': return '#4caf50';
      case 'regulated': return '#2196f3';
      case 'unregulated': return '#ff9800';
      case 'restricted': return '#f57c00';
      case 'banned': return '#f44336';
      default: return '#e0e0e0';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'friendly': return '✅';
      case 'regulated': return '📋';
      case 'unregulated': return '⚪';
      case 'restricted': return '⚠️';
      case 'banned': return '🚫';
      default: return '⚫';
    }
  };

  const initializeMap = () => {
    if (mapContainerRef.current && !mapRef.current && countries.length > 0) {
      console.log('🗺️ Initializing map with', countries.length, 'countries');
      
      try {
        // Create map
        const map = L.map(mapContainerRef.current).setView([20, 0], 2);
        mapRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Add country markers
        countries.forEach((country) => {
          const icon = L.divIcon({
            html: `
              <div style="
                background-color: ${getStatusColor(country.status)};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
              ">
                ${getStatusIcon(country.status)}
              </div>
            `,
            className: 'custom-div-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker(country.coordinates, { icon })
            .addTo(map)
            .on('click', () => {
              setSelectedCountry(country);
              map.setView(country.coordinates, 6);
            });

          if (showTooltips) {
            marker.bindTooltip(`
              <div style="font-family: Arial, sans-serif;">
                <strong>${country.name}</strong><br/>
                Status: ${country.status.replace('-', ' ').toUpperCase()}<br/>
                Region: ${country.region}
              </div>
            `, {
              permanent: false,
              direction: 'top',
              offset: [0, -10]
            });
          }
        });
        
        console.log('✅ Map initialized successfully with', countries.length, 'markers');
      } catch (err) {
        console.error('❌ Error initializing map:', err);
        setError('Failed to initialize map');
      }
    } else if (countries.length === 0) {
      console.log('⚠️ Cannot initialize map: no countries data');
    }
  };

  const refreshMap = () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      setTimeout(initializeMap, 100);
    }
  };

  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2);
      setSelectedCountry(null);
    }
  };

  const getStats = () => {
    return {
      total: countries.length,
      friendly: countries.filter(c => c.status === 'friendly').length,
      regulated: countries.filter(c => c.status === 'regulated').length,
      restricted: countries.filter(c => c.status === 'restricted').length,
      banned: countries.filter(c => c.status === 'banned').length,
      unregulated: countries.filter(c => c.status === 'unregulated').length,
    };
  };

  // Initial data fetch
  useEffect(() => {
    fetchCountries();
  }, []);

  // Initialize map when countries data changes
  useEffect(() => {
    if (countries.length > 0 && mapContainerRef.current) {
      refreshMap();
    }
  }, [countries, showTooltips]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const stats = getStats();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          🌍 Global Stablecoin Regulatory Map
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Real-time regulatory status tracking across {countries.length} countries
        </Typography>
      </Box>

      {/* Status & Controls */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">📊 Data Status</Typography>
                <Button
                  onClick={fetchCountries}
                  disabled={loading}
                  startIcon={<RefreshIcon />}
                  size="small"
                >
                  Refresh Data
                </Button>
              </Box>
              
              {loading && <LinearProgress sx={{ mb: 2 }} />}
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Error loading data: {error}
                </Alert>
              )}
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'success.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.contrastText' }}>
                      {stats.friendly}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'success.contrastText' }}>
                      Friendly
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'primary.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.contrastText' }}>
                      {stats.regulated}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'primary.contrastText' }}>
                      Regulated
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'warning.light' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.contrastText' }}>
                      {stats.restricted + stats.banned}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'warning.contrastText' }}>
                      Restricted/Banned
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'grey.300' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="caption">
                      Total Countries
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>🌍 Focus on Country</InputLabel>
                <Select
                  value={selectedCountry?.name || ''}
                  label="🌍 Focus on Country"
                  onChange={(e) => {
                    const country = countries.find(c => c.name === e.target.value);
                    if (country && mapRef.current) {
                      setSelectedCountry(country);
                      mapRef.current.setView(country.coordinates, 6);
                    }
                  }}
                >
                  <MenuItem value="">Select a country</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.name}>
                      {getStatusIcon(country.status)} {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showTooltips}
                    onChange={(e) => setShowTooltips(e.target.checked)}
                    size="small"
                  />
                }
                label="Show Tooltips"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Map */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">🗺️ Interactive World Map</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Reset View">
                <IconButton onClick={resetMapView} size="small">
                  <CenterIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh Map">
                <IconButton onClick={refreshMap} size="small">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box
            ref={mapContainerRef}
            sx={{
              height: 600,
              width: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        </CardContent>
      </Card>

      {/* Selected Country Info */}
      {selectedCountry && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📍 {selectedCountry.name} Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip
                  label={selectedCountry.status.replace('-', ' ').toUpperCase()}
                  icon={<span>{getStatusIcon(selectedCountry.status)}</span>}
                  sx={{
                    backgroundColor: getStatusColor(selectedCountry.status),
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Region</Typography>
                <Typography variant="body1">{selectedCountry.region}</Typography>
              </Grid>
            </Grid>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {selectedCountry.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date(selectedCountry.lastUpdated).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>📋 Status Legend</Typography>
          <Grid container spacing={2}>
            {[
              { status: 'friendly', label: 'Crypto Friendly', color: '#4caf50' },
              { status: 'regulated', label: 'Regulated', color: '#2196f3' },
              { status: 'unregulated', label: 'Unregulated', color: '#ff9800' },
              { status: 'restricted', label: 'Restricted', color: '#f57c00' },
              { status: 'banned', label: 'Banned', color: '#f44336' },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={2.4} key={item.status}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      border: '1px solid white',
                    }}
                  />
                  <Typography variant="body2">{item.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default GlobalStablecoinMapNew;
