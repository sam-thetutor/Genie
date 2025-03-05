import { useAuth } from '@nfid/identitykit/react';
import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Dashboard() {
  const { user } = useAuth();
  const { fetchDashboardMetrics } = useDatabase();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.principal) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardMetrics(user.principal.toString());
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!metrics) {
    return <div className="text-gray-500 text-center p-4">No data available</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Campaign Stats Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Campaigns</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold">{metrics.campaigns.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Active</span>
              <span className="text-green-500">{metrics.campaigns.active}</span>
            </div>
            <div className="flex justify-between">
              <span>Paused</span>
              <span className="text-yellow-500">{metrics.campaigns.paused}</span>
            </div>
          </div>
        </div>

        {/* Content Stats Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Content</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Posts</span>
              <span className="font-semibold">{metrics.content.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg per Campaign</span>
              <span>{metrics.content.averagePerCampaign}</span>
            </div>
          </div>
        </div>

        {/* Integration Stats Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Integrations</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Active</span>
              <span className="text-green-500">{metrics.integrations.activeCount}</span>
            </div>
            <div className="flex justify-between">
              <span>With Errors</span>
              <span className="text-red-500">{metrics.integrations.errorCount}</span>
            </div>
          </div>
        </div>

        {/* Performance Stats Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Performance</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Success Rate</span>
              <span className="text-green-500">{metrics.performance.successRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Error Rate</span>
              <span className="text-red-500">{metrics.performance.errorRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Time-Based Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Posting Activity</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Last 7 Days</div>
                <div className="text-2xl font-bold">{metrics.timeMetrics.postingTrends.lastWeek}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Last 30 Days</div>
                <div className="text-2xl font-bold">{metrics.timeMetrics.postingTrends.lastMonth}</div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(metrics.timeMetrics.postingTrends.byDayOfWeek).map(([day, count]) => ({
                    day: DAYS[day],
                    posts: count
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="posts" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Platform Engagement */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Platform Performance</h2>
          <div className="space-y-6">
            {Object.entries(metrics.engagementMetrics.platformEngagement).map(([platform, stats]) => (
              <div key={platform} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize text-lg">{platform}</span>
                  <span className="text-sm text-gray-500">
                    {stats.messagesSent} messages sent
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`h-2.5 rounded-full ${
                      Number(stats.errorRate) > 10 ? 'bg-red-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${100 - Number(stats.errorRate)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500">
                  Error Rate: {stats.errorRate}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Performance and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Performing Campaigns</h2>
          <div className="space-y-4">
            {metrics.campaignPerformance.topCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div>
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-sm text-gray-500">{campaign.totalPosts} posts</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg ${
                    campaign.successRate > 90 ? 'text-green-500' : 
                    campaign.successRate > 70 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {campaign.successRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">success rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Integration Health</h2>
          <div className="space-y-4">
            {metrics.systemHealth.routeHealth.map((route, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="capitalize font-medium">{route.platform}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    route.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {route.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Uptime: </span>
                    <span>{route.uptime}h</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Errors: </span>
                    <span className={route.errorCount > 0 ? 'text-red-500' : 'text-green-500'}>
                      {route.errorCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Integrations by Platform</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(metrics.integrations.byPlatform).map(([name, value]) => ({
                    name,
                    value
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {Object.entries(metrics.integrations.byPlatform).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Status Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Content Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(metrics.content.byStatus).map(([status, count]) => ({
                  status,
                  count
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 