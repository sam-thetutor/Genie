import React, { useState } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { toast } from 'react-hot-toast';

function AIContentModal({ isOpen, onClose, onAccept }) {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const { generateAIContent, isLoading, error } = useDatabase();

  const generateContent = async () => {
    try {
      const response = await generateAIContent(prompt);
      setGeneratedContent(response.content);
    } catch (err) {
      toast.error('Failed to generate content');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Generate Content with AI
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe the content you want
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[100px]"
              placeholder="E.g., Write a tweet about the latest developments in AI technology"
            />
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {generatedContent && (
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {generatedContent}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            {!generatedContent ? (
              <button
                onClick={generateContent}
                disabled={!prompt || isLoading}
                className="px-6 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            ) : (
              <button
                onClick={() => onAccept(generatedContent)}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Accept
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIContentModal; 