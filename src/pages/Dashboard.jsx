import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';
import { useAuth } from '@nfid/identitykit/react';
import axios from 'axios';

function Dashboard() {
  const { user } = useAuth();
  const [bots, setBots] = useState([]);
  const [isNewBotModalOpen, setIsNewBotModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newBotName, setNewBotName] = useState('');
  const [editingBot, setEditingBot] = useState(null);
  const [botUrl, setBotUrl] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load bots from localStorage when component mounts
  useEffect(() => {
    const savedBots = localStorage.getItem(`bots_${user?.principal}`);
    if (savedBots) {
      setBots(JSON.parse(savedBots));
    }
  }, [user]);

  // Save bots to localStorage whenever they change
  useEffect(() => {
    if (user?.principal) {
      localStorage.setItem(`bots_${user.principal}`, JSON.stringify(bots));
    }
  }, [bots, user]);


  const handleCreateBot = () => {
    if (!newBotName.trim()) {
      toast.error('Please enter a bot name');
      return;
    }

    const newBot = {
      id: `bot_${Date.now()}`,
      name: newBotName.trim(),
      url: '',
      createdAt: new Date().toISOString(),
    };

    setBots([...bots, newBot]);
    setNewBotName('');
    setIsNewBotModalOpen(false);
    toast.success('Bot created successfully');
  };

  const handleDeleteBot = (botId) => {
    setBots(bots.filter(bot => bot.id !== botId));
    toast.success('Bot deleted successfully');
  };

  const handleEditClick = (bot) => {
    setEditingBot(bot);
    setBotUrl(bot.url || '');
    setBotDescription(bot.description || '');
    setIsEditModalOpen(true);
  };

  const fetchBotDetails = async () => {
    if (!botUrl) return;

    setIsLoading(true);
    try {
      // Make sure the URL is properly formatted
      let targetUrl = botUrl;
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
      }

      const response = await axios.get(targetUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log("api results:", response);
      
      const data = response.data;
      setBotDescription(data.image || 'No description available');
      toast.success('Bot details fetched successfully');
    } catch (error) {
      console.error('Axios error:', error);
      const errorMessage = error.response 
        ? `Error: ${error.response.status} - ${error.response.statusText}`
        : error.message;
      toast.error(errorMessage || 'Failed to fetch bot details');
      setBotDescription('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = () => {
    setBots(bots.map(bot => 
      bot.id === editingBot.id 
        ? { ...bot, url: botUrl, description: botDescription }
        : bot
    ));
    setIsEditModalOpen(false);
    toast.success('Bot updated successfully');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Bots</h1>
        <button
          onClick={() => setIsNewBotModalOpen(true)}
          className="bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Bot
        </button>
      </div>

      {/* Bots List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bots.map(bot => (
          <div
            key={bot.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{bot.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {bot.id}</p>
                {bot.url && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    URL: {bot.url}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(bot)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteBot(bot.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Bot Modal */}
      <Modal
        isOpen={isNewBotModalOpen}
        onClose={() => setIsNewBotModalOpen(false)}
        title="Create New Bot"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bot Name
            </label>
            <input
              type="text"
              value={newBotName}
              onChange={(e) => setNewBotName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter bot name"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsNewBotModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateBot}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Bot Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Bot"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bot Name
            </label>
            <input
              type="text"
              value={editingBot?.name || ''}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bot URL
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={botUrl}
                onChange={(e) => setBotUrl(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter bot URL"
              />
              <button
                onClick={fetchBotDetails}
                disabled={!botUrl || isLoading}
                className="mt-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300"
              >
                Fetch
              </button>
            </div>
          </div>
          {botDescription && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {botDescription}
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!botDescription}
              className="px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard; 