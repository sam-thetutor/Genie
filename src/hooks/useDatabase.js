import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@nfid/identitykit/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function useDatabase() {
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    return await apiCall('POST', '/routes', routeData);
  }, []);

  const getRoutes = useCallback(async () => {
    const principal = user?.principal?.toString();
    return await apiCall('GET', `/routes?principal=${principal}`);
  }, [user?.principal]);

  const updateRoute = useCallback(async (routeId, updateData) => {
    return await apiCall('PUT', `/routes/${routeId}`, {
      ...updateData,
      principal: user?.principal?.toString()
    });
  }, [user?.principal]);

  const deleteRoute = useCallback(async (routeId) => {
    return await apiCall('DELETE', `/routes/${routeId}`, {
      principal: user?.principal?.toString()
    });
  }, [user?.principal]);

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
  };
} 