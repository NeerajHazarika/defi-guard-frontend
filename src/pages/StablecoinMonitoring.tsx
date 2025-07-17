import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Pagination,
} from '@mui/material';
import {
  Article,
  Refresh,
  OpenInNew,
} from '@mui/icons-material';
import { useBackendData } from '../hooks/useBackendData';
import { apiService } from '../services/api';
import type { CountryRegulation, StablecoinNews, StablecoinData, StablecoinAlert } from '../services/api';

// Main component

// Enhanced country data for the interactive map (like the HTML example)
// NOTE: This static data is replaced by dynamic data from fetchCountryDataFromNews()
/*
const enhancedCountryData: EnhancedCountry[] = [
  {
    name: 'Japan',
    code: 'JP',
    status: 'crypto-friendly',
    coordinates: [36.2048, 138.2529],
    stablecoins: ['USDC', 'USDT', 'JPY Coin'],
    legalFramework: 'Payment Services Act',
    lastUpdated: '2024-12-08',
    keyRegulations: ['PSA compliance', 'JVCEA self-regulation', 'Cabinet Office guidelines'],
    riskLevel: 'low',
    description: 'Leading the way in crypto regulation with clear guidelines and innovative framework. Well-established regulatory framework with FSA oversight.',
    svgPath: 'M780,160 L795,155 L800,165 L805,180 L800,200 L790,210 L785,205 L780,190 L785,175 Z',
    centerX: 795,
    centerY: 185
  },
  {
    name: 'United States',
    code: 'US',
    status: 'regulated',
    coordinates: [39.8283, -98.5795],
    stablecoins: ['USDC', 'USDT', 'DAI', 'BUSD'],
    legalFramework: 'Federal and state-level regulation',
    lastUpdated: '2024-12-15',
    keyRegulations: ['SEC guidelines', 'FinCEN requirements', 'State money transmission laws'],
    riskLevel: 'medium',
    description: 'Complex regulatory landscape with federal and state oversight. Legal but heavily regulated by SEC/CFTC.',
    svgPath: 'M200,150 L280,140 L320,150 L350,160 L370,180 L360,200 L340,210 L300,220 L260,215 L220,210 L200,190 Z',
    centerX: 280,
    centerY: 180
  },
  {
    name: 'Germany',
    code: 'DE',
    status: 'crypto-friendly',
    coordinates: [51.1657, 10.4515],
    stablecoins: ['USDC', 'USDT', 'DAI', 'EURS'],
    legalFramework: 'EU MiCA Regulation',
    lastUpdated: '2024-12-10',
    keyRegulations: ['BaFin supervision', 'MiCA compliance', 'Anti-Money Laundering Act'],
    riskLevel: 'low',
    description: 'Progressive cryptocurrency regulation under EU framework. Legal but regulated under BaFin.',
    svgPath: 'M485,135 L505,130 L515,140 L510,160 L500,170 L485,165 L480,150 L485,140 Z',
    centerX: 495,
    centerY: 150
  },
  {
    name: 'China',
    code: 'CN',
    status: 'restrictive-banned',
    coordinates: [35.8617, 104.1954],
    stablecoins: ['DCEP (Digital Yuan)'],
    legalFramework: 'Central Bank Digital Currency only',
    lastUpdated: '2024-12-01',
    keyRegulations: ['PBOC restrictions', 'Cryptocurrency ban', 'DCEP promotion'],
    riskLevel: 'high',
    description: 'Completely banned since September 2021. Only state-issued digital currency permitted.',
    svgPath: 'M650,160 L720,155 L750,170 L760,190 L750,210 L730,225 L700,230 L670,225 L650,210 L645,185 L650,170 Z',
    centerX: 700,
    centerY: 190
  },
  {
    name: 'Canada',
    code: 'CA',
    status: 'crypto-friendly',
    coordinates: [56.1304, -106.3468],
    stablecoins: ['USDC', 'USDT', 'DAI'],
    legalFramework: 'Provincial regulation',
    lastUpdated: '2024-12-13',
    keyRegulations: ['CSA oversight', 'FINTRAC requirements', 'Provincial securities laws'],
    riskLevel: 'low',
    description: 'Legal and regulated by financial authorities. Provincial regulatory approach with securities commission oversight.',
    svgPath: 'M180,80 L360,70 L380,90 L370,110 L350,130 L320,140 L280,135 L240,130 L200,125 L180,110 Z',
    centerX: 280,
    centerY: 100
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    status: 'regulated',
    coordinates: [55.3781, -3.4360],
    stablecoins: ['USDC', 'USDT', 'DAI'],
    legalFramework: 'FCA Regulation',
    lastUpdated: '2024-12-12',
    keyRegulations: ['FCA authorization', 'Payment Services Regulations', 'MLR 2017'],
    riskLevel: 'medium',
    description: 'Legal but increasing regulation. Comprehensive regulatory framework with FCA oversight.',
    svgPath: 'M460,120 L475,115 L480,125 L485,140 L480,155 L470,160 L460,155 L455,140 L460,125 Z',
    centerX: 470,
    centerY: 140
  },
  {
    name: 'Singapore',
    code: 'SG',
    status: 'crypto-friendly',
    coordinates: [1.3521, 103.8198],
    stablecoins: ['USDC', 'USDT', 'XSGD'],
    legalFramework: 'Payment Services Act',
    lastUpdated: '2024-12-14',
    keyRegulations: ['MAS licensing', 'PSA compliance', 'DPT framework'],
    riskLevel: 'low',
    description: 'Progressive regulatory framework. Clear licensing framework for digital payment tokens.',
    svgPath: 'M700,270 L708,268 L710,275 L705,278 L700,275 Z',
    centerX: 705,
    centerY: 273
  },
  {
    name: 'Switzerland',
    code: 'CH',
    status: 'crypto-friendly',
    coordinates: [46.8182, 8.2275],
    stablecoins: ['USDC', 'USDT', 'DAI', 'CHSB'],
    legalFramework: 'Federal Council Regulation',
    lastUpdated: '2024-12-11',
    keyRegulations: ['FINMA guidelines', 'Federal Council ordinance', 'AML regulations'],
    riskLevel: 'low',
    description: 'Very crypto-friendly, clear regulations. Innovation support with clear regulatory framework.',
    svgPath: 'M485,165 L495,162 L500,170 L495,175 L485,172 Z',
    centerX: 492,
    centerY: 168
  }
];
*/

