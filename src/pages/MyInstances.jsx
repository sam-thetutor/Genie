import React, { useState } from 'react';
import { useAuth } from '@nfid/identitykit/react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

function MyInstances() {
  const { user } = useAuth();
  const [editingInstance, setEditingInstance] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [groupId, setGroupId] = useState('');

  const instances = React.useMemo(() => {
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`instances_${user.principal}`) || '[]');
  }, [user]);

  const handleDelete = (instanceId) => {
    const newInstances = instances.filter(instance => instance.id !== instanceId);
    localStorage.setItem(`instances_${user.principal}`, JSON.stringify(newInstances));
    toast.success('Instance deleted successfully');
  };

  const handleEdit = (instance) => {
    setEditingInstance(instance);
    setGroupId(instance.groupId);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    const newInstances = instances.map(instance =>
      instance.id === editingInstance.id
        ? { ...instance, groupId: groupId }
        : instance
    );
    localStorage.setItem(`instances_${user.principal}`, JSON.stringify(newInstances));
    setIsEditModalOpen(false);
    toast.success('Instance updated successfully');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        My Bot Instances
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {instances.map((instance) => (
          <div
            key={instance.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {instance.botName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Group ID: {instance.groupId}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Created: {new Date(instance.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(instance)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(instance.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {instances.length === 0 && (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
            You haven't created any bot instances yet.
          </div>
        )}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Instance"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Group ID
            </label>
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MyInstances; 