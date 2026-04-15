import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, LayoutDashboard, User } from 'lucide-react';
import NotificationBell from './NotificationBell';
import MessageDropdown from './MessageDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          CEPTS
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/courses" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Courses
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <MessageDropdown />
            <NotificationBell />
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium px-4 py-2 transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