// Helper functions for status display
const StablecoinMonitoring: React.FC = () => {
  const { 
    loading,
  } = useBackendData();

  // State for new features
  const [activeTab, setActiveTab] = useState(0);
  const [countryData, setCountryData] = useState<CountryRegulation[]>([]);
  const [newsData, setNewsData] = useState<StablecoinNews[]>([]);
  const [stablecoinData, setStablecoinData] = useState<StablecoinData[]>([]);
  const [stablecoinAlerts, setStablecoinAlerts] = useState<StablecoinAlert[]>([]);
  const [osintLoading, setOsintLoading] = useState(false);
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [selectedStablecoin, setSelectedStablecoin] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [newsCategory, setNewsCategory] = useState<string>('all');

  // State for tracking data source
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  
  // Pagination state for news
  const [newsPage, setNewsPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(10); // Increased from 5 to 10

  // Mock data for demo purposes (when OSINT service is unavailable)
  // Helper function to map country codes and extract country data from news
  const fetchCountryDataFromNews = async (): Promise<CountryRegulation[]> => {
    try {
      const apiUrl = import.meta.env.VITE_STABLECOIN_OSINT_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/v1/news/articles?limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Analyzing country data from news articles...');
      
      // Extract country mentions from news articles
      const countryMentions: { [key: string]: { count: number; stablecoins: Set<string>; sentiment: string[] } } = {};
      
      data.articles?.forEach((article: any) => {
        if (article.mentioned_countries) {
          article.mentioned_countries.forEach((countryCode: string) => {
            if (!countryMentions[countryCode]) {
              countryMentions[countryCode] = { count: 0, stablecoins: new Set(), sentiment: [] };
            }
            countryMentions[countryCode].count++;
            countryMentions[countryCode].sentiment.push(article.sentiment || 'neutral');
            
            if (article.mentioned_stablecoins) {
              article.mentioned_stablecoins.forEach((coin: string) => {
                countryMentions[countryCode].stablecoins.add(coin);
              });
            }
          });
        }
      });

      // Enhanced country mapping with comprehensive regulatory info
      const countryMapping: { [key: string]: { name: string; region: string; crypto_friendly: boolean; regulatory_status: 'regulated' | 'hostile' | 'friendly' | 'neutral' | 'unclear'; notes: string } } = {
        'US': { 
          name: 'United States', 
          region: 'North America', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Mixed federal and state regulation, SEC oversight' 
        },
        'EU': { 
          name: 'European Union', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'MiCA Regulation framework, comprehensive oversight' 
        },
        'CN': { 
          name: 'China', 
          region: 'Asia', 
          crypto_friendly: false, 
          regulatory_status: 'hostile',
          notes: 'Comprehensive ban on cryptocurrency trading' 
        },
        'JP': { 
          name: 'Japan', 
          region: 'Asia', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'Payment Services Act, clear regulatory framework' 
        },
        'SG': { 
          name: 'Singapore', 
          region: 'Asia', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'Progressive DPT framework, MAS oversight' 
        },
        'GB': { 
          name: 'United Kingdom', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'FCA regulation, comprehensive framework' 
        },
        'CA': { 
          name: 'Canada', 
          region: 'North America', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'Provincial regulation, securities commission oversight' 
        },
        'CH': { 
          name: 'Switzerland', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'Federal Council regulation, crypto valley' 
        },
        'AU': { 
          name: 'Australia', 
          region: 'Oceania', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'AUSTRAC oversight, licensing framework' 
        },
        'KR': { 
          name: 'South Korea', 
          region: 'Asia', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Virtual Asset Service Provider framework' 
        },
        'IN': { 
          name: 'India', 
          region: 'Asia', 
          crypto_friendly: false, 
          regulatory_status: 'hostile',
          notes: 'Heavy taxation, regulatory uncertainty' 
        },
        'BR': { 
          name: 'Brazil', 
          region: 'South America', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Central Bank regulation, emerging framework' 
        },
        'DE': { 
          name: 'Germany', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'BaFin supervision, EU MiCA compliance' 
        },
        'FR': { 
          name: 'France', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'AMF oversight, EU MiCA framework' 
        },
        'IT': { 
          name: 'Italy', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Consob regulation, EU compliance' 
        },
        'ES': { 
          name: 'Spain', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Bank of Spain oversight, EU framework' 
        },
        'NL': { 
          name: 'Netherlands', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'DNB supervision, EU MiCA compliance' 
        },
        'SE': { 
          name: 'Sweden', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Finansinspektionen oversight' 
        },
        'NO': { 
          name: 'Norway', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Finanstilsynet regulation' 
        },
        'DK': { 
          name: 'Denmark', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'DFSA oversight, EU framework' 
        },
        'FI': { 
          name: 'Finland', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'FIN-FSA supervision' 
        },
        'AT': { 
          name: 'Austria', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'FMA oversight, EU compliance' 
        },
        'BE': { 
          name: 'Belgium', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'FSMA regulation, EU framework' 
        },
        'PT': { 
          name: 'Portugal', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'Bank of Portugal oversight, favorable taxation' 
        },
        'IE': { 
          name: 'Ireland', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Central Bank oversight, EU framework' 
        },
        'LU': { 
          name: 'Luxembourg', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'CSSF oversight, blockchain initiative' 
        },
        'MT': { 
          name: 'Malta', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'MFSA regulation, blockchain island' 
        },
        'EE': { 
          name: 'Estonia', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'FIU licensing, digital innovation' 
        },
        'LT': { 
          name: 'Lithuania', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'Bank of Lithuania oversight' 
        },
        'LV': { 
          name: 'Latvia', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'FCMC supervision' 
        },
        'PL': { 
          name: 'Poland', 
          region: 'Europe', 
          crypto_friendly: false, 
          regulatory_status: 'hostile',
          notes: 'NBP warnings, regulatory uncertainty' 
        },
        'CZ': { 
          name: 'Czech Republic', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'CNB oversight, emerging framework' 
        },
        'HU': { 
          name: 'Hungary', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'MNB supervision' 
        },
        'SK': { 
          name: 'Slovakia', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'NBS oversight, EU framework' 
        },
        'SI': { 
          name: 'Slovenia', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Bank of Slovenia oversight' 
        },
        'HR': { 
          name: 'Croatia', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'CNB supervision, EU compliance' 
        },
        'BG': { 
          name: 'Bulgaria', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'BNB oversight' 
        },
        'RO': { 
          name: 'Romania', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'NBR supervision' 
        },
        'GR': { 
          name: 'Greece', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Bank of Greece oversight' 
        },
        'CY': { 
          name: 'Cyprus', 
          region: 'Europe', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'CySEC regulation' 
        },
        'RU': { 
          name: 'Russia', 
          region: 'Europe', 
          crypto_friendly: false, 
          regulatory_status: 'hostile',
          notes: 'Central Bank restrictions, regulatory uncertainty' 
        },
        'TR': { 
          name: 'Turkey', 
          region: 'Europe', 
          crypto_friendly: false, 
          regulatory_status: 'hostile',
          notes: 'Payment ban, CBRT restrictions' 
        },
        'IL': { 
          name: 'Israel', 
          region: 'Middle East', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'ISA oversight, emerging framework' 
        },
        'AE': { 
          name: 'UAE', 
          region: 'Middle East', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'VARA regulation, Dubai framework' 
        },
        'SA': { 
          name: 'Saudi Arabia', 
          region: 'Middle East', 
          crypto_friendly: false, 
          regulatory_status: 'hostile',
          notes: 'SAMA restrictions' 
        },
        'EG': { 
          name: 'Egypt', 
          region: 'Africa', 
          crypto_friendly: false, 
          regulatory_status: 'hostile',
          notes: 'CBE restrictions' 
        },
        'ZA': { 
          name: 'South Africa', 
          region: 'Africa', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'SARB oversight, emerging framework' 
        },
        'NG': { 
          name: 'Nigeria', 
          region: 'Africa', 
          crypto_friendly: false, 
          regulatory_status: 'hostile',
          notes: 'CBN restrictions, regulatory uncertainty' 
        },
        'KE': { 
          name: 'Kenya', 
          region: 'Africa', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'CBK guidelines, emerging framework' 
        },
        'MX': { 
          name: 'Mexico', 
          region: 'North America', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Banxico oversight, Fintech Law' 
        },
        'AR': { 
          name: 'Argentina', 
          region: 'South America', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'BCRA guidelines, high adoption' 
        },
        'CL': { 
          name: 'Chile', 
          region: 'South America', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'BCCh oversight' 
        },
        'CO': { 
          name: 'Colombia', 
          region: 'South America', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'SFC regulation' 
        },
        'PE': { 
          name: 'Peru', 
          region: 'South America', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'BCRP guidelines' 
        },
        'UY': { 
          name: 'Uruguay', 
          region: 'South America', 
          crypto_friendly: true, 
          regulatory_status: 'friendly',
          notes: 'BCU oversight, progressive approach' 
        },
        'VE': { 
          name: 'Venezuela', 
          region: 'South America', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'Petro adoption, BCV oversight' 
        },
        'TH': { 
          name: 'Thailand', 
          region: 'Asia', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'BOT oversight, SEC regulation' 
        },
        'MY': { 
          name: 'Malaysia', 
          region: 'Asia', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'BNM oversight, SC regulation' 
        },
        'ID': { 
          name: 'Indonesia', 
          region: 'Asia', 
          crypto_friendly: false, 
          regulatory_status: 'hostile',
          notes: 'BI restrictions, commodity trading only' 
        },
        'PH': { 
          name: 'Philippines', 
          region: 'Asia', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'BSP oversight, progressive framework' 
        },
        'VN': { 
          name: 'Vietnam', 
          region: 'Asia', 
          crypto_friendly: false, 
          regulatory_status: 'hostile',
          notes: 'SBV restrictions, payment ban' 
        },
        'TW': { 
          name: 'Taiwan', 
          region: 'Asia', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'CBC oversight, FSC regulation' 
        },
        'HK': { 
          name: 'Hong Kong', 
          region: 'Asia', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'HKMA oversight, SFC regulation' 
        },
        'NZ': { 
          name: 'New Zealand', 
          region: 'Oceania', 
          crypto_friendly: true, 
          regulatory_status: 'regulated',
          notes: 'RBNZ oversight, FMA regulation' 
        }
      };

      // Generate country data from news mentions
      const countryData: CountryRegulation[] = [];
      let id = 1;

      // Add countries with news mentions
      Object.entries(countryMentions).forEach(([countryCode, data]) => {
        const countryInfo = countryMapping[countryCode];
        if (countryInfo) {
          const positiveSentiment = data.sentiment.filter(s => s === 'positive').length;
          const totalSentiment = data.sentiment.length;
          const sentimentScore = totalSentiment > 0 ? positiveSentiment / totalSentiment : 0.5;
          
          countryData.push({
            id: id++,
            name: countryInfo.name,
            code: countryCode,
            region: countryInfo.region,
            crypto_friendly: countryInfo.crypto_friendly,
            regulatory_status: countryInfo.regulatory_status,
            stablecoins_accepted: Array.from(data.stablecoins),
            last_updated: new Date().toISOString(),
            notes: `${countryInfo.notes} (${data.count} recent mentions, ${Math.round(sentimentScore * 100)}% positive sentiment)`
          });
        }
      });

      // Add important countries not mentioned in news with default data
      const importantCountries = ['JP', 'DE', 'FR', 'SG', 'CH', 'AU', 'CA', 'GB'];
      importantCountries.forEach(countryCode => {
        if (!countryMentions[countryCode] && countryMapping[countryCode]) {
          const countryInfo = countryMapping[countryCode];
          countryData.push({
            id: id++,
            name: countryInfo.name,
            code: countryCode,
            region: countryInfo.region,
            crypto_friendly: countryInfo.crypto_friendly,
            regulatory_status: countryInfo.regulatory_status,
            stablecoins_accepted: ['USDC', 'USDT', 'DAI'], // Default common stablecoins
            last_updated: new Date().toISOString(),
            notes: countryInfo.notes
          });
        }
      });

      console.log(`📊 Generated country data for ${countryData.length} countries from backend analysis`);
      return countryData;
    } catch (error) {
      console.error('❌ Error fetching country data from news:', error);
      return getMockCountryData();
    }
  };

  const getMockCountryData = (): CountryRegulation[] => [
    {
      id: 1,
      name: 'United States',
      code: 'US',
      region: 'North America',
      crypto_friendly: true,
      regulatory_status: 'regulated',
      stablecoins_accepted: ['USDC', 'USDT', 'DAI'],
      last_updated: new Date().toISOString(),
      notes: 'Mixed federal and state regulation'
    },
    {
      id: 2,
      name: 'European Union',
      code: 'EU',
      region: 'Europe',
      crypto_friendly: true,
      regulatory_status: 'regulated',
      stablecoins_accepted: ['USDC', 'USDT', 'DAI', 'EURS'],
      last_updated: new Date().toISOString(),
      notes: 'MiCA Regulation'
    },
    {
      id: 3,
      name: 'China',
      code: 'CN',
      region: 'Asia',
      crypto_friendly: false,
      regulatory_status: 'hostile',
      stablecoins_accepted: [],
      last_updated: new Date().toISOString(),
      notes: 'Comprehensive ban'
    }
  ];

  const getMockNewsData = (): StablecoinNews[] => [
    {
      id: '1',
      title: 'New EU MiCA Regulation Impacts Stablecoin Issuers',
      summary: 'The European Union\'s Markets in Crypto-Assets regulation introduces new requirements for stablecoin issuers.',
      url: 'https://example.com/news/1',
      published_date: new Date().toISOString(),
      category: 'regulation',
      impact_score: 8.5,
      source: 'EU Regulatory News',
      stablecoins_mentioned: ['USDC', 'USDT', 'DAI'],
      countries_mentioned: ['EU'],
      sentiment: 'neutral'
    },
    {
      id: '2',
      title: 'Stablecoin Market Cap Reaches New Milestone',
      summary: 'Total market capitalization of stablecoins surpasses $150 billion amid growing adoption.',
      url: 'https://example.com/news/2',
      published_date: new Date(Date.now() - 86400000).toISOString(),
      category: 'market',
      impact_score: 7.2,
      source: 'Crypto Market Watch',
      stablecoins_mentioned: ['USDC', 'USDT'],
      countries_mentioned: ['US'],
      sentiment: 'positive'
    },
    {
      id: '3',
      title: 'Circle Announces USDC 2.0 with Enhanced Transparency',
      summary: 'Circle introduces new features for USDC including real-time attestations and improved regulatory compliance.',
      url: 'https://example.com/news/3',
      published_date: new Date(Date.now() - 172800000).toISOString(),
      category: 'technology',
      impact_score: 7.8,
      source: 'Circle Blog',
      stablecoins_mentioned: ['USDC'],
      countries_mentioned: ['US'],
      sentiment: 'positive'
    },
    {
      id: '4',
      title: 'Bank of Japan Explores Digital Yen Stablecoin Framework',
      summary: 'Japan\'s central bank announces pilot program for digital yen with private sector partnerships.',
      url: 'https://example.com/news/4',
      published_date: new Date(Date.now() - 259200000).toISOString(),
      category: 'regulation',
      impact_score: 9.1,
      source: 'Bank of Japan',
      stablecoins_mentioned: ['JPY Coin'],
      countries_mentioned: ['JP'],
      sentiment: 'positive'
    },
    {
      id: '5',
      title: 'Tether Improves Transparency with Monthly Attestations',
      summary: 'USDT issuer Tether commits to monthly third-party attestations of reserves following regulatory pressure.',
      url: 'https://example.com/news/5',
      published_date: new Date(Date.now() - 345600000).toISOString(),
      category: 'regulation',
      impact_score: 6.9,
      source: 'Tether Ltd',
      stablecoins_mentioned: ['USDT'],
      countries_mentioned: ['US'],
      sentiment: 'neutral'
    },
    {
      id: '6',
      title: 'Singapore Updates Stablecoin Regulatory Guidelines',
      summary: 'Monetary Authority of Singapore publishes updated guidelines for stablecoin issuers and service providers.',
      url: 'https://example.com/news/6',
      published_date: new Date(Date.now() - 432000000).toISOString(),
      category: 'regulation',
      impact_score: 8.3,
      source: 'MAS Singapore',
      stablecoins_mentioned: ['USDC', 'USDT'],
      countries_mentioned: ['SG'],
      sentiment: 'neutral'
    },
    {
      id: '7',
      title: 'DAI Governance Votes on Savings Rate Increase',
      summary: 'MakerDAO community approves proposal to increase DAI Savings Rate to 3.5% amid rising market rates.',
      url: 'https://example.com/news/7',
      published_date: new Date(Date.now() - 518400000).toISOString(),
      category: 'market',
      impact_score: 6.2,
      source: 'MakerDAO',
      stablecoins_mentioned: ['DAI'],
      countries_mentioned: ['US'],
      sentiment: 'positive'
    },
    {
      id: '8',
      title: 'UK Treasury Consults on Stablecoin Regulation Framework',
      summary: 'HM Treasury launches public consultation on comprehensive regulatory framework for stablecoins.',
      url: 'https://example.com/news/8',
      published_date: new Date(Date.now() - 604800000).toISOString(),
      category: 'regulation',
      impact_score: 7.7,
      source: 'HM Treasury',
      stablecoins_mentioned: ['USDC', 'USDT', 'DAI'],
      countries_mentioned: ['GB'],
      sentiment: 'neutral'
    },
    {
      id: '9',
      title: 'PayPal USD (PYUSD) Expands to European Markets',
      summary: 'PayPal announces the expansion of its PYUSD stablecoin to European markets following regulatory approval.',
      url: 'https://example.com/news/9',
      published_date: new Date(Date.now() - 691200000).toISOString(),
      category: 'market',
      impact_score: 7.4,
      source: 'PayPal',
      stablecoins_mentioned: ['PYUSD'],
      countries_mentioned: ['US', 'EU'],
      sentiment: 'positive'
    },
    {
      id: '10',
      title: 'Federal Reserve Research on CBDC vs Stablecoins',
      summary: 'Fed releases comprehensive research comparing central bank digital currencies with private stablecoins.',
      url: 'https://example.com/news/10',
      published_date: new Date(Date.now() - 777600000).toISOString(),
      category: 'regulation',
      impact_score: 8.8,
      source: 'Federal Reserve',
      stablecoins_mentioned: ['USDC', 'USDT'],
      countries_mentioned: ['US'],
      sentiment: 'neutral'
    },
    {
      id: '11',
      title: 'Terra USD (UST) Collapse Analysis and Lessons Learned',
      summary: 'Comprehensive analysis of algorithmic stablecoin failures and regulatory implications.',
      url: 'https://example.com/news/11',
      published_date: new Date(Date.now() - 864000000).toISOString(),
      category: 'market',
      impact_score: 9.5,
      source: 'Financial Times',
      stablecoins_mentioned: ['UST'],
      countries_mentioned: ['KR'],
      sentiment: 'negative'
    },
    {
      id: '12',
      title: 'Swiss National Bank Studies Wholesale CBDC Integration',
      summary: 'SNB explores integration of wholesale central bank digital currency with existing stablecoin infrastructure.',
      url: 'https://example.com/news/12',
      published_date: new Date(Date.now() - 950400000).toISOString(),
      category: 'technology',
      impact_score: 7.1,
      source: 'Swiss National Bank',
      stablecoins_mentioned: ['USDC'],
      countries_mentioned: ['CH'],
      sentiment: 'positive'
    }
  ];

  // Fetch news data from OSINT service
  // Helper function to map source IDs to source names
  const getSourceName = (sourceId: number): string => {
    const sourceMap: { [key: number]: string } = {
      1: 'CoinDesk',
      2: 'Cointelegraph', 
      3: 'The Block',
      4: 'Decrypt',
      5: 'CryptoNews',
      6: 'Blockworks'
    };
    return sourceMap[sourceId] || `Source ${sourceId}`;
  };

  const fetchNewsData = async () => {
    try {
      // Use environment variable or fallback to localhost
      const apiUrl = import.meta.env.VITE_STABLECOIN_OSINT_API_URL || 'http://localhost:8080';
      const endpoint = `${apiUrl}/api/v1/news/articles?limit=50`;
      
      console.log('🔄 Fetching news from backend...', endpoint);
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📰 Backend news response:', {
        total: data.total,
        count: data.count,
        articles: data.articles?.length || 0
      });

      // If no articles, try fresh endpoint to trigger scraping
      if (data.articles?.length === 0) {
        console.log('🔄 No cached news found, trying fresh endpoint...');
        const freshResponse = await fetch(`${apiUrl}/api/v1/news/articles/fresh?limit=50`);
        if (freshResponse.ok) {
          const freshData = await freshResponse.json();
          console.log('📰 Fresh news response:', {
            total: freshData.total,
            triggered_scraping: freshData.triggered_scraping
          });
          
          // If still no data, use mock data
          if (freshData.articles?.length === 0) {
            console.log('📰 Using mock news data');
            return getMockNewsData();
          }
          
          // Transform backend data to our format
          return freshData.articles.map((article: any) => ({
            id: article.id.toString(),
            title: article.title,
            summary: article.summary || article.content?.substring(0, 200) + '...' || 'No summary available',
            url: article.url,
            published_date: article.published_at || article.created_at,
            category: article.category || 'general',
            impact_score: article.impact_score || 5.0,
            source: getSourceName(article.source_id) || 'Unknown Source',
            stablecoins_mentioned: article.mentioned_stablecoins || [],
            countries_mentioned: article.mentioned_countries || [],
            sentiment: article.sentiment || 'neutral'
          }));
        }
      }
      
      // Transform backend data to our format if we have articles
      if (data.articles?.length > 0) {
        console.log('📰 Transforming backend articles:', data.articles.length);
        return data.articles.map((article: any) => ({
          id: article.id.toString(),
          title: article.title,
          summary: article.summary || article.content?.substring(0, 200) + '...' || 'No summary available',
          url: article.url,
          published_date: article.published_at || article.created_at,
          category: article.category || 'general',
          impact_score: article.impact_score || 5.0,
          source: getSourceName(article.source_id) || 'Unknown Source',
          stablecoins_mentioned: article.mentioned_stablecoins || [],
          countries_mentioned: article.mentioned_countries || [],
          sentiment: article.sentiment || 'neutral'
        }));
      }
      
      // Fallback to mock data
      return getMockNewsData();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Error fetching news:', errorMessage);
      // Fallback to mock data on error
      return getMockNewsData();
    }
  };

  // Fetch data from OSINT services
  const fetchData = async () => {
    setOsintLoading(true);
    
    try {
      // Fetch news data from backend
      const newsResponse = await fetchNewsData();
      setNewsData(newsResponse);
      
      // Check if we're using real data or mock data
      setIsUsingMockData(newsResponse.length <= 12); // If we have more than 12 articles, it's likely real data
      
      // Fetch real country data from news analysis
      const countryResponse = await fetchCountryDataFromNews();
      setCountryData(countryResponse);
      
      // Fetch real-time stablecoin monitoring data
      await fetchStablecoinData();
    } catch (error) {
      console.warn('OSINT services unavailable, using mock data:', error);
      
      // Fallback to mock data
      setCountryData(getMockCountryData());
      setNewsData(getMockNewsData());
      setIsUsingMockData(true);
    } finally {
      setOsintLoading(false);
    }
  };

  // Fetch stablecoin monitoring data
  const fetchStablecoinData = async () => {
    setMonitorLoading(true);
    
    try {
      const response = await apiService.getStablecoinData();
      setStablecoinData(response.stablecoins);
      
      // Advanced deduplication: Remove alerts with similar content
      const seenAlerts = new Set<string>();
      const uniqueAlerts = response.alerts.filter(alert => {
        // Create a signature based on key properties
        const signature = `${alert.coin_symbol}-${alert.alert_type}-${Math.round(alert.deviation * 100)}`;
        
        if (seenAlerts.has(signature)) {
          return false; // Skip duplicate
        }
        
        seenAlerts.add(signature);
        return true;
      })
      // Sort by severity and timestamp, then limit to 5 most recent/important
      .sort((a, b) => {
        const severityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        const severityDiff = (severityOrder[b.severity as keyof typeof severityOrder] || 0) - 
                           (severityOrder[a.severity as keyof typeof severityOrder] || 0);
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      })
      .slice(0, 5); // Limit to 5 alerts maximum
      
      setStablecoinAlerts(uniqueAlerts);
    } catch (error) {
      console.warn('Stablecoin monitor service unavailable:', error);
      // Set empty data on error
      setStablecoinData([]);
      setStablecoinAlerts([]);
    } finally {
      setMonitorLoading(false);
    }
  };

  // Filter functions
  const filteredNews = newsData.filter(article => {
    if (newsCategory !== 'all' && article.category !== newsCategory) return false;
    if (selectedStablecoin !== 'all' && !article.stablecoins_mentioned.includes(selectedStablecoin)) return false;
    return true;
  });

  // Get unique regions for filter
  const regions = ['all', ...Array.from(new Set(countryData.map(c => c.region)))];

  useEffect(() => {
    fetchData();
    fetchStablecoinData();
  }, []);

  const handleTabChange = (_: any, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          🪙 Stablecoin Monitoring
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Real-time stablecoin tracking, regulatory monitoring, and global compliance insights
        </Typography>
      </Box>

      {/* Service Status Alert */}
      {isUsingMockData && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Demo Mode</AlertTitle>
          OSINT services are currently unavailable. Displaying demo data for testing purposes.
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab 
            label="Monitoring Dashboard" 
            icon={<Article />} 
            iconPosition="start"
          />
          <Tab 
            label="News & Alerts" 
            icon={<Article />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Main Content */}
      {activeTab === 0 && (
        <Box>
          {/* Filters */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <FormControl fullWidth>
                    <InputLabel>Stablecoin</InputLabel>
                    <Select
                      value={selectedStablecoin}
                      label="Stablecoin"
                      onChange={(e) => setSelectedStablecoin(e.target.value)}
                    >
                      <MenuItem value="all">All Stablecoins</MenuItem>
                      <MenuItem value="USDC">USDC</MenuItem>
                      <MenuItem value="USDT">USDT</MenuItem>
                      <MenuItem value="DAI">DAI</MenuItem>
                      <MenuItem value="BUSD">BUSD</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <FormControl fullWidth>
                    <InputLabel>Region</InputLabel>
                    <Select
                      value={selectedRegion}
                      label="Region"
                      onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                      {regions.map((region) => (
                        <MenuItem key={region} value={region}>
                          {region === 'all' ? 'All Regions' : region}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Stablecoin Depegging Monitor */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      🪙 Stablecoin Depegging Monitor
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {stablecoinData.length} stablecoins monitored
                      </Typography>
                      <IconButton
                        onClick={fetchStablecoinData}
                        disabled={monitorLoading}
                        size="small"
                      >
                        <Refresh />
                      </IconButton>
                    </Box>
                  </Box>

                  {monitorLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                      <Typography sx={{ ml: 2 }}>Loading stablecoin data...</Typography>
                    </Box>
                  ) : stablecoinData.length === 0 ? (
                    <Alert severity="warning">
                      No stablecoin monitoring data available. The monitoring service may be offline.
                    </Alert>
                  ) : (
                    <Grid container spacing={2}>
                      {stablecoinData.map((coin) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={coin.symbol}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              borderColor: coin.status === 'depegged' ? 'error.main' : 
                                          coin.status === 'warning' ? 'warning.main' : 'success.main',
                              borderWidth: 2,
                            }}
                          >
                            <CardContent sx={{ pb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {coin.symbol}
                                </Typography>
                                <Chip
                                  label={coin.status.toUpperCase()}
                                  color={
                                    coin.status === 'depegged' ? 'error' :
                                    coin.status === 'warning' ? 'warning' : 'success'
                                  }
                                  size="small"
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {coin.name}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Current Price:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  ${coin.current_price.toFixed(4)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Deviation:</Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 600,
                                    color: Math.abs(coin.deviation_percentage) > 0.5 ? 'error.main' :
                                           Math.abs(coin.deviation_percentage) > 0.2 ? 'warning.main' : 'success.main'
                                  }}
                                >
                                  {coin.deviation_percentage > 0 ? '+' : ''}{coin.deviation_percentage.toFixed(2)}%
                                </Typography>
                              </Box>
                              {coin.market_cap && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2">Market Cap:</Typography>
                                  <Typography variant="body2">
                                    ${(coin.market_cap / 1e9).toFixed(2)}B
                                  </Typography>
                                </Box>
                              )}
                              <Typography variant="caption" color="text.secondary">
                                Updated: {new Date(coin.last_updated).toLocaleTimeString()}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {/* Active Alerts */}
                  {stablecoinAlerts.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        🚨 Active Alerts
                      </Typography>
                      <List>
                        {stablecoinAlerts.slice(0, 5).map((alert) => (
                          <ListItem key={alert.id} divider>
                            <ListItemIcon>
                              <Chip
                                label={alert.severity.toUpperCase()}
                                color={
                                  alert.severity === 'critical' ? 'error' :
                                  alert.severity === 'high' ? 'warning' : 'info'
                                }
                                size="small"
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${alert.coin_symbol}: ${alert.message}`}
                              secondary={`Price: $${alert.price_at_alert.toFixed(4)} | Deviation: ${alert.deviation.toFixed(2)}% | ${new Date(alert.timestamp).toLocaleString()}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* News Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* News Controls */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>News Category</InputLabel>
                  <Select
                    value={newsCategory}
                    label="News Category"
                    onChange={(e) => setNewsCategory(e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="regulation">Regulation</MenuItem>
                    <MenuItem value="technology">Technology</MenuItem>
                    <MenuItem value="market">Market</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Items per page</InputLabel>
                  <Select
                    value={newsPerPage}
                    label="Items per page"
                    onChange={(e) => {
                      setNewsPerPage(e.target.value as number);
                      setNewsPage(1); // Reset to first page
                    }}
                  >
                    <MenuItem value={5}>5 per page</MenuItem>
                    <MenuItem value={10}>10 per page</MenuItem>
                    <MenuItem value={20}>20 per page</MenuItem>
                    <MenuItem value={50}>50 per page</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          
          {/* News Stats */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📊 News Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {filteredNews.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Articles
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {filteredNews.filter(n => n.category === 'regulation').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Regulation
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                      {filteredNews.filter(n => n.category === 'market').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Market News
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      {filteredNews.filter(n => n.category === 'technology').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Technology
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* News List */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    <Article sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Latest Stablecoin News
                  </Typography>
                  <Button
                    startIcon={<Refresh />}
                    onClick={fetchData}
                    disabled={osintLoading}
                    size="small"
                  >
                    Refresh
                  </Button>
                </Box>

                {osintLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading news...</Typography>
                  </Box>
                ) : filteredNews.length === 0 ? (
                  <Alert severity="info">
                    No news articles found for the selected filters.
                  </Alert>
                ) : (
                  <>
                    {/* Pagination Info */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Showing {((newsPage - 1) * newsPerPage) + 1}-{Math.min(newsPage * newsPerPage, filteredNews.length)} of {filteredNews.length} articles
                      </Typography>
                      {filteredNews.length > newsPerPage && (
                        <Pagination
                          count={Math.ceil(filteredNews.length / newsPerPage)}
                          page={newsPage}
                          onChange={(_, page) => setNewsPage(page)}
                          size="small"
                        />
                      )}
                    </Box>
                    
                    <List>
                      {filteredNews.slice((newsPage - 1) * newsPerPage, newsPage * newsPerPage).map((article) => (
                        <ListItem key={article.id} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2, p: 2 }}>
                          <ListItemIcon>
                            <Article color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', mr: 2 }}>
                                  {article.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                                  <Chip 
                                    label={article.category} 
                                    size="small" 
                                    color={
                                      article.category === 'regulation' ? 'primary' :
                                      article.category === 'market' ? 'success' :
                                      article.category === 'technology' ? 'info' :
                                      article.category === 'security' ? 'error' :
                                      article.category === 'audit' ? 'warning' :
                                      article.category === 'compliance' ? 'secondary' : 'default'
                                    }
                                  />
                                  <Chip 
                                    label={article.sentiment} 
                                    size="small" 
                                    variant="outlined"
                                    color={
                                      article.sentiment === 'positive' ? 'success' :
                                      article.sentiment === 'negative' ? 'error' : 'default'
                                    }
                                  />
                                </Box>
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {article.summary}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="caption" color="text.secondary">
                                      Source: {article.source}
                                    </Typography>
                                    {article.impact_score && (
                                      <Typography variant="caption" color="text.secondary">
                                        Impact: {article.impact_score}/10
                                      </Typography>
                                    )}
                                    {article.stablecoins_mentioned?.length > 0 && (
                                      <Typography variant="caption" color="text.secondary">
                                        Coins: {article.stablecoins_mentioned.join(', ')}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(article.published_date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                          <IconButton
                            onClick={() => window.open(article.url, '_blank')}
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            <OpenInNew />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>

                    {/* Bottom Pagination */}
                    {filteredNews.length > newsPerPage && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                          count={Math.ceil(filteredNews.length / newsPerPage)}
                          page={newsPage}
                          onChange={(_, page) => setNewsPage(page)}
                          showFirstButton
                          showLastButton
                        />
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StablecoinMonitoring;
