import React, { useState, useEffect } from 'react';
import { useAuth } from '@nfid/identitykit/react';
import { toast } from 'react-hot-toast';
import { useDatabase } from '../../hooks/useDatabase';
import RouteForm from './RouteForm';
import RouteList from './RouteList';

function Routes() {
  const { user } = useAuth();
  const { getRoutes, createRoute, updateRoute, deleteRoute, isLoading } = useDatabase();
  const [routes, setRoutes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user?.principal?.toString()) {
      loadRoutes();
    }
  }, [user?.principal]);

  const loadRoutes = async () => {
    try {
      const data = await getRoutes();
      setRoutes(data);
    } catch (err) {
      console.error('Error loading routes:', err);
      toast.error('Failed to load routes');
    }
  };

  const handleCreateRoute = async (routeData) => {
    try {
      await createRoute({
        ...routeData,
        principal: user?.principal?.toString()
      });
      await loadRoutes();
      setIsCreating(false);
      toast.success('Route created successfully');
    } catch (err) {
      toast.error('Failed to create route');
    }
  };

  const handleToggleStatus = async (routeId) => {
    try {
      const route = routes.find(r => r._id === routeId);
      const newStatus = route.status === 'active' ? 'paused' : 'active';
      await updateRoute(routeId, { status: newStatus });
      await loadRoutes();
      toast.success(`Route ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update route status');
    }
  };

  const handleDelete = async (routeId) => {
    try {
      await deleteRoute(routeId);
      await loadRoutes();
      toast.success('Route deleted successfully');
    } catch (err) {
      toast.error('Failed to delete route');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Content Routes
          </h1>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600"
          >
            Add New Route
          </button>
        </div>

        {isCreating && (
          <RouteForm
            onSubmit={handleCreateRoute}
            onCancel={() => setIsCreating(false)}
          />
        )}

        <RouteList
          routes={routes}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default Routes; 