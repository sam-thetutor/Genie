import React, { useState } from 'react';
import { useAuth } from '@nfid/identitykit/react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Plus, Settings, Trash2 } from 'lucide-react';

function MyInstances() {
  const { user } = useAuth();
  const [editingInstance, setEditingInstance] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [groupId, setGroupId] = useState('');

  const instances = React.useMemo(() => {
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`instances_${user.principal}`) || '[]');
  }, [user]);

  const handleCreateInstance = () => {
    if (!groupId.trim()) {
      toast.error('Please enter a group ID');
      return;
    }

    const newInstance = {
      id: Date.now(),
      groupId: groupId.trim(),
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(
      `instances_${user.principal}`,
      JSON.stringify([...instances, newInstance])
    );

    setGroupId('');
    setIsDialogOpen(false);
    toast.success('Instance created successfully');
  };

  const handleDeleteInstance = (instanceId) => {
    const updatedInstances = instances.filter(instance => instance.id !== instanceId);
    localStorage.setItem(
      `instances_${user.principal}`,
      JSON.stringify(updatedInstances)
    );
    toast.success('Instance deleted successfully');
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Instances</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your bot instances and configurations
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Instance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Instance</DialogTitle>
              <DialogDescription>
                Enter the group ID where you want to deploy your bot.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="groupId">Group ID</Label>
                <Input
                  id="groupId"
                  placeholder="Enter group ID"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCreateInstance}>Create Instance</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {instances.map(instance => (
          <Card key={instance.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Instance {instance.id}</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteInstance(instance.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Group ID: {instance.groupId}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {new Date(instance.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MyInstances; 