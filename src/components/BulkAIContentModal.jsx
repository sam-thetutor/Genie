import React, { useState } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { toast } from 'react-hot-toast';

function BulkAIContentModal({ isOpen, onClose, onSave, campaignId }) {
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(10);
  const [frequency, setFrequency] = useState('daily');
  const [startTime, setStartTime] = useState('');
  const [generatedContents, setGeneratedContents] = useState([]);
  const [selectedContents, setSelectedContents] = useState(new Set());
  const { generateAIContent, isLoading, error } = useDatabase();

  const generateContents = async () => {
    try {
      const enhancedPrompt = `Generate ${count} different ${frequency} social media posts about: ${prompt}. Make each post unique and engaging. dont put any hashtags. each post should atleast be one sentence long`;
      const response = await generateAIContent(enhancedPrompt);
      
      // Split the response into individual posts and format them
      const posts = response.content
        .split(/\d+\.\s+/)
        .filter(post => post.trim())
        .map(post => ({ content: post.trim(), selected: false }));
      
      setGeneratedContents(posts);
    } catch (err) {
      toast.error('Failed to generate content');
    }
  };

  const toggleContent = (index) => {
    const newSelected = new Set(selectedContents);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedContents(newSelected);
  };

  const calculateScheduleTimes = () => {
    if (!startTime) return null;
    
    const baseTime = new Date(startTime);
    const interval = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000
    }[frequency];

    return Array.from(selectedContents).map((index) => {
      const scheduledTime = new Date(baseTime.getTime() + (index * interval));
      return {
        content: generatedContents[index].content,
        scheduledTime: scheduledTime.toISOString(),
        campaignId
      };
    });
  };

  const handleSave = () => {
    const scheduledContents = calculateScheduleTimes();
    if (!scheduledContents) {
      toast.error('Please select a start time');
      return;
    }
    onSave(scheduledContents);
    // Reset all state values
    setPrompt('');
    setCount(10);
    setFrequency('daily');
    setStartTime('');
    setGeneratedContents([]);
    setSelectedContents(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Bulk Generate Content with AI
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topic Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={4}
                placeholder="Describe what you want the AI to write about"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Posts
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 0)))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Posting Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          {!generatedContents.length && (
            <div className="flex justify-end">
               <button
                  onClick={()=>{
                    setGeneratedContents([]);
                    setSelectedContents(new Set());
                    onClose();
                  }
                    

                  }
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
              <button
                onClick={generateContents}
                disabled={!prompt || isLoading}
                className="px-6 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Generating...' : 'Generate Content'}
              </button>
            </div>
          )}

          {generatedContents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Generated Content
              </h3>
              <div className="space-y-2">
                {generatedContents.map((content, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <input
                      type="checkbox"
                      checked={selectedContents.has(index)}
                      onChange={() => toggleContent(index)}
                      className="mt-1"
                    />
                    <p className="text-gray-800 dark:text-gray-200 flex-1">
                      {content.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!selectedContents.size || !startTime}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                  Schedule Selected Posts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BulkAIContentModal; 