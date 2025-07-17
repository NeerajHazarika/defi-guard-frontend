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
  LinearProgress,
} from '@mui/material';
import {
  Add,
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
  Code,
  BugReport,
  Speed,
} from '@mui/icons-material';
import MetricCard from '../components/MetricCard';
import { defiRiskAssessmentApi } from '../services/api';
import type { 
  Protocol, 
  Assessment as AssessmentType, 
  CreateAssessmentRequest, 
  CreateProtocolRequest,
  AnalysisProgress,
  SlitherVulnerabilityType
} from '../services/api';

// Additional local interfaces for UI state
interface AssessmentStats {
  totalProtocols: number;
  activeAssessments: number;
  completedAssessments: number;
  avgRiskScore: number;
  criticalFindings: number;
}

interface CreateAssessmentForm {
  protocolId: string;
  contractAddress: string;
  chainId: number;
  analysisTypes: string[];
  includeStaticAnalysis: boolean;
  includeDynamicAnalysis: boolean;
  includeGovernanceAnalysis: boolean;
  includeLiquidityAnalysis: boolean;
}

const BLOCKCHAIN_OPTIONS = [
  { value: 1, label: 'Ethereum' },
  { value: 56, label: 'BSC' },
  { value: 137, label: 'Polygon' },
  { value: 42161, label: 'Arbitrum' },
  { value: 10, label: 'Optimism' },
  { value: 43114, label: 'Avalanche' },
  { value: 250, label: 'Fantom' }
];

const CATEGORY_OPTIONS = ['DEX', 'LENDING', 'YIELD_FARMING', 'DERIVATIVES', 'INSURANCE', 'BRIDGE', 'DAO', 'STABLECOIN', 'NFT', 'OTHER'];

