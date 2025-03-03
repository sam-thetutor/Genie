import React, { useState, useEffect } from 'react';
import { useAuth } from '@nfid/identitykit/react';
import { toast } from 'react-hot-toast';
import CampaignDetails from './CampaignDetails';
import { useDatabase } from '../../hooks/useDatabase';

const FREQUENCY_OPTIONS = {
  DAILY: {
    label: 'Daily',
    value: 'daily',
    description: 'Post content every day at specified time'
  },
  WEEKLY: {
    label: 'Weekly',
    value: 'weekly',
    description: 'Post content on selected days of the week'
  },
  CUSTOM: {
    label: 'Custom',
    value: 'custom',
    description: 'Set custom schedule for each content'
  }
};

function Schedule() {
  const { user } = useAuth();
  const { 
    isLoading,
    error,
    createCampaign,
    getCampaigns,
    updateCampaign,
    deleteCampaign
  } = useDatabase();

  const [campaigns, setCampaigns] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  // Form states
  const [campaignName, setCampaignName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Load campaigns from database
  useEffect(() => {
    if (user) {
      loadCampaigns();
    }
  }, [user]);

  const loadCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err) {
      toast.error('Failed to load campaigns');
    }
  };

  const handleCreateCampaign = async () => {
    if (!campaignName || !apiKey || !startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newCampaign = {
        name: campaignName,
        apiKey,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        status: 'active',
      };

      await createCampaign(newCampaign);
      await loadCampaigns();
      setIsCreating(false);
      resetForm();
      toast.success('Campaign created successfully');
    } catch (err) {
      toast.error('Failed to create campaign');
    }
  };

  const resetForm = () => {
    setCampaignName('');
    setApiKey('');
    setStartDate('');
    setEndDate('');
  };

  const handleStatusToggle = async (campaignId) => {
    try {
      const campaign = campaigns.find(c => c._id === campaignId);
      const newStatus = campaign.status === 'active' ? 'paused' : 'active';
      await updateCampaign(campaignId, { status: newStatus });
      await loadCampaigns();
      toast.success(`Campaign ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update campaign status');
    }
  };

  const handleDelete = async (campaignId) => {
    try {
      const response = await deleteCampaign(campaignId);
      await loadCampaigns();
      toast.success(response.message || 'Campaign deleted successfully');
    } catch (err) {
      toast.error('Failed to delete campaign');
    }
  };

  if (selectedCampaign) {
    return (
      <CampaignDetails
        campaign={selectedCampaign} 
        onBack={() => setSelectedCampaign(null)} 
      />
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Schedule Campaigns
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={loadCampaigns}
              className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600"
            >
              Create Campaign
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md mb-4">
            <p className="text-red-600 dark:text-red-200">{error}</p>
          </div>
        )}

        {isCreating ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              New Campaign
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  OpenChat API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your OpenChat API key"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  className="px-6 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {campaigns?.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {campaign.name}
                      </h3>
                      {/* campgin apikey */}
                      {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                        {campaign.apiKey}
                      </p> */}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {/* {FREQUENCY_OPTIONS[campaign?.frequency?.toUpperCase()].label} •{' '} */}
                        {new Date(campaign.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {campaign.status === 'active' ? 'Active' : 'Paused'}
                    </span>
                    <button
                      onClick={() => handleStatusToggle(campaign._id)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {campaign.status === 'active' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="p-2 text-blue-500 hover:text-blue-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(campaign._id)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {campaigns.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No campaigns yet. Click the button above to create one.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;
