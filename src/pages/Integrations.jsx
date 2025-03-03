import React, { useState, useEffect } from 'react';
import { useAuth } from '@nfid/identitykit/react';
import { toast } from 'react-hot-toast';

const PLATFORMS = {
  DISCORD: {
    name: 'Discord',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.075.075 0 01-.008-.125c.126-.095.252-.193.372-.292a.075.075 0 01.078-.01c3.927 1.793 8.18 1.793 12.061 0a.075.075 0 01.079.01c.12.098.246.198.373.292.044.032.04.1-.006.125a12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
      </svg>
    ),
    color: 'indigo'
  },
  TELEGRAM: {
    name: 'Telegram',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    color: 'blue'
  },
  TWITTER: {
    name: 'Twitter',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
      </svg>
    ),
    color: 'sky'
  }
};

function Integrations() {
  const { user } = useAuth();
  const [isStarted, setIsStarted] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [username, setUsername] = useState('');
  const [openchatUsername, setOpenchatUsername] = useState('');
  const [aiSummary, setAiSummary] = useState(false);
  const [integrations, setIntegrations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Load integrations from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`integrations_${user.principal}`);
      if (saved) {
        setIntegrations(JSON.parse(saved));
      }
    }
  }, [user]);

  // Save integrations to localStorage
  const saveToStorage = (newIntegrations) => {
    if (user) {
      localStorage.setItem(`integrations_${user.principal}`, JSON.stringify(newIntegrations));
      setIntegrations(newIntegrations);
    }
  };

  const handleStartIntegration = () => {
    setIsStarted(true);
    setSelectedPlatform(null);
    setUsername('');
    setOpenchatUsername('');
    setAiSummary(false);
    setEditingId(null);
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
  };

  const handleSave = () => {
    if (!username || !openchatUsername) {
      toast.error('Please fill in all fields');
      return;
    }

    const integration = {
      id: editingId || `integration_${Date.now()}`,
      platform: selectedPlatform,
      username,
      openchatUsername,
      aiSummary,
      createdAt: editingId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newIntegrations = editingId 
      ? integrations.map(i => i.id === editingId ? integration : i)
      : [...integrations, integration];

    saveToStorage(newIntegrations);
    toast.success(editingId ? 'Integration updated successfully' : 'Integration created successfully');
    setIsStarted(false);
  };

  const handleEdit = (integration) => {
    setEditingId(integration.id);
    setSelectedPlatform(integration.platform);
    setUsername(integration.username);
    setOpenchatUsername(integration.openchatUsername);
    setAiSummary(integration.aiSummary);
    setIsStarted(true);
  };

  const handleDelete = (integrationId) => {
    const newIntegrations = integrations.filter(i => i.id !== integrationId);
    saveToStorage(newIntegrations);
    toast.success('Integration deleted successfully');
  };

  if (!isStarted) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Integrations
            </h1>
            <button
              onClick={handleStartIntegration}
              className="px-6 py-3 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create New Integration
            </button>
          </div>

          {/* List existing integrations */}
          <div className="grid gap-4 mt-6">
            {integrations.map((integration) => (
              <div 
                key={integration.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className={`text-${PLATFORMS[integration.platform].color}-500`}>
                    {PLATFORMS[integration.platform].icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {integration.username}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      OpenChat: {integration.openchatUsername}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Created {new Date(integration.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(integration)}
                    className="p-2 text-blue-500 hover:text-blue-600"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(integration.id)}
                    className="p-2 text-red-500 hover:text-red-600"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {integrations.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No integrations yet. Click the button above to create one.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Create New Integration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your favorite platform with OpenChat
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Platform Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              1. Select Platform
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(PLATFORMS).map(([key, platform]) => (
                <button
                  key={key}
                  onClick={() => handlePlatformSelect(key)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedPlatform === key
                      ? `border-${platform.color}-500 bg-${platform.color}-50 dark:bg-${platform.color}-900/20`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className={`text-${platform.color}-500 flex justify-center mb-3`}>
                    {platform.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {platform.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Platform Username */}
          {selectedPlatform && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                2. Platform Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {PLATFORMS[selectedPlatform].name} Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={`Enter your ${PLATFORMS[selectedPlatform].name} username`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: OpenChat Integration */}
          {username && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                3. OpenChat Integration
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    OpenChat Username
                  </label>
                  <input
                    type="text"
                    value={openchatUsername}
                    onChange={(e) => setOpenchatUsername(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your OpenChat username"
                  />
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <input
                    type="checkbox"
                    id="aiSummary"
                    checked={aiSummary}
                    onChange={(e) => setAiSummary(e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="aiSummary" className="text-sm text-gray-700 dark:text-gray-300">
                    Enable AI Summary for messages
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsStarted(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!username || !openchatUsername}
              className="px-6 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Integration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Integrations; 