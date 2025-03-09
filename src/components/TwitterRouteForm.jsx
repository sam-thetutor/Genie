import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

function TwitterRouteForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    twitterUsername: initialData.twitterUsername || '',
    includeRetweets: initialData.includeRetweets || false,
    includeReplies: initialData.includeReplies || false,
    ...initialData
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Twitter Username
        </label>
        <input
          type="text"
          value={formData.twitterUsername}
          onChange={(e) => {
            const username = e.target.value.replace('@', '').trim();
            const newFormData = {
              ...formData,
              twitterUsername: username
            };
            setFormData(newFormData);
            onSubmit(newFormData);
          }}
          placeholder="@username"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
          required
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeRetweets}
            onChange={(e) => setFormData(prev => ({ ...prev, includeRetweets: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Include Retweets</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeReplies}
            onChange={(e) => setFormData(prev => ({ ...prev, includeReplies: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Include Replies</span>
        </label>
      </div>
    </div>
  );
}

export default TwitterRouteForm; 