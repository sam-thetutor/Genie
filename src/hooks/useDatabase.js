import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@nfid/identitykit/react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function useDatabase() {
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    metrics: null,
    recommendations: [],
    loading: false,
    error: null
  });

  // Helper function for API calls
  const apiCall = async (method, endpoint, data = null) => {
    setIsLoading(true);
    setError(null);
    console.log("data", data)
    try {
      const response = await axios({
        method,
        url: `${API_BASE_URL}${endpoint}`,
        data: data === null ? undefined : data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data || { message: 'Operation successful' };
    } catch (err) {
      const errorMessage = err.response?.data?.errors 
        ? err.response.data.errors.map(e => e.msg).join(', ')
        : err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      console.log('Error:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // AI Content Generation
  const generateAIContent = useCallback(async (prompt) => {
    return await apiCall('POST', '/generate-content', { prompt });
  }, []);

  // Campaign Operations
  const createCampaign = useCallback(async (campaignData) => {
    return await apiCall('POST', '/campaigns', campaignData);
  }, []);

  const getCampaigns = useCallback(async () => {
    const principal = user?.principal?.toString();
    console.log('Fetching campaigns for principal:', principal);
    return await apiCall('GET', `/campaigns?principal=${principal}`);
  }, [user?.principal]);

  const updateCampaign = useCallback(async (campaignId, updateData) => {
    return await apiCall('PUT', `/campaigns/${campaignId}`, updateData);
  }, []);

  const deleteCampaign = useCallback(async (campaignId) => {
    const principal = user?.principal?.toString();
    return await apiCall('DELETE', `/campaigns/${campaignId}`, { principal });
  }, [user?.principal]);

  const getCampaign = useCallback(async (campaignId) => {
    return await apiCall('GET', `/campaigns/${campaignId}`);
  }, []);

  // Content Operations
  const createContent = useCallback(async (contentData) => {
    return await apiCall('POST', '/contents', contentData);
  }, []);

  const getContents = useCallback(async (campaignId) => {
    return await apiCall('GET', `/contents?campaignId=${campaignId}`);
  }, []);

  const updateContent = useCallback(async (contentId, updateData) => {
    return await apiCall('PUT', `/contents/${contentId}`, updateData);
  }, []);

  
  const deleteContent = useCallback(async (contentId) => {
    if (!contentId) {
      throw new Error('Content ID is required');
    }
    console.log('Deleting content with ID:', contentId);
    return await apiCall('DELETE', `/contents/${contentId}`);
  }, []);

  // Route Operations
  const createRoute = useCallback(async (routeData) => {
    try {
      // Validate Twitter-specific requirements
      if (routeData.platform === 'twitter') {
        if (!routeData.twitterUsername) {
          throw new Error('Twitter username is required');
        }
      }

      const formattedData = {
        ...routeData,
        principal: user?.principal?.toString(),
        // Ensure sourceId is set correctly
        sourceId: routeData.platform === 'twitter' ? routeData.twitterUsername : routeData.sourceId
      };

      return await apiCall('POST', '/routes', formattedData);
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  }, [user?.principal]);

  const getRoutes = useCallback(async () => {
    const principal = user?.principal?.toString();
    return await apiCall('GET', `/routes?principal=${principal}`);
  }, [user?.principal]);

  const updateRoute = useCallback(async (routeId, updateData) => {
    // Format the data based on platform
    const formattedData = {
      ...updateData,
      principal: user?.principal?.toString(),
    };

    return await apiCall('PUT', `/routes/${routeId}`, {
      ...formattedData
    });
  }, [user?.principal]);

  const deleteRoute = useCallback(async (routeId) => {
    return await apiCall('DELETE', `/routes/${routeId}`, {
      principal: user?.principal?.toString()
    });
  }, [user?.principal]);

  const fetchAnalytics = async (userId) => {
    try {
      setAnalyticsData(prev => ({ ...prev, loading: true, error: null }));

      if (!userId) {
        throw new Error('Please connect your wallet first');
      }

      const [metrics, recommendations] = await Promise.all([
        apiCall('GET', `/analytics/patterns/${userId}`),
        apiCall('GET', `/analytics/recommendations/${userId}`)
      ]);

      setAnalyticsData({
        metrics,
        recommendations: recommendations.recommendations,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch analytics data'
      }));
    }
  };

  const fetchDashboardMetrics = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/dashboard/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw new Error('Failed to fetch dashboard metrics');
    }
  };

  return {
    isLoading,
    error,
    // Campaign operations
    createCampaign,
    getCampaigns,
    updateCampaign,
    deleteCampaign,
    getCampaign,
    // Content operations
    createContent,
    getContents,
    updateContent,
    deleteContent,
    // AI operations
    generateAIContent,
    // Route operations
    createRoute,
    getRoutes,
    updateRoute,
    deleteRoute,
    fetchDashboardMetrics,
    analyticsData,
    fetchAnalytics
  };
} 