import React from 'react';
import { useAuth } from '@nfid/identitykit/react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

function Profile() {
  const { identity } = useAuth();

  const copyPrincipal = async () => {
    try {
      await navigator.clipboard.writeText(identity?.getPrincipal().toString());
      toast.success('Principal ID copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy Principal ID');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings and view your information
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {identity && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Principal ID
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-sm">
                      {identity.getPrincipal().toString()}
                    </code>
                    <Button variant="outline" size="sm" onClick={copyPrincipal}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Account Type
                  </label>
                  <p className="text-sm">Internet Identity</p>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Connected Devices</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage devices that have access to your account
                </p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile; 