import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@nfid/identitykit/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDatabase } from '../../hooks/useDatabase';
import { FaRegTrashCan, FaFilePdf, FaCalendarPlus } from "react-icons/fa6";
import ScheduleModal from '../../components/ScheduleModal';

const AiChat = () => {
  const { user } = useAuth();
  const [chatInstances, setChatInstances] = useState([]);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef();
  const [scheduleModal, setScheduleModal] = useState({
    isOpen: false,
    message: ''
  });

  const { getAllInstances, getInstance, deleteInstance, createInstance, uploadAIFile, getChatHistory, sendMessage } = useDatabase();   

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedInstance?.messages]);

  const handleInstanceSelect = async (instance) => {
    try {
        setSelectedInstance(instance);
      const response = await getChatHistory(instance._id);
      console.log("chat history response", response);
      if (response.success) {
        //fetch the chat history
        const chatHistory = await getChatHistory(instance._id);
        setSelectedInstance({...instance, messages: chatHistory.messages});
        console.log("chat history", chatHistory);
      }
    } catch (error) {
      toast.error('Failed to load chat history');
    }
  };

  useEffect(() => {
    if (user?.principal) {
      loadChatInstances();
    }
  }, [user]);

  const loadChatInstances = async () => {
    try {
      const response = await getAllInstances();

      console.log("instance data",response);
      if(response.success){
        setChatInstances(response.instances);
      }
    //   setChatInstances(response.data);
    } catch (error) {
      toast.error('Failed to load chat instances');
    }
  };

  const handleCreateInstance = async () => {
    console.log("new instance name",newInstanceName);
    if (!newInstanceName.trim()) return;
    try {
        const response = await createInstance(newInstanceName);
        console.log("instance creation response",response);
        await loadChatInstances();


    //   const response = await createInstance(newInstanceName);
    //   if (response.success) {
    //     await loadChatInstances();
    //     setNewInstanceName('');
    //     setIsCreatingNew(false);
    //     toast.success('Chat instance created');
    //   } else {
    //     toast.error('Failed to create chat instance');
    //   }
    //     principal: user.principal
    //   });

    //   await loadChatInstances();
    //   setNewInstanceName('');
    //   setIsCreatingNew(false);
    //   toast.success('Chat instance created');
    } catch (error) {
      toast.error('Failed to create chat instance');
    }
  };

  const handleDelete = async (instanceId, e) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    try {
      await deleteInstance(instanceId);
      toast.success('Chat instance deleted');
      await loadChatInstances(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete chat instance');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      // immediately add the user message to the chat history
      const userMessage = {
        message: {
          content: message,
          role: 'user',
          timestamp: new Date().toISOString()
        }
      };
      
      setSelectedInstance(prev => ({
        ...prev, 
        messages: [...(prev.messages || []), userMessage]
      }));
      setMessage(''); // Clear input after sending
      setIsAiResponding(true);

      const response = await sendMessage(selectedInstance._id, message);
      console.log("chat response", response);
      
      // add the ai message to the chat history
      const aiMessage = {
        message: {
          content: response.answer,
          role: 'assistant',
          timestamp: new Date().toISOString()
        }
      };
      
      setSelectedInstance(prev => ({
        ...prev, 
        messages: [...(prev.messages || []), aiMessage]
      }));
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsAiResponding(false);
    }
  };
console.log("selectedInstance", selectedInstance);



  const handlePDFUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      await uploadAIFile(selectedInstance._id, formData);
      toast.success('PDF uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Side Navbar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Create New Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsCreatingNew(true)}
            className="w-full px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition-colors"
          >
            New Chat
          </button>
        </div>

        {/* New Instance Form */}
        {isCreatingNew && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={newInstanceName}
              onChange={(e) => setNewInstanceName(e.target.value)}
              placeholder="Enter chat name"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleCreateInstance}
                className="px-3 py-1 bg-green-500 text-black rounded-md hover:bg-green-600"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setNewInstanceName('');
                }}
                className="px-3 py-1 bg-gray-500 text-black rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Chat Instances List */}
        <div className="flex-1 overflow-y-auto">
          {chatInstances.map((instance) => (
            <div
              key={instance._id}
              onClick={() => handleInstanceSelect(instance)}
              className={`p-4 flex justify-between cursor-pointer border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedInstance?._id === instance._id ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {instance.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {instance.lastMessage}
              </p>
              <button onClick={(e) => handleDelete(instance._id, e)}>
                <FaRegTrashCan color='red' className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedInstance ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {selectedInstance.name}
              </h2>
              <div className="file-upload">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <button
                  onClick={handlePDFUpload}
                  className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition-colors ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isUploading}
                >
                  <FaFilePdf />
                  {isUploading ? 'Uploading...' : 'Upload PDF'}
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedInstance.messages?.length > 0 ? (
                <div className="space-y-4">
                  {selectedInstance.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.message.content}</p>
                        <div className="flex justify-between items-center mt-2">
                         

                          {msg.message.role !== 'user' && (
                            <button
                              onClick={() => setScheduleModal({
                                isOpen: true,
                                message: msg.message.content
                              })}
                              className="p-1.5  text-white rounded-full hover:bg-gray-800 transition-colors"
                              title="Schedule this message"
                            >
                              <FaCalendarPlus className="w-4 h-4 " color='blue' />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isAiResponding && (
                    <div className="flex justify-start">
                      <div className="max-w-[70%] rounded-lg p-3 bg-gray-200 dark:bg-gray-700">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No messages yet. Start a conversation or upload a PDF to chat about.
                </p>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isAiResponding}
                />
                <button 
                  onClick={handleSendMessage}
                  className={`px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition-colors ${
                    isAiResponding ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isAiResponding}
                >
                  {isAiResponding ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Select or create a chat to start conversation
            </p>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModal.isOpen}
        onClose={() => setScheduleModal({ isOpen: false, message: '' })}
        message={scheduleModal.message}
      />
    </div>
  );
};

export default AiChat;
