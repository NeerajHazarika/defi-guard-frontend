import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { 
  ApiHealth, 
  ApiStats, 
  ApiProtocols, 
  Alert, 
  Threat, 
  Exploit
} from '../services/api';

export interface ApiDataState {
  health: ApiHealth | null;
  stats: ApiStats | null;
  protocols: ApiProtocols | null;
  alerts: Alert[] | null;
  threats: Threat[] | null;
  exploits: Exploit[] | null;
  rektNews: any[] | null;
  fundMovements: any[] | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useApiData = (refreshInterval: number = 120000) => { // Increased to 2 minutes to reduce calls
  const [state, setState] = useState<ApiDataState>({
    health: null,
    stats: null,
    protocols: null,
    alerts: null,
    threats: null,
    exploits: null,
    rektNews: null,
    fundMovements: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchData = async (isBackground = false) => {
    try {
      console.log('[useApiData] Starting data fetch...');
      if (!isBackground) {
        setState(prev => ({ ...prev, loading: prev.health ? false : true, error: null })); // Don't show loading if we already have data
      }

      // Try to fetch all endpoints
      try {
        const [health, stats, protocols, alertsData, threatsData, exploitsData, rektNewsData, fundMovementsData] = await Promise.all([
          apiService.getHealth(),
          apiService.getStats(),
          apiService.getProtocols(),
          apiService.getRecentAlerts(),
          apiService.getThreatIntel(),
          apiService.getRecentExploits(),
          apiService.getRektNews().catch(() => ({ articles: [] })), // Graceful fallback
          apiService.getFundMovements().catch(() => ({ movements: [] })), // Graceful fallback
        ]);

        console.log('[useApiData] All data fetched successfully:', {
          alerts: alertsData.alerts?.length || 0,
          threats: threatsData.threats?.length || 0,
          exploits: exploitsData.exploits?.length || 0,
          rektNews: rektNewsData.articles?.length || 0,
          fundMovements: fundMovementsData.movements?.length || 0
        });

        setState({
          health,
          stats,
          protocols,
          alerts: alertsData.alerts || [],
          threats: threatsData.threats || [],
          exploits: exploitsData.exploits || [],
          rektNews: rektNewsData.articles || [],
          fundMovements: fundMovementsData.movements || [],
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      } catch (fetchError) {
        console.warn('[useApiData] Full fetch failed, trying basic endpoints only:', fetchError);
        
        // Fallback: try just basic endpoints
        const [health, stats, protocols] = await Promise.all([
          apiService.getHealth(),
          apiService.getStats(),
          apiService.getProtocols(),
        ]);

        setState({
          health,
          stats,
          protocols,
          alerts: [],
          threats: [],
          exploits: [],
          rektNews: [],
          fundMovements: [],
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      }

    } catch (error) {
      console.error('[useApiData] Error fetching data:', error);
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the backend server. Please ensure the server is running at http://localhost:8000 and CORS is enabled.';
        } else if (error.message.includes('HTTP error')) {
          errorMessage = `Backend server error: ${error.message}`;
        } else {
          errorMessage = error.message;
        }
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  useEffect(() => {
    fetchData(false); // Initial fetch with loading state

    const interval = setInterval(() => {
      fetchData(true); // Background refreshes
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const refetch = () => {
    fetchData(false); // Manual refresh with loading state
  };

  return {
    ...state,
    refetch,
  };
};
