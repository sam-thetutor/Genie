import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@nfid/identitykit/react';
import { toast } from 'react-hot-toast';
import { test } from 'botpacktest';
function BotDetails() {
  const { botId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groupId, setGroupId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get bot details from localStorage
  const bot = React.useMemo(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('bots_')) {
        const bots = JSON.parse(localStorage.getItem(key));
        const found = bots.find(b => b.id === botId);
        if (found) return found;
      }
    }
    return null;
  }, [botId]);

  console.log("ddddd",test({firstName:"John",lastName:"Doe",age:25}))

  const handleCreateInstance = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!groupId.trim() || !privateKey.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically make an API call to create the bot instance
      // For now, we'll just simulate it with localStorage
      const instance = {
        id: `instance_${Date.now()}`,
        botId: bot.id,
        botName: bot.name,
        groupId: groupId.trim(),
        createdAt: new Date().toISOString(),
        createdBy: user.principal.toString(),
        url: bot.url
      };

      // Save to localStorage
      const instances = JSON.parse(localStorage.getItem(`instances_${user.principal}`) || '[]');
      instances.push(instance);
      localStorage.setItem(`instances_${user.principal}`, JSON.stringify(instances));

      toast.success('Bot instance created successfully');
      navigate('/my-instances');
    } catch (error) {
      console.error('Error creating instance:', error);
      toast.error('Failed to create bot instance');
    } finally {
      setIsLoading(false);
    }
  };

  if (!bot) {
    return (
      <div className="p-6 text-center text-gray-500">
        Bot not found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {bot.name}
        </h1>

        {bot.description && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description:</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{bot.description}</p>
          </div>
        )}

        <form onSubmit={handleCreateInstance} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Group ID
            </label>
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter group ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Private Key
            </label>
            <input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter private key"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Instance'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BotDetails; 