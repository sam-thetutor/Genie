import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@nfid/identitykit/react';
import { useState, useRef, useEffect } from 'react';
import {toast} from "react-hot-toast"
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { connect, user, disconnect } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const copyPrincipal = async () => {
    try {
      await navigator.clipboard.writeText(user?.principal?.toString());     
      toast.success("Address copied to clipboard")
    } catch (err) {
      console.error('Failed to copy principal:', err);
    }
  };

  const handleLogout = () => {
    disconnect();
    navigate("/")
  }

  const navigation = [
    { name: 'Schedule', href: '/schedule' },
    { name: 'Routes', href: '/routes' },
    // ... other navigation items
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Logo</Link>
        <div className="flex space-x-4 w-full justify-end">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Home</Link>
          {/* <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Dashboard</Link> */}
          {/* <Link to="/my-instances" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">My Instances</Link> */}
          <Link to="/integrations" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Integrations</Link>
          <Link to="/schedule" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Schedule</Link>
          <Link to="/routes" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">MediaLink</Link>
          <Link to="/analytics" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Analytics</Link>
        </div>

        {!user ? (
          <button 
            onClick={() => connect()}
            className="bg-blue-500 ml-6 hover:bg-blue-600 text-black px-4 py-2 rounded"
          >
            Connect
          </button>
        ) : (
          <div className="relative ml-6" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <span className="text-gray-700 dark:text-gray-200">Profile</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Principal ID</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-700 dark:text-gray-200 truncate">
                      {user?.principal?.toString()?.slice(0, 5)}...{user?.principal?.toString()?.slice(-3)}
                    </p>
                    <button
                      onClick={copyPrincipal}
                      className="text-blue-500 hover:text-blue-600"
                      title="Copy Principal ID"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <button onClick={() => navigate("/profile")} className="w-full mb-2 text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Account</button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 