import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { 
  ThreatIntelItem,
  StablecoinData,
  StablecoinAlert
} from '../services/api';

// Cache keys for localStorage
const CACHE_KEYS = {
  THREAT_INTEL: 'defi-guard-threat-intel',
  STABLECOINS: 'defi-guard-stablecoins',
  STABLECOIN_ALERTS: 'defi-guard-stablecoin-alerts',
  LAST_UPDATED: 'defi-guard-last-updated',
} as const;

// Cache expiry time (2 hours for longer persistence)
const CACHE_EXPIRY_MS = 2 * 60 * 60 * 1000;

// Utility functions for localStorage caching
const saveToCache = <T>(key: string, data: T): void => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn(`[Cache] Failed to save ${key}:`, error);
  }
};

const getFromCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY_MS;
    
    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn(`[Cache] Failed to read ${key}:`, error);
    localStorage.removeItem(key);
    return null;
  }
};

const clearCache = (): void => {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export interface BackendDataState {
  threatIntel: ThreatIntelItem[];
  stablecoins: StablecoinData[];
  stablecoinAlerts: StablecoinAlert[];
  threatIntelHealth: { status: string; last_updated: string } | null;
  stablecoinHealth: { status: string; last_updated: string } | null;
  loading: boolean;
  threatIntelLoading: boolean; // Separate loading state for threat intel
  error: string | null;
  lastUpdated: Date | null;
}

export const useBackendData = (refreshInterval: number = 60000) => { // 1 minute refresh
  // Initialize state with cached data if available
  const [state, setState] = useState<BackendDataState>(() => {
    const cachedThreatIntel = getFromCache<ThreatIntelItem[]>(CACHE_KEYS.THREAT_INTEL) || [];
    const cachedStablecoins = getFromCache<StablecoinData[]>(CACHE_KEYS.STABLECOINS) || [];
    const cachedStablecoinAlerts = getFromCache<StablecoinAlert[]>(CACHE_KEYS.STABLECOIN_ALERTS) || [];
    const cachedLastUpdated = getFromCache<string>(CACHE_KEYS.LAST_UPDATED);
    
    const hasData = cachedThreatIntel.length > 0 || cachedStablecoins.length > 0;
    
    console.log('[useBackendData] Initializing with cached data:', {
      threatIntel: cachedThreatIntel.length,
      stablecoins: cachedStablecoins.length,
      stablecoinAlerts: cachedStablecoinAlerts.length,
      hasData
    });
    
    return {
      threatIntel: cachedThreatIntel,
      stablecoins: cachedStablecoins,
      stablecoinAlerts: cachedStablecoinAlerts,
      threatIntelHealth: null,
      stablecoinHealth: null,
      loading: !hasData, // Only show loading if no cached data
      threatIntelLoading: false,
      error: null,
      lastUpdated: cachedLastUpdated ? new Date(cachedLastUpdated) : null,
    };
  });

  const fetchData = async (isBackground = false) => {
    try {
      console.log('[useBackendData] Starting backend data fetch...');
      if (!isBackground) {
        setState(prev => ({ 
          ...prev, 
          loading: prev.threatIntel.length > 0 || prev.stablecoins.length > 0 ? false : true, 
          error: null 
        }));
      }

      // Fetch data from both backend services
      const [
        stablecoinResponse,
        stablecoinAlertsResponse,
        threatIntelHealth,
        stablecoinHealth
      ] = await Promise.allSettled([
        apiService.getStablecoinData(),
        apiService.getStablecoinAlerts(),
        apiService.getThreatIntelHealth(),
        apiService.getStablecoinHealth()
      ]);

      // Process results
      const stablecoinData = stablecoinResponse.status === 'fulfilled' 
        ? stablecoinResponse.value 
        : { stablecoins: [], alerts: [], total_monitored: 0, last_updated: new Date().toISOString() };
      
      const stablecoinAlerts = stablecoinAlertsResponse.status === 'fulfilled' 
        ? stablecoinAlertsResponse.value 
        : [];

      const threatIntelHealthData = threatIntelHealth.status === 'fulfilled' 
        ? threatIntelHealth.value 
        : { status: 'error', last_updated: new Date().toISOString() };

      const stablecoinHealthData = stablecoinHealth.status === 'fulfilled' 
        ? stablecoinHealth.value 
        : { status: 'error', last_updated: new Date().toISOString() };

      const lastUpdated = new Date();
      const combinedAlerts = [...stablecoinData.alerts, ...stablecoinAlerts];

      // Cache the new data
      saveToCache(CACHE_KEYS.STABLECOINS, stablecoinData.stablecoins);
      saveToCache(CACHE_KEYS.STABLECOIN_ALERTS, combinedAlerts);
      saveToCache(CACHE_KEYS.LAST_UPDATED, lastUpdated.toISOString());

      setState(prev => ({
        ...prev,
        stablecoins: stablecoinData.stablecoins,
        stablecoinAlerts: combinedAlerts,
        threatIntelHealth: threatIntelHealthData,
        stablecoinHealth: stablecoinHealthData,
        loading: false,
        error: null,
        lastUpdated,
      }));

      console.log('[useBackendData] Data fetch completed successfully');
      console.log(`[useBackendData] Stablecoins: ${stablecoinData.stablecoins.length}`);
      console.log(`[useBackendData] Stablecoin Alerts: ${stablecoinData.alerts.length + stablecoinAlerts.length}`);

    } catch (error) {
      console.error('[useBackendData] Error fetching backend data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  };

  const fetchThreatIntel = async (forceFresh = true) => {
    try {
      console.log('[useBackendData] Starting threat intel fetch with fresh scrape...');
      setState(prev => ({ ...prev, threatIntelLoading: true }));

      const threatIntelResponse = await apiService.getThreatIntelNews(50, forceFresh);
      const lastUpdated = new Date();
      
      // Cache the threat intelligence data
      saveToCache(CACHE_KEYS.THREAT_INTEL, threatIntelResponse.items);
      saveToCache(CACHE_KEYS.LAST_UPDATED, lastUpdated.toISOString());
      
      setState(prev => ({
        ...prev,
        threatIntel: threatIntelResponse.items,
        threatIntelLoading: false,
        lastUpdated,
      }));

      console.log(`[useBackendData] Threat Intel fetch completed: ${threatIntelResponse.items.length} items`);

    } catch (error) {
      console.error('[useBackendData] Error fetching threat intel:', error);
      setState(prev => ({
        ...prev,
        threatIntelLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  };

  const refreshData = () => {
    console.log('[useBackendData] Manual refresh triggered');
    fetchData(false);
    fetchThreatIntel(true); // Always use fresh scrape on manual refresh
  };

  const refreshThreatIntel = () => {
    console.log('[useBackendData] Manual threat intel refresh triggered');
    fetchThreatIntel(true);
  };

  const clearAllCache = () => {
    console.log('[useBackendData] Clearing all cached data');
    clearCache();
    setState(prev => ({
      ...prev,
      threatIntel: [],
      stablecoins: [],
      stablecoinAlerts: [],
      lastUpdated: null,
      loading: true,
    }));
  };

  useEffect(() => {
    // Check if we have recent cached data
    const hasRecentThreatIntel = state.threatIntel.length > 0;
    
    // Always fetch initial data for health status
    fetchData(false);
    
    // Only fetch fresh threat intel if we don't have cached data
    if (!hasRecentThreatIntel) {
      fetchThreatIntel(true);
    } else {
      console.log('[useBackendData] Using cached threat intelligence data');
    }

    // Set up interval for background updates
    const interval = setInterval(() => {
      console.log('[useBackendData] Background refresh triggered');
      fetchData(true);
      // Don't auto-refresh threat intel in background to avoid excessive scraping
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, state.threatIntel.length]); // Add missing dependency

  return {
    ...state,
    refreshData,
    refreshThreatIntel,
    clearAllCache,
    isLoading: state.loading,
    hasError: !!state.error,
  };
};
