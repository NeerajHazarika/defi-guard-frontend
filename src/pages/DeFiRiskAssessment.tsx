import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add,
  Assessment,
  Security,
  TrendingUp,
  Groups,
  PlayArrow,
  Refresh,
  ExpandMore,
  Warning,
  OpenInNew,
  Shield,
  AccountBalanceWallet,
  People,
} from '@mui/icons-material';
import MetricCard from '../components/MetricCard';

// Types
interface Protocol {
  id: string;
  name: string;
  contractAddresses: string[];
  blockchain: string;
  tokenSymbol?: string;
  website?: string;
  documentation?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Finding {
  id: string;
  category: 'TECHNICAL' | 'GOVERNANCE' | 'LIQUIDITY' | 'REPUTATION' | 'OPERATIONAL';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  description: string;
  source: string;
  confidence: number;
  recommendation?: string;
}

interface Assessment {
  id: string;
  protocolId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  overallScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  categoryScores: {
    technical: number;
    governance: number;
    liquidity: number;
    reputation: number;
  };
  recommendations: string[];
  metadata: {
    analysisVersion: string;
    analysisDepth: string;
    executionTime: number;
    dataSourcesUsed: string[];
    warnings?: string[];
  };
  findings: Finding[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

const BLOCKCHAIN_OPTIONS = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'fantom'];
const CATEGORY_OPTIONS = ['DEX', 'LENDING', 'YIELD_FARMING', 'DERIVATIVES', 'INSURANCE', 'BRIDGE', 'DAO', 'STABLECOIN', 'NFT', 'OTHER'];
const ANALYSIS_DEPTH_OPTIONS = ['BASIC', 'STANDARD', 'COMPREHENSIVE'];

const DeFiRiskAssessment: React.FC = () => {
  // State management
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [addProtocolOpen, setAddProtocolOpen] = useState(false);
  const [createAssessmentOpen, setCreateAssessmentOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  // Form states
  const [newProtocol, setNewProtocol] = useState({
    name: '',
    contractAddresses: '',
    blockchain: 'ethereum',
    tokenSymbol: '',
    website: '',
    category: 'DEX',
    tags: ''
  });

  const [assessmentForm, setAssessmentForm] = useState({
    protocolId: '',
    analysisDepth: 'STANDARD' as 'BASIC' | 'STANDARD' | 'COMPREHENSIVE'
  });

  // API base URL - using proxy to avoid CORS issues
  // API base URL - using proxy path for Docker deployment
  const API_BASE = '/defi-api/api/v1';

  // Fetch data functions
  const fetchProtocols = async () => {
    try {
      const response = await fetch(`${API_BASE}/protocols`);
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.protocols) {
        setProtocols(data.data.protocols);
      } else {
        console.error('Invalid protocols response structure:', data);
        setError('Invalid response structure from protocols API');
      }
    } catch (err) {
      console.error('Failed to fetch protocols:', err);
      setError(`Failed to fetch protocols: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`${API_BASE}/assessments`);
      const data = await response.json();
      if (data.success) {
        setAssessments(data.data.assessments);
      }
    } catch (err) {
      console.error('Failed to fetch assessments:', err);
      setError('Failed to fetch assessments');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/protocols/stats`);
      const data = await response.json();
      if (data.success) {
        // Stats fetched successfully but not stored in state for this version
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    setLoading(true);
    setError(null); // Clear any previous errors
    Promise.all([fetchProtocols(), fetchAssessments(), fetchStats()])
      .finally(() => setLoading(false));
  }, []);

  // Create protocol
  const handleCreateProtocol = async () => {
    try {
      setLoading(true);
      const contractAddresses = newProtocol.contractAddresses
        .split(',')
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0);
      
      const tags = newProtocol.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const protocolData = {
        name: newProtocol.name,
        contractAddresses,
        blockchain: newProtocol.blockchain,
        tokenSymbol: newProtocol.tokenSymbol || undefined,
        website: newProtocol.website || undefined,
        category: newProtocol.category,
        tags: tags.length > 0 ? tags : undefined
      };

      const response = await fetch(`${API_BASE}/protocols`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(protocolData),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setAddProtocolOpen(false);
        setNewProtocol({
          name: '',
          contractAddresses: '',
          blockchain: 'ethereum',
          tokenSymbol: '',
          website: '',
          category: 'DEX',
          tags: ''
        });
        await fetchProtocols();
        await fetchStats();
        setError(null); // Clear any previous errors
      } else {
        const errorMessage = data.message || `HTTP ${response.status}: Failed to create protocol`;
        console.error('API Error:', errorMessage, data);
        
        // Provide user-friendly error messages
        if (errorMessage.includes('already exists')) {
          setError(`Protocol "${newProtocol.name}" already exists. Try using a different name or check the existing protocols list.`);
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error('Failed to create protocol:', err);
      setError('Failed to create protocol');
    } finally {
      setLoading(false);
    }
  };

  // Create assessment
  const handleCreateAssessment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentForm),
      });

