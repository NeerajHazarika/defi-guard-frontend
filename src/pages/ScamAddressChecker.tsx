import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
} from '@mui/material';
import {
  Security,
  Search,
  CheckCircle,
  Warning,
  Error,
  ContentCopy,
  Clear,
  OpenInNew,
} from '@mui/icons-material';
import { scamDetectorApi } from '../services/api';
import type { ScamAddressResponse } from '../types';
import MetricCard from '../components/MetricCard';

const ScamAddressChecker: React.FC = () => {
  const [address, setAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState<string>('auto');
  const [result, setResult] = useState<ScamAddressResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportedChains = [
    { value: 'auto', label: 'Auto-detect' },
    { value: 'btc', label: 'Bitcoin (BTC)' },
    { value: 'eth', label: 'Ethereum (ETH)' },
    { value: 'trx', label: 'Tron (TRX)' },
    { value: 'sol', label: 'Solana (SOL)' },
  ];

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'clean': return 'success';
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getRiskScoreColor = (reportCount: string): string => {
    const count = parseInt(reportCount) || 0;
    if (count === 0) return '#4CAF50';
    if (count <= 5) return '#FF9800';
    if (count <= 10) return '#FF5722';
    return '#F44336';
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'clean': return <CheckCircle />;
      case 'low': return <CheckCircle />;
      case 'medium': return <Warning />;
      case 'high': return <Error />;
      default: return <Security />;
    }
  };

  const isValidAddress = (addr: string): boolean => {
    if (!addr || addr.length < 25) return false;
    
    const bitcoinLegacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const bitcoinSegwit = /^bc1[a-z0-9]{39,59}$/;
    const bitcoinTestnet = /^[mn2][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const ethereum = /^0x[a-fA-F0-9]{40}$/;
    const tron = /^T[A-Za-z1-9]{33}$/;
    const solana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    
    return bitcoinLegacy.test(addr) || bitcoinSegwit.test(addr) || 
           bitcoinTestnet.test(addr) || ethereum.test(addr) || 
           tron.test(addr) || solana.test(addr) ||
           addr.length >= 25;
  };

  const handleAddressScreening = useCallback(async () => {
    if (!address.trim()) {
      setError('Please enter a blockchain address');
      return;
    }

    if (!isValidAddress(address.trim())) {
      setError('Please enter a valid blockchain address');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await scamDetectorApi.checkAddress(address.trim());
      
      if ('error' in response) {
        setError(response.error || 'Unknown error occurred');
      } else {
        setResult(response);
      }
    } catch (err) {
      const errorMessage = (err as Error)?.message || 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Scam address screening error:', err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openInExplorer = (address: string, network?: string) => {
    let explorerUrl = '';
    const networkType = network?.toLowerCase() || selectedChain?.toLowerCase();
    
    switch (networkType) {
      case 'btc':
      case 'bitcoin':
        explorerUrl = `https://blockstream.info/address/${address}`;
        break;
      case 'eth':
      case 'ethereum':
        explorerUrl = `https://etherscan.io/address/${address}`;
        break;
      case 'trx':
      case 'tron':
        explorerUrl = `https://tronscan.org/#/address/${address}`;
        break;
      case 'sol':
      case 'solana':
        explorerUrl = `https://explorer.solana.com/address/${address}`;
        break;
      default:
        if (address.startsWith('0x')) {
          explorerUrl = `https://etherscan.io/address/${address}`;
        } else if (address.startsWith('T') && address.length === 34) {
          explorerUrl = `https://tronscan.org/#/address/${address}`;
        } else if (address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
          explorerUrl = `https://explorer.solana.com/address/${address}`;
        } else {
          explorerUrl = `https://blockstream.info/address/${address}`;
        }
    }
    
    if (explorerUrl) {
      window.open(explorerUrl, '_blank');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Scam Address Checker
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
        Check blockchain addresses across multiple networks (Bitcoin, Ethereum, Tron, Solana) for known scams, fraudulent activities, and security threats
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" />
                Multi-Chain Address Screening
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                ✅ Supports Bitcoin (BTC), Ethereum (ETH), Tron (TRX), and Solana (SOL) addresses
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Blockchain Address"
                    placeholder="Enter address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa, 0x742d35Cc..., TMuA6YqfCeX8..., etc."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      endAdornment: address && (
                        <IconButton onClick={() => setAddress('')} size="small">
                          <Clear />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Chain</InputLabel>
                    <Select
                      value={selectedChain}
                      onChange={(e) => setSelectedChain(e.target.value)}
                      label="Chain"
                    >
                      {supportedChains.map((chain) => (
                        <MenuItem key={chain.value} value={chain.value}>
                          {chain.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                onClick={handleAddressScreening}
                disabled={loading || !address.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                sx={{ mb: 2 }}
              >
                {loading ? 'Checking Address...' : 'Check Address for Scams'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {result && (
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Scam Check Result</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Copy address">
                          <IconButton onClick={() => copyToClipboard(result.address)} size="small">
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View in explorer">
                          <IconButton onClick={() => openInExplorer(result.address, result.network)} size="small">
                            <OpenInNew />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6} md={3}>
                        <MetricCard
                          title="Risk Level"
                          value={result.riskLevel || 'Unknown'}
                          color={getRiskLevelColor(result.riskLevel || 'unknown')}
                          subtitle={result.network ? `${result.network.toUpperCase()} address` : 'Address'}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <MetricCard
                          title="Report Count"
                          value={result.reportCount || '0'}
                          color={getRiskScoreColor(result.reportCount || '0')}
                          subtitle="fraud reports"
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <MetricCard
                          title="Network"
                          value={result.network || 'Unknown'}
                          color="#2196F3"
                          subtitle="blockchain network"
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <MetricCard
                          title="Status"
                          value={result.riskLevel === 'Clean' || result.riskLevel === 'Low' ? 'Safe' : 'Risky'}
                          color={result.riskLevel === 'Clean' || result.riskLevel === 'Low' ? '#4CAF50' : '#FF5722'}
                          subtitle="safety status"
                        />
                      </Grid>
                    </Grid>

                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Address:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        wordBreak: 'break-all', 
                        backgroundColor: 'grey.100', 
                        p: 1, 
                        borderRadius: 1,
                        mb: 2
                      }}
                    >
                      {result.address}
                    </Typography>

                    {result.network && (
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Blockchain Network:
                        </Typography>
                        <Chip 
                          label={result.network.toUpperCase()} 
                          color="primary" 
                          variant="outlined" 
                          sx={{ mb: 2 }}
                        />
                      </>
                    )}

                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Risk Assessment:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {getRiskLevelIcon(result.riskLevel)}
                      <Chip 
                        label={result.riskLevel} 
                        color={getRiskLevelColor(result.riskLevel)} 
                        variant="filled"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Based on {result.reportCount} fraud report(s)
                      </Typography>
                    </Box>

                    {result.srcUrl && (
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Data Source:
                        </Typography>
                        <Link 
                          href={result.srcUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ mb: 2, display: 'inline-block' }}
                        >
                          View detailed report
                        </Link>
                      </>
                    )}

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Checked at {new Date().toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" />
                About Scam Detection
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Supported Blockchains:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      • <strong>Bitcoin (BTC)</strong> - Legacy, SegWit, and Taproot addresses
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      • <strong>Ethereum (ETH)</strong> - Standard and contract addresses
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      • <strong>Tron (TRX)</strong> - Standard addresses and smart contracts
                    </Typography>
                    <Typography variant="body2">
                      • <strong>Solana (SOL)</strong> - Standard addresses and program accounts
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Risk Levels:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CheckCircle color="success" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Clean / Low Risk</strong> - No or minimal fraud reports
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Warning color="warning" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Medium Risk</strong> - Some fraud reports, use caution
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Error color="error" fontSize="small" />
                      <Typography variant="body2">
                        <strong>High Risk</strong> - Multiple fraud reports, avoid transactions
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScamAddressChecker;
