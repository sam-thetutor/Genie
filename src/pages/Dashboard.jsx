import React, { useState, useEffect } from 'react';
import { useAuth } from '@nfid/identitykit/react';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
import {
  Plus,
  Bot,
  Calendar,
  Users,
  BarChart,
  Trash2,
  Pencil,
  ExternalLink
} from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const [bots, setBots] = useState([]);
  const [newBotName, setNewBotName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.principal) {
      const savedBots = localStorage.getItem(`bots_${user.principal}`);
      if (savedBots) {
        setBots(JSON.parse(savedBots));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user?.principal) {
      localStorage.setItem(`bots_${user.principal}`, JSON.stringify(bots));
    }
  }, [bots, user]);

  const handleCreateBot = () => {
    if (!newBotName.trim()) {
      toast.error('Please enter a bot name');
      return;
    }

    const newBot = {
      id: `bot_${Date.now()}`,
      name: newBotName.trim(),
      url: '',
      createdAt: new Date().toISOString(),
      status: 'active',
      metrics: {
        messages: 0,
        users: 0,
        engagement: 0
      }
    };

    setBots([...bots, newBot]);
    setNewBotName('');
    setIsDialogOpen(false);
    toast.success('Bot created successfully');
  };

  const handleDeleteBot = (botId) => {
    setBots(bots.filter(bot => bot.id !== botId));
    toast.success('Bot deleted successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'paused':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your bots and monitor their performance</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Bot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Bot</DialogTitle>
              <DialogDescription>
                Give your bot a name to get started. You can configure additional settings later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bot Name</Label>
                <Input
                  id="name"
                  placeholder="Enter bot name"
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCreateBot}>Create Bot</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Bots</CardTitle>
            <Bot className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Campaigns</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bots.filter(bot => bot.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bots.reduce((acc, bot) => acc + (bot.metrics?.users || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map(bot => (
          <Card key={bot.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{bot.name}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bot.status)}`}>
                  {bot.status}
                </span>
              </div>
              <CardDescription>
                Created {new Date(bot.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bot.url && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    URL: {bot.url}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleDeleteBot(bot.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="default" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Dashboard; 