      const data = await response.json();
      if (data.success) {
        setCreateAssessmentOpen(false);
        setAssessmentForm({
          protocolId: '',
          analysisDepth: 'STANDARD'
        });
        await fetchAssessments();
        // Poll for assessment completion
        pollAssessmentStatus(data.data.assessmentId);
      } else {
        setError(data.message || 'Failed to create assessment');
      }
    } catch (err) {
      console.error('Failed to create assessment:', err);
      setError('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  // Poll assessment status
  const pollAssessmentStatus = async (assessmentId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/assessments/${assessmentId}/status`);
        const data = await response.json();
        
        if (data.success) {
          const status = data.data.status;
          if (status === 'COMPLETED' || status === 'FAILED') {
            await fetchAssessments();
            return;
          }
          // Continue polling if still in progress
          setTimeout(checkStatus, 3000);
        }
      } catch (err) {
        console.error('Failed to check assessment status:', err);
      }
    };

    setTimeout(checkStatus, 3000);
  };

  // Helper functions
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      case 'CRITICAL': return 'error';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      case 'INFO': return 'default';
      default: return 'default';
    }
  };

  const getProtocolName = (protocolId: string) => {
    const protocol = protocols.find(p => p.id === protocolId);
    return protocol?.name || protocolId;
  };

  // Calculate metrics
  const metrics = {
    totalProtocols: protocols.length,
    totalAssessments: assessments.length,
    completedAssessments: assessments.filter(a => a.status === 'COMPLETED').length,
    highRiskProtocols: assessments.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL').length,
    averageRiskScore: assessments.length > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length)
      : 0
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        DeFi Risk Assessment
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Protocols"
            value={metrics.totalProtocols}
            subtitle="Registered protocols"
            icon={<Security />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Risk Assessments"
            value={metrics.completedAssessments}
            subtitle={`${metrics.totalAssessments} total`}
            icon={<Assessment />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="High Risk Protocols"
            value={metrics.highRiskProtocols}
            subtitle="Requiring attention"
            icon={<Warning />}
            color="warning.main"
            riskLevel={metrics.highRiskProtocols > 5 ? "HIGH" : metrics.highRiskProtocols > 2 ? "MEDIUM" : "LOW"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Average Risk Score"
            value={metrics.averageRiskScore}
            subtitle="Platform average"
            icon={<TrendingUp />}
            color={metrics.averageRiskScore > 70 ? "error.main" : metrics.averageRiskScore > 40 ? "warning.main" : "success.main"}
            riskLevel={metrics.averageRiskScore > 70 ? "HIGH" : metrics.averageRiskScore > 40 ? "MEDIUM" : "LOW"}
          />
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setError(null); // Clear any previous errors
            setAddProtocolOpen(true);
          }}
        >
          Add Protocol
        </Button>
        <Button
          variant="outlined"
          startIcon={<PlayArrow />}
          onClick={() => {
            setError(null); // Clear any previous errors
            setCreateAssessmentOpen(true);
          }}
          disabled={protocols.length === 0}
        >
          Run Assessment
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            setLoading(true);
            Promise.all([fetchProtocols(), fetchAssessments(), fetchStats()])
              .finally(() => setLoading(false));
          }}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Protocols List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Registered Protocols ({protocols.length})
              </Typography>
              
              {loading && protocols.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : protocols.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography color="text.secondary">
                    No protocols registered yet. Add your first protocol to get started.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {protocols.map((protocol, index) => (
                    <div key={protocol.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {protocol.name}
                              </Typography>
                              <Chip label={protocol.blockchain} size="small" />
                              {protocol.category && (
                                <Chip label={protocol.category} size="small" variant="outlined" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {protocol.contractAddresses[0]}
                                {protocol.contractAddresses.length > 1 && 
                                  ` (+${protocol.contractAddresses.length - 1} more)`
                                }
                              </Typography>
                              {protocol.website && (
                                <Typography variant="caption" color="primary">
                                  {protocol.website}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Box>
                          <Tooltip title="Run Assessment">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setAssessmentForm(prev => ({ ...prev, protocolId: protocol.id }));
                                setCreateAssessmentOpen(true);
                              }}
                            >
                              <PlayArrow />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                      {index < protocols.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Assessments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Assessments ({assessments.length})
              </Typography>
              
              {loading && assessments.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : assessments.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography color="text.secondary">
                    No assessments yet. Run your first risk assessment to see results here.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {assessments.map((assessment, index) => (
                    <div key={assessment.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {getProtocolName(assessment.protocolId)}
                              </Typography>
                              <Chip
                                label={assessment.status}
                                size="small"
                                color={assessment.status === 'COMPLETED' ? 'success' : 
                                       assessment.status === 'FAILED' ? 'error' : 'warning'}
                              />
                              {assessment.status === 'COMPLETED' && (
                                <Chip
                                  label={assessment.riskLevel}
                                  size="small"
                                  color={getRiskLevelColor(assessment.riskLevel) as any}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              {assessment.status === 'COMPLETED' && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  Overall Score: {assessment.overallScore}/100
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {new Date(assessment.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          }
                        />
                        {assessment.status === 'COMPLETED' && (
                          <IconButton
                            size="small"
                            onClick={() => setSelectedAssessment(assessment)}
                          >
                            <OpenInNew />
                          </IconButton>
                        )}
                      </ListItem>
                      {index < assessments.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Protocol Dialog */}
      <Dialog open={addProtocolOpen} onClose={() => setAddProtocolOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Protocol</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Protocol Name"
                value={newProtocol.name}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contract Addresses"
                value={newProtocol.contractAddresses}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, contractAddresses: e.target.value }))}
                placeholder="0x1234..., 0x5678... (comma separated)"
                helperText="Enter one or more contract addresses separated by commas"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Blockchain</InputLabel>
                <Select
                  value={newProtocol.blockchain}
                  label="Blockchain"
                  onChange={(e) => setNewProtocol(prev => ({ ...prev, blockchain: e.target.value }))}
                >
                  {BLOCKCHAIN_OPTIONS.map(blockchain => (
                    <MenuItem key={blockchain} value={blockchain}>
                      {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newProtocol.category}
                  label="Category"
                  onChange={(e) => setNewProtocol(prev => ({ ...prev, category: e.target.value }))}
                >
                  {CATEGORY_OPTIONS.map(category => (
                    <MenuItem key={category} value={category}>
                      {category.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Token Symbol"
                value={newProtocol.tokenSymbol}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, tokenSymbol: e.target.value }))}
                placeholder="UNI, SUSHI, etc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={newProtocol.website}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://protocol.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags"
                value={newProtocol.tags}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="defi, dex, amm (comma separated)"
                helperText="Add relevant tags separated by commas"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddProtocolOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateProtocol} 
            variant="contained"
            disabled={!newProtocol.name || !newProtocol.contractAddresses || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Protocol'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Assessment Dialog */}
      <Dialog open={createAssessmentOpen} onClose={() => setCreateAssessmentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Run Risk Assessment</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Protocol</InputLabel>
                <Select
                  value={assessmentForm.protocolId}
                  label="Select Protocol"
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, protocolId: e.target.value }))}
                >
                  {protocols.map(protocol => (
                    <MenuItem key={protocol.id} value={protocol.id}>
                      {protocol.name} ({protocol.blockchain})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Analysis Depth</InputLabel>
                <Select
                  value={assessmentForm.analysisDepth}
                  label="Analysis Depth"
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, analysisDepth: e.target.value as any }))}
                >
                  {ANALYSIS_DEPTH_OPTIONS.map(depth => (
                    <MenuItem key={depth} value={depth}>
                      {depth} {depth === 'COMPREHENSIVE' ? '(~3 min)' : depth === 'STANDARD' ? '(~2 min)' : '(~1 min)'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateAssessmentOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateAssessment} 
            variant="contained"
            disabled={!assessmentForm.protocolId || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Start Assessment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assessment Details Dialog */}
      {selectedAssessment && (
        <Dialog 
          open={!!selectedAssessment} 
          onClose={() => setSelectedAssessment(null)} 
          maxWidth="lg" 
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">
                Risk Assessment: {getProtocolName(selectedAssessment.protocolId)}
              </Typography>
              <Chip
                label={selectedAssessment.riskLevel}
                color={getRiskLevelColor(selectedAssessment.riskLevel) as any}
              />
              <Chip
                label={`Score: ${selectedAssessment.overallScore}/100`}
                variant="outlined"
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            {/* Category Scores */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <MetricCard
                  title="Technical Security"
                  value={selectedAssessment.categoryScores.technical}
                  subtitle="Smart contract security"
                  icon={<Shield />}
                  color="primary.main"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard
                  title="Governance"
                  value={selectedAssessment.categoryScores.governance}
                  subtitle="Decentralization & voting"
                  icon={<People />}
                  color="secondary.main"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard
                  title="Liquidity"
                  value={selectedAssessment.categoryScores.liquidity}
                  subtitle="Market depth & volume"
                  icon={<AccountBalanceWallet />}
                  color="info.main"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard
                  title="Reputation"
                  value={selectedAssessment.categoryScores.reputation}
                  subtitle="Team & track record"
                  icon={<Groups />}
                  color="warning.main"
                />
              </Grid>
            </Grid>

            {/* Recommendations */}
            {selectedAssessment.recommendations.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Recommendations</Typography>
                <List>
                  {selectedAssessment.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Findings */}
            {selectedAssessment.findings.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Security Findings</Typography>
                {/* Deduplicate findings by ID to avoid rendering duplicates */}
                {Array.from(new Map(selectedAssessment.findings.map(finding => [finding.id, finding])).values()).map((finding, index) => (
                  <Accordion key={`${selectedAssessment.id}-${finding.id}-${index}`}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Chip
                          label={finding.severity}
                          size="small"
                          color={getSeverityColor(finding.severity) as any}
                        />
                        <Typography sx={{ fontWeight: 500 }}>{finding.title}</Typography>
                        <Box sx={{ ml: 'auto' }}>
                          <Chip
                            label={`${finding.confidence}% confidence`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {finding.description}
                      </Typography>
                      {finding.recommendation && (
                        <Alert severity="info">
                          <strong>Recommendation:</strong> {finding.recommendation}
                        </Alert>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Source: {finding.source} | Category: {finding.category}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}

            {/* Metadata */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Assessment Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Analysis Version: {selectedAssessment.metadata.analysisVersion}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Analysis Depth: {selectedAssessment.metadata.analysisDepth}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Execution Time: {Math.round(selectedAssessment.metadata.executionTime / 1000)}s
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Data Sources: {selectedAssessment.metadata.dataSourcesUsed.join(', ')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Completed: {selectedAssessment.completedAt ? new Date(selectedAssessment.completedAt).toLocaleString() : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedAssessment(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default DeFiRiskAssessment;
