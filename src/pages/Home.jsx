import React from 'react';
import { useAuth } from '@nfid/identitykit/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

function Home() {
  const { user, connect } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      connect();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl min-h-screen flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Social Media Management</span>
            <span className="block text-blue-600 dark:text-blue-500">Powered by AI</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your social media presence with our AI-powered campaign manager. Schedule posts, analyze performance, and grow your audience across multiple platforms.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
             
             {
              !user ? (
                <Button
                  onClick={handleGetStarted}
                  variant="default"
                >
                  Connect Wallet
                </Button>
              ) : (
                <Button
                onClick={() => navigate("/schedule")}
                variant="default"
              >
Schedule your first post
              </Button>
              )
            }
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
     
    </div>
  );
}

export default Home;
