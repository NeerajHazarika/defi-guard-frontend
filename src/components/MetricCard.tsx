import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number | React.ReactNode;
  subtitle?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  icon?: React.ReactNode;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  riskLevel,
  icon,
  color = 'primary.main',
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'success.main';
      case 'MEDIUM': return 'warning.main';
      case 'HIGH': return 'error.main';
      case 'CRITICAL': return '#FF1744';
      default: return 'text.secondary';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ fontSize: 16 }} />;
      case 'down': return <TrendingDown sx={{ fontSize: 16 }} />;
      case 'flat': return <TrendingFlat sx={{ fontSize: 16 }} />;
      default: return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'success.main';
      case 'down': return 'error.main';
      case 'flat': return 'text.secondary';
      default: return 'text.secondary';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, rgba(22, 27, 46, 0.9) 0%, rgba(13, 17, 30, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0, 212, 170, 0.15)',
          border: '1px solid rgba(0, 212, 170, 0.3)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {title}
          </Typography>
          {icon && (
            <Box sx={{ color, opacity: 0.8 }}>
              {icon}
            </Box>
          )}
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
          {value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            {subtitle && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
            {trend && trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Box sx={{ color: getTrendColor(), display: 'flex', alignItems: 'center' }}>
                  {getTrendIcon()}
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ color: getTrendColor(), fontWeight: 500 }}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>

          {riskLevel && (
            <Chip
              label={riskLevel}
              size="small"
              sx={{
                backgroundColor: getRiskColor(riskLevel),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
