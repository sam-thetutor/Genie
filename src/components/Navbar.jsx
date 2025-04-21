import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@nfid/identitykit/react';
import { useState, useRef, useEffect } from 'react';
import { toast } from "react-hot-toast";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Users,
  MessageSquare,
  BarChart,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

import { Button } from "../components/ui/button"
import { cn } from '../lib/utils';

function Navbar() {
  const { connect, user, disconnect } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      connect();
    }
  };


  const navigation = [
    // { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Routes', href: '/routes', icon: Settings },
    // { name: 'Integrations', href: '/integrations', icon: Users },
    { name: 'AI Chat', href: '/ai-chat', icon: MessageSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart },
  ];

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

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
            Genie
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation - Moved here */}
            <div className="hidden md:flex md:space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      location.pathname === item.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {!user ? (
              <Button onClick={handleGetStarted} variant="default">
                Connect Wallet
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <span className="hidden md:block">
                      {user?.principal?.toString()?.slice(0, 5)}...
                      {user?.principal?.toString()?.slice(-3)}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={copyPrincipal}>
                    Copy Principal ID
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 