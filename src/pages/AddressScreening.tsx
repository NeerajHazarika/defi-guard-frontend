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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Security,
  Search,
  CheckCircle,
  ExpandMore,
  ContentCopy,
  Clear,
  Upload,
  Receipt,
} from '@mui/icons-material';
import { apiService } from '../services/api';
import type { 
  AddressScreeningResult, 
  BulkScreeningRequest, 
  BulkScreeningResponse,
  SanctionMatch,
  TransactionScreeningResult,
  TransactionScreeningRequest 
} from '../services/api';
import MetricCard from '../components/MetricCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`screening-tabpanel-${index}`}
      aria-labelledby={`screening-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AddressScreening: React.FC = () => {
  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // Single address screening state
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const isValidTransactionHash = (hash: string): boolean => {
    // Bitcoin transaction hash is 64 hex characters
    return /^[a-fA-F0-9]{64}$/.test(hash);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      case 'CRITICAL': return 'error';
      default: return 'default';
    }
  };

  const getRiskScoreColor = (score: number): string => {
    if (score <= 25) return '#4CAF50';
    if (score <= 50) return '#FF9800';
    if (score <= 75) return '#FF5722';
    return '#F44336';
  };

  const isValidAddress = (addr: string): boolean => {
    // Basic blockchain address validation (supports various formats)
    const bitcoinLegacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const bitcoinSegwit = /^bc1[a-z0-9]{39,59}$/;
    const bitcoinTestnet = /^[mn2][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const ethereum = /^0x[a-fA-F0-9]{40}$/;
    
    return bitcoinLegacy.test(addr) || bitcoinSegwit.test(addr) || 
           bitcoinTestnet.test(addr) || ethereum.test(addr) || 
           addr.length >= 25; // Allow other blockchain formats
  };

  const handleSingleScreening = useCallback(async () => {
    if (!address.trim()) {
      setSingleError('Please enter a blockchain address');
      return;
    }

    if (!isValidAddress(address.trim())) {
      setSingleError('Please enter a valid blockchain address');
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
      const errorMessage = String(err);
      setSingleError(errorMessage);
      console.error('Address screening error:', err);
    } finally {
      setSingleLoading(false);
    }
  }, [address, includeTransactionAnalysis, maxHops]);

  const handleTransactionScreening = useCallback(async () => {
    if (!txHash.trim()) {
      setTxError('Please enter a transaction hash');
      return;
    }

    if (!isValidTransactionHash(txHash.trim())) {
      setTxError('Please enter a valid Bitcoin transaction hash (64 hex characters)');
      return;
    }

    setTxLoading(true);
    setTxError(null);
    setTxResult(null);

    try {
      const request: TransactionScreeningRequest = {
        txHash: txHash.trim(),
        direction: txDirection,
        includeMetadata,
      };

      const result = await apiService.screenTransaction(request);
      setTxResult(result);
    } catch (err) {
      const errorMessage = String(err);
      setTxError(errorMessage);
      console.error('Transaction screening error:', err);
    } finally {
      setTxLoading(false);
    }
  }, [txHash, txDirection, includeMetadata]);

  const handleBulkScreening = useCallback(async () => {
    const addresses = bulkAddresses
      .split('\n')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);

    const transactions = bulkTransactions
      .split('\n')
      .map(tx => tx.trim())
      .filter(tx => tx.length > 0);

    if (addresses.length === 0 && transactions.length === 0) {
      setBulkError('Please enter at least one blockchain address or Bitcoin transaction hash');
      return;
    }

    if (addresses.length > 100) {
      setBulkError('Maximum 100 addresses allowed per batch');
      return;
    }

    if (transactions.length > 50) {
      setBulkError('Maximum 50 transactions allowed per batch');
      return;
    }

    // Validate addresses
    if (addresses.length > 0) {
      const invalidAddresses = addresses.filter(addr => !isValidAddress(addr));
      if (invalidAddresses.length > 0) {
        setBulkError(`Invalid blockchain addresses: ${invalidAddresses.slice(0, 3).join(', ')}${invalidAddresses.length > 3 ? '...' : ''}`);
        return;
      }
    }

    // Validate transaction hashes
    if (transactions.length > 0) {
      const invalidTransactions = transactions.filter(tx => !isValidTransactionHash(tx));
      if (invalidTransactions.length > 0) {
        setBulkError(`Invalid transaction hashes: ${invalidTransactions.slice(0, 3).join(', ')}${invalidTransactions.length > 3 ? '...' : ''}`);
        return;
      }
    }

    setBulkLoading(true);
    setBulkError(null);
    setBulkResult(null);

    try {
      const request: BulkScreeningRequest = {
        ...(addresses.length > 0 && { addresses }),
        ...(transactions.length > 0 && { transactions }),
        batchId: `batch_${Date.now()}`,
        includeTransactionAnalysis
      };

      const result = await apiService.bulkScreening(request);
      setBulkResult(result);
    } catch (err) {
      const errorMessage = String(err);
      setBulkError(errorMessage);
      console.error('Bulk screening error:', err);
    } finally {
      setBulkLoading(false);
    }
  }, [bulkAddresses, bulkTransactions, includeTransactionAnalysis]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderSanctionMatches = (matches: SanctionMatch[]) => {
    if (matches.length === 0) {
      return (
        <Chip 
          icon={<CheckCircle />} 
          label="No sanctions found" 
          color="success" 
          size="small" 
        />
      );
    }

    return (
      <List dense>
        {matches.map((match, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" color="error">
                    {match.entityName}
                  </Typography>
                  <Chip 
                    label={match.listSource} 
                    size="small" 
                    color="error" 
                    variant="outlined"
                  />
                  <Chip 
                    label={match.matchType} 
                    size="small" 
                    color="warning" 
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Entity ID: {match.entityId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confidence: {match.confidence}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    Address: {match.matchedAddress}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        OFAC & Sanctions Screening
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
        Screen blockchain addresses (Bitcoin, Ethereum, BSC, Polygon, etc.) and Bitcoin transactions against OFAC sanctions and other watchlists for compliance monitoring
      </Typography>

      <Grid container spacing={3}>
        {/* Settings Panel */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" />
                Screening Options
              </Typography>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeTransactionAnalysis}
                        onChange={(e) => setIncludeTransactionAnalysis(e.target.checked)}
                      />
                    }
                    label="Include Multi-hop Transaction Analysis"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Analyze transaction patterns and multi-hop connections
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Analysis Depth (Max Hops): {maxHops}
                  </Typography>
                  <Slider
                    value={maxHops}
                    onChange={(_, value) => setMaxHops(value as number)}
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                    disabled={!includeTransactionAnalysis}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Screening Tabs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="fullWidth"
                sx={{ mb: 2 }}
              >
                <Tab label="Address Screening" />
                <Tab label="Transaction Screening" />
                <Tab label="Bulk Screening" />
              </Tabs>

              {/* Address Screening Tab */}
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Search color="primary" />
                  Single Address Screening
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                  ✅ Supports any blockchain address (Bitcoin, Ethereum, BSC, Polygon, etc.)
                </Typography>

                <TextField
                  fullWidth
                  label="Blockchain Address"
                  placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa or 0x742d35Cc6734FdADCaF1EA54eB2e8818c5D0A0B6"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: address && (
                      <IconButton onClick={() => setAddress('')} size="small">
                        <Clear />
                      </IconButton>
                    ),
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSingleScreening}
                  disabled={singleLoading || !address.trim()}
                  startIcon={singleLoading ? <CircularProgress size={20} /> : <Search />}
                  sx={{ mb: 2 }}
                >
                  {singleLoading ? 'Screening...' : 'Screen Address'}
                </Button>

                {singleError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {singleError}
                  </Alert>
                )}

                {singleResult && (
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Screening Result</Typography>
                        <Tooltip title="Copy address">
                          <IconButton onClick={() => copyToClipboard(singleResult.address)} size="small">
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <MetricCard
                            title="Risk Score"
                            value={(singleResult?.riskScore ?? 0).toString()}
                            color={getRiskScoreColor(singleResult?.riskScore ?? 0)}
                            subtitle={`out of 100`}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MetricCard
                            title="Risk Level"
                            value={singleResult.riskLevel}
                            color={getRiskLevelColor(singleResult.riskLevel)}
                            subtitle={`${singleResult.confidence}% confidence`}
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
                        {singleResult.address}
                      </Typography>

                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Sanction Matches:
                      </Typography>
                      {renderSanctionMatches(singleResult.sanctionMatches)}

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Processed in {singleResult.processingTimeMs}ms • {new Date(singleResult.timestamp).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </TabPanel>

              {/* Transaction Screening Tab */}
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Receipt color="primary" />
                  Transaction Screening
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'warning.main', fontStyle: 'italic' }}>
                  ⚠️ Bitcoin transactions only (requires Bitcoin transaction IDs)
                </Typography>

                <TextField
                  fullWidth
                  label="Bitcoin Transaction Hash"
                  placeholder="0000000000000000000...0000000000000000006c"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: txHash && (
                      <IconButton onClick={() => setTxHash('')} size="small">
                        <Clear />
                      </IconButton>
                    ),
                  }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Transaction Direction</InputLabel>
                  <Select
                    value={txDirection}
                    onChange={(e) => setTxDirection(e.target.value as 'inputs' | 'outputs' | 'both')}
                    label="Transaction Direction"
                  >
                    <MenuItem value="inputs">Inputs Only</MenuItem>
                    <MenuItem value="outputs">Outputs Only</MenuItem>
                    <MenuItem value="both">Both Inputs & Outputs</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={includeMetadata}
                      onChange={(e) => setIncludeMetadata(e.target.checked)}
                    />
                  }
                  label="Include Metadata"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                  Include additional metadata in the analysis
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleTransactionScreening}
                  disabled={txLoading || !txHash.trim()}
                  startIcon={txLoading ? <CircularProgress size={20} /> : <Search />}
                  sx={{ mb: 2 }}
                >
                  {txLoading ? 'Screening...' : 'Screen Transaction'}
                </Button>

                {txError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {txError}
                  </Alert>
                )}

                {txResult && (
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Transaction Screening Result</Typography>
                        <Tooltip title="Copy transaction hash">
                          <IconButton onClick={() => copyToClipboard(txResult.txHash)} size="small">
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <MetricCard
                            title="Overall Risk Score"
                            value={(txResult?.overallRiskScore ?? 0).toString()}
                            color={getRiskScoreColor(txResult?.overallRiskScore ?? 0)}
                            subtitle={`out of 100`}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MetricCard
                            title="Risk Level"
                            value={txResult.overallRiskLevel}
                            color={getRiskLevelColor(txResult.overallRiskLevel)}
                            subtitle={`${txResult.confidence}% confidence`}
                          />
                        </Grid>
                      </Grid>

                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Transaction Hash:
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
                        {txResult.txHash}
                      </Typography>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle2">
                            Input Addresses ({txResult.inputAddresses?.length || 0})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {txResult.inputAddresses && txResult.inputAddresses.length > 0 ? (
                            <List dense>
                              {txResult.inputAddresses.map((addr, index) => (
                                <ListItem key={index} divider>
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                          {addr.address}
                                        </Typography>
                                        <Chip 
                                          label={addr.riskLevel} 
                                          size="small" 
                                          color={getRiskLevelColor(addr.riskLevel)} 
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                          Score: {addr.riskScore}
                                        </Typography>
                                      </Box>
                                    }
                                    secondary={
                                      addr.sanctionMatches.length > 0 ? (
                                        <Typography variant="body2" color="error">
                                          {addr.sanctionMatches.length} sanction match(es)
                                        </Typography>
                                      ) : (
                                        <Typography variant="body2" color="success.main">
                                          No sanctions
                                        </Typography>
                                      )
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No input addresses found
                            </Typography>
                          )}
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle2">
                            Output Addresses ({txResult.outputAddresses?.length || 0})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {txResult.outputAddresses && txResult.outputAddresses.length > 0 ? (
                            <List dense>
                              {txResult.outputAddresses.map((addr, index) => (
                                <ListItem key={index} divider>
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                          {addr.address}
                                        </Typography>
                                        <Chip 
                                          label={addr.riskLevel} 
                                          size="small" 
                                          color={getRiskLevelColor(addr.riskLevel)} 
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                          Score: {addr.riskScore}
                                        </Typography>
                                      </Box>
                                    }
                                    secondary={
                                      addr.sanctionMatches.length > 0 ? (
                                        <Typography variant="body2" color="error">
                                          {addr.sanctionMatches.length} sanction match(es)
                                        </Typography>
                                      ) : (
                                        <Typography variant="body2" color="success.main">
                                          No sanctions
                                        </Typography>
                                      )
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No output addresses found
                            </Typography>
                          )}
                        </AccordionDetails>
                      </Accordion>

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Processed in {txResult.processingTimeMs}ms • {new Date(txResult.timestamp).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </TabPanel>

              {/* Bulk Screening Tab */}
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Upload color="primary" />
                  Bulk Screening
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                  📍 Addresses: Any blockchain (Bitcoin, Ethereum, BSC, Polygon, etc.) • Transactions: Bitcoin only
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      label="Blockchain Addresses (one per line)"
                      placeholder={`1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\n0x742d35Cc6734FdADCaF1EA54eB2e8818c5D0A0B6\n3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy`}
                      value={bulkAddresses}
                      onChange={(e) => setBulkAddresses(e.target.value)}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      helperText={`${bulkAddresses.split('\n').filter(addr => addr.trim()).length}/100 addresses`}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      label="Bitcoin Transaction Hashes (one per line)"
                      placeholder={`3e3ba6255653315994b6b84adb7d2a0d9cb7b4eef5c4a86d3c8b1d7e6f4a9b2c\n0000000000000000001ae8c72d0b25f8cc05e9d0d0cc16985a29fd4a7a7e45b`}
                      value={bulkTransactions}
                      onChange={(e) => setBulkTransactions(e.target.value)}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      helperText={`${bulkTransactions.split('\n').filter(tx => tx.trim()).length}/50 transactions`}
                    />
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleBulkScreening}
                  disabled={bulkLoading || (!bulkAddresses.trim() && !bulkTransactions.trim())}
                  startIcon={bulkLoading ? <CircularProgress size={20} /> : <Upload />}
                  sx={{ mb: 2 }}
                >
                  {bulkLoading ? 'Processing...' : 'Screen Bulk Items'}
                </Button>

                {bulkError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {bulkError}
                  </Alert>
                )}

                {bulkResult && (
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Bulk Screening Results
                        {bulkResult.batchId && (
                          <Typography variant="body2" color="text.secondary">
                            Batch ID: {bulkResult.batchId}
                          </Typography>
                        )}
                      </Typography>

                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                          <MetricCard
                            title="Total Processed"
                            value={(bulkResult?.summary?.totalProcessed ?? 0).toString()}
                            color="#2196F3"
                            subtitle="items"
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <MetricCard
                            title="High Risk"
                            value={(bulkResult?.summary?.highRiskCount ?? 0).toString()}
                            color="#FF5722"
                            subtitle="items"
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <MetricCard
                            title="Sanction Matches"
                            value={(bulkResult?.summary?.sanctionMatchesCount ?? 0).toString()}
                            color="#F44336"
                            subtitle="total"
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <MetricCard
                            title="Processing Time"
                            value={`${bulkResult?.summary?.processingTimeMs ?? 0}ms`}
                            color="#4CAF50"
                            subtitle=""
                          />
                        </Grid>
                      </Grid>

                      {/* Address Results */}
                      {bulkResult.results.addresses && bulkResult.results.addresses.length > 0 && (
                        <Accordion defaultExpanded>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="subtitle1">
                              Address Results ({bulkResult.results.addresses.length})
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <TableContainer component={Paper} variant="outlined">
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Risk Level</TableCell>
                                    <TableCell>Risk Score</TableCell>
                                    <TableCell>Sanctions</TableCell>
                                    <TableCell>Confidence</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {bulkResult.results.addresses.map((result, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        <Typography 
                                          variant="body2" 
                                          sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                        >
                                          {result.address.substring(0, 20)}...
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={result.riskLevel}
                                          size="small"
                                          color={getRiskLevelColor(result.riskLevel)}
                                        />
                                      </TableCell>
                                      <TableCell>{result.riskScore}</TableCell>
                                      <TableCell>
                                        <Chip
                                          label={result.sanctionMatches?.length || 0}
                                          size="small"
                                          color={result.sanctionMatches?.length > 0 ? 'error' : 'success'}
                                        />
                                      </TableCell>
                                      <TableCell>{result.confidence}%</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </AccordionDetails>
                        </Accordion>
                      )}

                      {/* Transaction Results */}
                      {bulkResult.results.transactions && bulkResult.results.transactions.length > 0 && (
                        <Accordion defaultExpanded sx={{ mt: 2 }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="subtitle1">
                              Transaction Results ({bulkResult.results.transactions.length})
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <TableContainer component={Paper} variant="outlined">
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Transaction Hash</TableCell>
                                    <TableCell>Risk Level</TableCell>
                                    <TableCell>Risk Score</TableCell>
                                    <TableCell>Sanctions</TableCell>
                                    <TableCell>Confidence</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {bulkResult.results.transactions.map((result, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        <Typography 
                                          variant="body2" 
                                          sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                        >
                                          {result.txHash.substring(0, 20)}...
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={result.overallRiskLevel}
                                          size="small"
                                          color={getRiskLevelColor(result.overallRiskLevel)}
                                        />
                                      </TableCell>
                                      <TableCell>{result.overallRiskScore}</TableCell>
                                      <TableCell>
                                        <Chip
                                          label={result.sanctionMatchesCount || 0}
                                          size="small"
                                          color={result.sanctionMatchesCount > 0 ? 'error' : 'success'}
                                        />
                                      </TableCell>
                                      <TableCell>{result.confidence}%</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </AccordionDetails>
                        </Accordion>
                      )}

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Completed at {new Date(bulkResult?.timestamp || '').toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressScreening;
