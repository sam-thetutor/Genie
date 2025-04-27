import React, { useState, useEffect } from 'react';
import { useAuth } from '@nfid/identitykit/react';
import { toast } from 'react-hot-toast';
import { useDatabase } from '../../hooks/useDatabase';
import AIContentModal from '../../components/AIContentModal';
import BulkAIContentModal from '../../components/BulkAIContentModal';

function CampaignDetails({ campaign, onBack }) {
  const { user } = useAuth();
  const { 
    createContent,
    getContents,
    updateContent,
    deleteContent,
    isLoading,
    error 
  } = useDatabase();
  const [contents, setContents] = useState([]);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  
  // Form states
  const [content, setContent] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isBulkAIModalOpen, setIsBulkAIModalOpen] = useState(false);

  // Load contents from API
  useEffect(() => {
    loadContents();
    console.log('Campaign:', campaign);
  }, [campaign._id]);

  const loadContents = async () => {
    try {
      const data = await getContents(campaign._id);
      console.log('Loaded contents:', data);
      setContents(data);
    } catch (err) {
      console.error('Error loading contents:', err);
      toast.error('Failed to load contents');
    }
  };

  const handleAddContent = async () => {
    if (!content || !scheduledTime) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Convert local time to UTC before sending to server
      const localDate = new Date(scheduledTime);
      const utcTime = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

      const newContent = {
        campaignId: campaign._id,
        content,
        scheduledTime: utcTime.toISOString(), // Send UTC time to server
        status: 'pending'
      };

      if (editingContent) {
        await updateContent(editingContent._id, newContent);
      } else {
        await createContent(newContent);
      }
      
      await loadContents();
      resetForm();
      toast.success(editingContent ? 'Content updated successfully' : 'Content added successfully');
    } catch (err) {
      toast.error('Failed to save content');
    }
  };

  const handleEdit = (content) => {
    // Format the date string to match the datetime-local input format
    const formatDateForInput = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16); // Get YYYY-MM-DDThh:mm format
    };

    setEditingContent(content);
    setContent(content.content);
    setScheduledTime(formatDateForInput(content.scheduledTime));
    setIsAddingContent(true);
  };

  const handleDelete = async (contentId) => {
    console.log('Deleting content:', contentId);
    try {
      const response = await deleteContent(contentId);
      await loadContents();
      toast.success(response.message || 'Content deleted successfully');
    } catch (err) {
      console.error('Error deleting content:', err);
      toast.error('Failed to delete content');
    }
  };

  const resetForm = () => {
    setContent('');
    setScheduledTime('');
    setIsAddingContent(false);
    setEditingContent(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'posted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const handleBulkContentSave = async (contents) => {
    try {
      for (const content of contents) {
        await createContent(content);
      }
      await loadContents();
      toast.success(`Successfully scheduled ${contents.length} posts`);
    } catch (err) {
      toast.error('Failed to schedule some posts');
    }
  };

  // When displaying times, convert UTC back to local
  const formatDateTime = (utcTime) => {
    const date = new Date(utcTime);
    return date.toLocaleString(); // This will show time in user's local timezone
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {campaign.name}
          </h1>
        </div>

        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setIsAddingContent(true)}
            className="px-6 py-3 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add New Content
          </button>
          <button
            onClick={() => setIsBulkAIModalOpen(true)}
            className="px-6 py-3 bg-purple-500 text-black rounded-lg hover:bg-purple-600 transition-colors"
          >
            Bulk Generate Content
          </button>
        </div>

        {isAddingContent ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {editingContent ? 'Edit Content' : 'New Content'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content
                </label>
                <div className="flex space-x-2">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={4}
                    placeholder="Enter your content here"
                  />
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="px-3 py-2 bg-purple-500 text-black rounded-md hover:bg-purple-600"
                    title="Generate with AI"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Schedule Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContent}
                  className="px-6 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600"
                >
                  {editingContent ? 'Update Content' : 'Add Content'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <AIContentModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onAccept={(generatedContent) => {
            setContent(generatedContent);
            setIsAIModalOpen(false);
          }}
        />

        <BulkAIContentModal
          isOpen={isBulkAIModalOpen}
          onClose={() => setIsBulkAIModalOpen(false)}
          onSave={handleBulkContentSave}
          campaignId={campaign._id}
        />

        <div className="space-y-4">
          {contents
            .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
            .map((content) => (
              <div
                key={content._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(content.status)}`}>
                        {content.status}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Scheduled for: {formatDateTime(content.scheduledTime)}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {content.content}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(content)}
                      className="p-2 text-blue-500 hover:text-blue-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(content._id)}
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

          {contents.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No content scheduled yet. Click the button above to add some.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampaignDetails; 