const DeFiRiskAssessment: React.FC = () => {
  // State management
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [assessments, setAssessments] = useState<AssessmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AssessmentStats>({
    totalProtocols: 0,
    activeAssessments: 0,
    completedAssessments: 0,
    avgRiskScore: 0,
    criticalFindings: 0
  });
  const [availableDetectors, setAvailableDetectors] = useState<SlitherVulnerabilityType[]>([]);

  // Dialog states
  const [addProtocolOpen, setAddProtocolOpen] = useState(false);
  const [createAssessmentOpen, setCreateAssessmentOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | null>(null);
  const [assessmentProgress, setAssessmentProgress] = useState<AnalysisProgress | null>(null);

  // Form states
  const [newProtocol, setNewProtocol] = useState<CreateProtocolRequest>({
    name: '',
    contractAddress: '',
    chainId: 1,
    website: '',
    category: 'DEX'
  });

  const [assessmentForm, setAssessmentForm] = useState<CreateAssessmentForm>({
    protocolId: '',
    contractAddress: '',
    chainId: 1,
    analysisTypes: ['static'],
    includeStaticAnalysis: true,
    includeDynamicAnalysis: false,
    includeGovernanceAnalysis: false,
    includeLiquidityAnalysis: false
  });

  // Fetch data functions
  const fetchProtocols = async () => {
    try {
      const response = await defiRiskAssessmentApi.getProtocols(1, 50);
      setProtocols(Array.isArray(response.protocols) ? response.protocols : []);
    } catch (err) {
      console.error('Failed to fetch protocols:', err);
      setError(`Failed to fetch protocols: ${err instanceof Error ? err.message : String(err)}`);
      setProtocols([]); // Set empty array as fallback
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await defiRiskAssessmentApi.getAssessments(1, 50);
      const assessmentsList = Array.isArray(response.assessments) ? response.assessments : [];
      setAssessments(assessmentsList);
      
      // Update stats based on assessments
      const activeCount = assessmentsList.filter(a => a.status === 'IN_PROGRESS' || a.status === 'PENDING').length;
      const completedCount = assessmentsList.filter(a => a.status === 'COMPLETED').length;
      const avgScore = completedCount > 0 
        ? assessmentsList.filter(a => a.status === 'COMPLETED').reduce((sum, a) => sum + a.overallScore, 0) / completedCount 
        : 0;
      const criticalCount = assessmentsList.reduce((sum, a) => 
        sum + (a.findings?.filter(f => f.severity === 'critical').length || 0), 0);

      setStats(prev => ({
        ...prev,
        activeAssessments: activeCount,
        completedAssessments: completedCount,
        avgRiskScore: avgScore,
        criticalFindings: criticalCount
      }));
    } catch (err) {
      console.error('Failed to fetch assessments:', err);
      setError('Failed to fetch assessments');
      setAssessments([]); // Set empty array as fallback
    }
  };

  const fetchStats = async () => {
    try {
      const [protocolsResponse, detectorsResponse] = await Promise.all([
        defiRiskAssessmentApi.getProtocols(1, 1), // Just to get total count
        defiRiskAssessmentApi.getSlitherDetectors().catch(err => {
          console.warn('Failed to fetch Slither detectors:', err);
          return []; // Return empty array as fallback
        })
      ]);
      
      setStats(prev => ({
        ...prev,
        totalProtocols: protocolsResponse.total
      }));
      
      setAvailableDetectors(Array.isArray(detectorsResponse) ? detectorsResponse : []);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Set fallback values
      setAvailableDetectors([]);
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
      
      await defiRiskAssessmentApi.createProtocol(newProtocol);
      
      setAddProtocolOpen(false);
      setNewProtocol({
        name: '',
        contractAddress: '',
        chainId: 1,
        website: '',
        category: 'DEX'
      });
      await fetchProtocols();
      await fetchStats();
      setError(null);
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

      const requestData: CreateAssessmentRequest = {
        protocolId: assessmentForm.protocolId,
        // Note: Currently the API only accepts protocolId
        // Other fields are not supported by the backend
      };

      const assessment = await defiRiskAssessmentApi.createAssessment(requestData);
      
      setCreateAssessmentOpen(false);
      setAssessmentForm({
        protocolId: '',
        contractAddress: '',
        chainId: 1,
        analysisTypes: ['static'],
        includeStaticAnalysis: true,
        includeDynamicAnalysis: false,
        includeGovernanceAnalysis: false,
        includeLiquidityAnalysis: false
      });
      
      await fetchAssessments();
      // Start polling for progress updates
      pollAssessmentStatus(assessment.id);
      
    } catch (err) {
      console.error('Failed to create assessment:', err);
      setError('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  // Poll assessment status and progress
  const pollAssessmentStatus = async (assessmentId: string) => {
    const checkStatus = async () => {
      try {
        const [assessment, progress] = await Promise.all([
          defiRiskAssessmentApi.getAssessment(assessmentId),
          defiRiskAssessmentApi.getAssessmentProgress(assessmentId)
        ]);
        
        setAssessmentProgress(progress);
        
        if (assessment.status === 'COMPLETED' || assessment.status === 'FAILED') {
          await fetchAssessments();
          setAssessmentProgress(null);
          return;
        }
        
        // Continue polling if still in progress
        setTimeout(checkStatus, 3000);
      } catch (err) {
        console.error('Failed to check assessment status:', err);
        setAssessmentProgress(null);
      }
    };

    setTimeout(checkStatus, 3000);
  };

  // Helper functions
  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'very_low': case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': case 'very_high': return 'error';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  const getProtocolName = (protocolId: string) => {
    const protocol = protocols.find(p => p.id === protocolId);
    return protocol?.name || protocolId;
  };

  // Calculate metrics from state
  const metrics = {
    totalProtocols: stats.totalProtocols,
    totalAssessments: assessments.length,
    completedAssessments: stats.completedAssessments,
    highRiskProtocols: assessments.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL').length,
    averageRiskScore: Math.round(stats.avgRiskScore),
    criticalFindings: stats.criticalFindings
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

      {/* Analysis Progress */}
      {assessmentProgress && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Analysis in Progress</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {assessmentProgress.current_step} - Stage: {assessmentProgress.stage}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={assessmentProgress.progress_percentage} 
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {assessmentProgress.progress_percentage}% complete
              {assessmentProgress.estimated_time_remaining_ms && 
                ` - ${Math.round(assessmentProgress.estimated_time_remaining_ms / 1000)}s remaining`
              }
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Total Protocols"
            value={metrics.totalProtocols}
            subtitle="Registered protocols"
            icon={<Security />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Risk Assessments"
            value={metrics.completedAssessments}
            subtitle={`${metrics.totalAssessments} total`}
            icon={<Security />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Critical Findings"
            value={metrics.criticalFindings}
            subtitle="Security issues found"
            icon={<BugReport />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Active Assessments"
            value={stats.activeAssessments}
            subtitle="Currently running"
            icon={<Speed />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Avg Risk Score"
            value={metrics.averageRiskScore}
            subtitle="Out of 100"
            icon={<TrendingUp />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Slither Detectors"
            value={availableDetectors.length}
            subtitle="Available"
            icon={<Code />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="High Risk Protocols"
            value={metrics.highRiskProtocols}
            subtitle="Requiring attention"
            icon={<Warning />}
            color="warning.main"
            riskLevel={metrics.highRiskProtocols > 5 ? "HIGH" : metrics.highRiskProtocols > 2 ? "MEDIUM" : "LOW"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
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
                              {protocol.chainId && (
                                <Chip label={`Chain ${protocol.chainId}`} size="small" />
                              )}
                              {protocol.category && (
                                <Chip label={protocol.category} size="small" variant="outlined" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {protocol.contractAddress}
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
                                  Score: {assessment.overallScore}/100
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
                label="Contract Address"
                value={newProtocol.contractAddress}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, contractAddress: e.target.value }))}
                placeholder="0x1234567890abcdef..."
                helperText="Main contract address for the protocol"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Blockchain</InputLabel>
                <Select
                  value={newProtocol.chainId}
                  label="Blockchain"
                  onChange={(e) => setNewProtocol(prev => ({ ...prev, chainId: e.target.value as number }))}
                >
                  {BLOCKCHAIN_OPTIONS.map(blockchain => (
                    <MenuItem key={blockchain.value} value={blockchain.value}>
                      {blockchain.label}
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
            <Grid item xs={12}>
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
                label="Description"
                value={newProtocol.description || ''}
                onChange={(e) => setNewProtocol(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
                placeholder="Brief description of the protocol"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddProtocolOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateProtocol} 
            variant="contained"
            disabled={!newProtocol.name || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Protocol'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Assessment Dialog */}
      <Dialog open={createAssessmentOpen} onClose={() => setCreateAssessmentOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Run Risk Assessment</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Select Protocol</InputLabel>
                <Select
                  value={assessmentForm.protocolId}
                  label="Select Protocol"
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, protocolId: e.target.value }))}
                >
                  {protocols.map(protocol => (
                    <MenuItem key={protocol.id} value={protocol.id}>
                      {protocol.name} (Chain ID: {protocol.chainId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contract Address (Optional)"
                value={assessmentForm.contractAddress}
                onChange={(e) => setAssessmentForm(prev => ({ ...prev, contractAddress: e.target.value }))}
                placeholder="0x1234567890abcdef..."
                helperText="Override protocol contract address"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Blockchain</InputLabel>
                <Select
                  value={assessmentForm.chainId}
                  label="Blockchain"
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, chainId: e.target.value as number }))}
                >
                  {BLOCKCHAIN_OPTIONS.map(blockchain => (
                    <MenuItem key={blockchain.value} value={blockchain.value}>
                      {blockchain.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Analysis Types (Select at least one)
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <FormControl component="fieldset" variant="standard">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Code color="primary" />
                        <Typography variant="h6">Static Analysis</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Slither-powered smart contract vulnerability detection
                      </Typography>
                      <Box>
                        <label>
                          <input
                            type="checkbox"
                            checked={assessmentForm.includeStaticAnalysis}
                            onChange={(e) => setAssessmentForm(prev => ({ 
                              ...prev, 
                              includeStaticAnalysis: e.target.checked 
                            }))}
                          />
                          <span style={{ marginLeft: 8 }}>
                            Enable Static Analysis ({availableDetectors.length} detectors)
                          </span>
                        </label>
                      </Box>
                    </FormControl>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <FormControl component="fieldset" variant="standard">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Speed color="warning" />
                        <Typography variant="h6">Dynamic Analysis</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Runtime behavior and transaction analysis
                      </Typography>
                      <Box>
                        <label>
                          <input
                            type="checkbox"
                            checked={assessmentForm.includeDynamicAnalysis}
                            onChange={(e) => setAssessmentForm(prev => ({ 
                              ...prev, 
                              includeDynamicAnalysis: e.target.checked 
                            }))}
                          />
                          <span style={{ marginLeft: 8 }}>Enable Dynamic Analysis</span>
                        </label>
                      </Box>
                    </FormControl>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <FormControl component="fieldset" variant="standard">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Groups color="info" />
                        <Typography variant="h6">Governance Analysis</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Decentralization and governance structure
                      </Typography>
                      <Box>
                        <label>
                          <input
                            type="checkbox"
                            checked={assessmentForm.includeGovernanceAnalysis}
                            onChange={(e) => setAssessmentForm(prev => ({ 
                              ...prev, 
                              includeGovernanceAnalysis: e.target.checked 
                            }))}
                          />
                          <span style={{ marginLeft: 8 }}>Enable Governance Analysis</span>
                        </label>
                      </Box>
                    </FormControl>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <FormControl component="fieldset" variant="standard">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalanceWallet color="success" />
                        <Typography variant="h6">Liquidity Analysis</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        TVL, volume, and market depth analysis
                      </Typography>
                      <Box>
                        <label>
                          <input
                            type="checkbox"
                            checked={assessmentForm.includeLiquidityAnalysis}
                            onChange={(e) => setAssessmentForm(prev => ({ 
                              ...prev, 
                              includeLiquidityAnalysis: e.target.checked 
                            }))}
                          />
                          <span style={{ marginLeft: 8 }}>Enable Liquidity Analysis</span>
                        </label>
                      </Box>
                    </FormControl>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateAssessmentOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateAssessment} 
            variant="contained"
            disabled={
              !assessmentForm.protocolId || 
              loading ||
              (!assessmentForm.includeStaticAnalysis && 
               !assessmentForm.includeDynamicAnalysis && 
               !assessmentForm.includeGovernanceAnalysis && 
               !assessmentForm.includeLiquidityAnalysis)
            }
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
            {/* Risk Score Summary */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Risk Assessment Summary</Typography>
              <MetricCard
                title="Risk Score"
                value={selectedAssessment.overallScore}
                subtitle={`Risk Level: ${selectedAssessment.riskLevel}`}
                icon={<Shield />}
                color="primary.main"
                riskLevel={selectedAssessment.riskLevel.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'}
              />
            </Box>

            {/* Recommendations */}
            {selectedAssessment.recommendations && selectedAssessment.recommendations.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Recommendations</Typography>
                <List>
                  {selectedAssessment.recommendations.map((rec: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Findings */}
            {selectedAssessment.findings && selectedAssessment.findings.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Security Findings</Typography>
                {selectedAssessment.findings.map((finding: any, index: number) => (
                  <Accordion key={`${selectedAssessment.id}-${index}`}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Chip
                          label={finding.severity}
                          size="small"
                          color={getSeverityColor(finding.severity) as any}
                        />
                        <Typography sx={{ fontWeight: 500 }}>{finding.title}</Typography>
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
                        Category: {finding.category}
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
                    Analysis Version: {selectedAssessment.metadata?.analysisVersion || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status: {selectedAssessment.status}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Risk Level: {selectedAssessment.riskLevel}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Risk Level: {selectedAssessment.riskLevel}
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
