import React, { useState, useEffect } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { toast } from 'react-hot-toast';

const ScheduleModal = ({ isOpen, onClose, message }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { getCampaigns, createContent } = useDatabase();

  useEffect(() => {
    if (isOpen) {
      loadCampaigns();
      // Set default scheduled time to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
      setScheduledTime(tomorrow.toISOString().slice(0, 16));
    }
  }, [isOpen]);

  const loadCampaigns = async () => {
    try {
      const response = await getCampaigns();
      console.log("campaigns", response);
      setCampaigns(response);
    } catch (error) {
      toast.error('Failed to load campaigns');
    }
  };

  const handleSchedule = async () => {
    if (!selectedCampaign || !scheduledTime) {
      toast.error('Please select a campaign and schedule time');
      return;
    }

    try {
      setIsLoading(true);
      await createContent({
        content: message,
        scheduledTime: new Date(scheduledTime).toISOString(),
        campaignId: selectedCampaign
      });
      toast.success('Message scheduled successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to schedule message');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Schedule Message
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Campaign
            </label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select a campaign</option>
              {campaigns?.map((campaign) => (
                <option key={campaign._id} value={campaign._id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal; 