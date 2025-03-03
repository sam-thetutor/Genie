import React from 'react';
import { useAuth } from '@nfid/identitykit/react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const allBots = getAllStoredBots();

  function getAllStoredBots() {
    // Get all items from localStorage
    const allBots = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Check if the key matches our bots pattern
      if (key.startsWith('bots_')) {
        try {
          const userBots = JSON.parse(localStorage.getItem(key));
          allBots.push(...userBots);
        } catch (error) {
          console.error('Error parsing bots from localStorage:', error);
        }
      }
    }
    return allBots;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Bot Store
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allBots.map((bot) => (
          <div
            key={bot.id}
            onClick={() => navigate(`/bot/${bot.id}`)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {bot.name}
            </h2>
            
            {bot.url && (
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">URL:</p>
                <a 
                  href={bot.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 break-all"
                >
                  {bot.url}
                </a>
              </div>
            )}
            
            {bot.description && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description:</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {bot.description}
                </p>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Created: {new Date(bot.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}

        {allBots.length === 0 && (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
            No bots available in the store yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
