import React, { useState } from 'react';
import TwitterRouteForm from '../../components/TwitterRouteForm';
import { toast } from 'react-hot-toast';
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const RouteForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'twitter',
    sourceId: '',
    openchatApiKey: '',
    twitterUsername: '',
    telegramUsername: '',
    discordUsername: '',
    includeRetweets: false,
    includeReplies: false,
    sourceType: 'telegram',
    destinationType: 'openchat',
    source: {
      chatId: '',
      username: ''
    },
    destination: {
      chatId: ''
    },
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
    
    if (!formData.name) {
      toast.error('Route name is required');
      return;
    }
    
    if (!formData.openchatApiKey) {
      toast.error('OpenChat API key is required');
      return;
    }

    if (formData.platform === 'twitter') {
      if (!formData.twitterUsername || formData.twitterUsername.trim() === '') {
        toast.error('Twitter username is required');
        return;
      }
    }

    if (formData.platform === 'telegram') {
      if (!formData.telegramUsername || formData.telegramUsername.trim() === '') {
        toast.error('Telegram username is required');
        return;
      }
    }

    const submitData = {
      ...formData,
      sourceType: formData.platform,
      destinationType: 'openchat',
      source: {
        chatId: formData.sourceId,
        username: formData.platform === 'telegram' ? formData.telegramUsername : 
                 formData.platform === 'discord' ? formData.discordUsername : 
                 formData.twitterUsername
      },
      destination: {
        chatId: formData.openchatApiKey
      },
      ...(formData.platform === 'twitter' && {
        twitterUsername: formData.twitterUsername.trim(),
        sourceId: formData.twitterUsername.trim()
      }),
    };

    onSubmit(submitData);
  };

  const renderPlatformSpecificFields = () => {
    switch(formData.platform) {
      case 'twitter':
        return (
          <TwitterRouteForm
            initialData={formData}
            onSubmit={(twitterData) => {
              setFormData(prev => ({
                ...prev,
                twitterUsername: twitterData.twitterUsername,
                includeRetweets: twitterData.includeRetweets,
                includeReplies: twitterData.includeReplies,
                sourceId: twitterData.twitterUsername,
                platform: 'twitter'
              }));
            }}
          />
        );
      case 'telegram':
        return (
          <>
            <div className="mb-2 text-sm text-gray-500">
              <ol className="list-decimal ml-4 mt-1">
                <li>Add the bot (@your_bot_name) to your Telegram group</li>
                <li>Make the bot an admin of the group</li>
                <li>The bot will send a welcome message with the group ID</li>
                <li>Copy that ID and paste it here</li>
              </ol>
            </div>
            
            <Input
              value={formData.sourceId}
              onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
              placeholder="Enter the group ID (e.g., -1001234567890)"
            />
            <div>

              <h3 className="text-sm font-semibold mt-3 text-gray-500">
                Telegram Username
              </h3>

              <Input
                className="mt-1"
                value={formData.telegramUsername}
                onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                placeholder="Enter the telegram username"
              />

            </div>
          </>
        );
      case 'discord':
        return (
          <>
            <div className="mb-2 text-sm text-gray-500">
              <ol className="list-decimal ml-4 mt-1">
                <li>Enable Developer Mode in Discord Settings - App Settings - Advanced</li>
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
            </div>
            <Input
              value={formData.sourceId}
              onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
              placeholder="Enter the channel ID"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {initialData ? 'Edit Route' : 'New Route'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Route Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter route name"
          />
        </div>

        <div>
          <Label>Platform</Label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
          >
            <option value="telegram">Telegram</option>
            <option value="discord">Discord</option>
            <option value="twitter">Twitter</option>
          </select>
        </div>

        {formData.platform !== 'twitter' && (
          <div>
            <Label>Source Channel ID</Label>
            {renderPlatformSpecificFields()}
          </div>
        )}

        {/* Twitter-specific form */}
        {formData.platform === 'twitter' && (
          renderPlatformSpecificFields()
        )}

        {/* OpenChat API Key input for all platforms */}
        <div>
          <Label>OpenChat API Key</Label>
          <Input
            type="password"
            value={formData.openchatApiKey}
            onChange={(e) => setFormData({ ...formData, openchatApiKey: e.target.value })}
            placeholder="Enter OpenChat API key"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-white hover:text-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {initialData ? 'Update Route' : 'Create Route'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RouteForm; 