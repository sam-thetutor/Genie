import React, { useState } from 'react';

function RouteForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'telegram',
    sourceId: '',
    openchatApiKey: '',
    filters: {
      includeText: true,
      includeImages: true,
      includeLinks: true,
      keywords: []
    },
    ...initialData
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {initialData ? 'Edit Route' : 'New Route'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Route Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="My Telegram Route"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Platform
          </label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="telegram">Telegram</option>
            <option value="discord">Discord</option>
            <option value="twitter" disabled>Twitter (Coming Soon)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Source Channel ID
          </label>
          <div className="mb-2 text-sm text-gray-500">
            {formData.platform === 'telegram' ? (
              <>
                <ol className="list-decimal ml-4 mt-1">
                  <li>Add the bot (@your_bot_name) to your Telegram group</li>
                  <li>Make the bot an admin of the group</li>
                  <li>The bot will send a welcome message with the group ID</li>
                  <li>Copy that ID and paste it here</li>
                </ol>
              </>
            ) : (
              <>
                <ol className="list-decimal ml-4 mt-1">
                  <li>Enable Developer Mode in Discord Settings > App Settings > Advanced</li>
                  <li>
                    <a 
                      href={import.meta.env.VITE_DISCORD_BOT_INVITE_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Click here to add the bot to your Discord server
                    </a>
                  </li>
                  <li>Right-click the channel you want to monitor</li>
                  <li>Click "Copy Channel ID" and paste it here</li>
                </ol>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Required Bot Permissions:</h4>
                  <ul className="mt-2 list-disc list-inside text-blue-700 dark:text-blue-300">
                    <li>View Channels</li>
                    <li>Read Message History</li>
                    <li>Read Messages/View Channels</li>
                  </ul>
                </div>
              </>
            )}
            <p className="mt-2 text-yellow-600 dark:text-yellow-400">
              Note: The bot must be an admin to monitor messages.
            </p>
          </div>
          <input
            type="text"
            value={formData.sourceId}
            onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter the group ID (e.g., -1001234567890)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            OpenChat API Key
          </label>
          <input
            type="password"
            value={formData.openchatApiKey}
            onChange={(e) => setFormData({ ...formData, openchatApiKey: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter OpenChat API key"
            required
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600"
          >
            {initialData ? 'Update Route' : 'Create Route'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RouteForm; 