import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Award, Bell, BookOpen, TrendingUp, ChevronRight, CheckCircle2, Star, X, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data: dashboardData } = await API.get('/student/dashboard');
      
      if (dashboardData.notifications) {
        dashboardData.notifications = dashboardData.notifications.filter(
          n => n.type === 'general' || n.type === 'progress'
        );
      }

      const { data: messagesData } = await API.get('/messages');
      dashboardData.manualMessages = messagesData;
      
      setData(dashboardData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async () => {
    try {
      await API.put('/notifications/read/all', {});
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, isRead: true }))
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotif = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => n._id !== id)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async (e) => {
    if (e) e.stopPropagation();
    try {
      await API.delete('/notifications');
      setData(prev => ({
        ...prev,
        notifications: []
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await API.delete(`/messages/${id}`);
      setData(prev => ({
        ...prev,
        manualMessages: prev.manualMessages.filter(m => m._id !== id)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const clearMessages = async (e) => {
    if (e) e.stopPropagation();
    try {
      await API.delete('/messages');
      setData(prev => ({
        ...prev,
        manualMessages: []
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Hello, {user.name}! 👋</h1>
          <p className="text-gray-500">Track your progress and continue your learning journey</p>
        </div>
        <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 flex items-center gap-3">
          <Star className="text-yellow-500 fill-yellow-500 w-6 h-6" />
          <div>
            <p className="text-xs text-indigo-600 font-bold uppercase">Badges Earned</p>
            <p className="text-xl font-black text-indigo-900">{data.badges.length}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Enrolled Courses */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="text-indigo-600" />
                My Enrolled Courses
              </h2>
              <Link to="/courses" className="text-indigo-600 font-bold text-sm hover:underline">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.enrollments.length > 0 ? data.enrollments.map(enrollment => {
                const prog = data.progress.find(p => p.course === enrollment.course?._id);
                return (
                  <div key={enrollment._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <h3 className="font-bold text-gray-900 mb-4 line-clamp-1">{enrollment.course?.title}</h3>
                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{prog?.percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${prog?.percentage || 0}%` }}
                        />
                      </div>
                    </div>
                    <Link 
                      to={`/course/${enrollment.course?._id}`}
                      className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              }) : (
                <div className="col-span-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                  <p className="text-gray-500 font-medium mb-4">You haven't enrolled in any courses yet.</p>
                  <Link to="/courses" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="text-purple-600" />
              Achievements & Badges
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {data.badges.map(badge => (
                <motion.div 
                  key={badge._id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${badge.type === 'Course Completion' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    <Award className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-1">{badge.type}</p>
                  <p className="text-sm font-bold text-gray-900 line-clamp-2">{badge.course?.title || 'Achievement'}</p>
                </motion.div>
              ))}
              {data.badges.length === 0 && (
                <p className="col-span-full text-gray-400 italic">Complete courses and quizzes to earn badges!</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Notifications */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="text-orange-500" />
                Notifications
              </h2>
              <div className="flex gap-4">
                {data.notifications.some(n => !n.isRead) && (
                  <button 
                    onClick={markRead}
                    className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                  >
                    Read All
                  </button>
                )}
                {data.notifications.length > 0 && (
                  <button 
                    onClick={clearAll}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
              {data.notifications.map(notif => (
                <div key={notif._id} className={`p-6 hover:bg-gray-50 transition-colors group relative ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
                  <button 
                    onClick={() => deleteNotif(notif._id)}
                    className="absolute right-4 top-4 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-sm text-gray-700 leading-relaxed pr-6">{notif.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {data.notifications.length === 0 && (
                <div className="p-10 text-center text-gray-400">
                  No new notifications
                </div>
              )}
            </div>
          </section>

          {/* Academic Messages */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Mail className="text-indigo-600" />
                Academic Messages
              </h2>
              {data.manualMessages?.length > 0 && (
                <button 
                  onClick={clearMessages}
                  className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
              {data.manualMessages?.map(msg => (
                <div key={msg._id} className="p-6 hover:bg-gray-50 transition-colors group relative">
                  <button 
                    onClick={() => deleteMessage(msg._id)}
                    className="absolute right-4 top-4 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                      {msg.course?.title || 'General'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">{msg.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-gray-400 italic">
                      From: {msg.sender?.name}
                    </p>
                  </div>
                </div>
              ))}
              {(!data.manualMessages || data.manualMessages.length === 0) && (
                <div className="p-10 text-center text-gray-400">
                  No academic messages
                </div>
              )}
            </div>
          </section>

          {/* Stats Summary */}
          <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Learning Stats
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-indigo-100 font-medium">Courses Enrolled</span>
                <span className="text-2xl font-black">{data.enrollments.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-indigo-100 font-medium">Completed</span>
                <span className="text-2xl font-black">
                  {data.progress.filter(p => p.percentage === 100).length}
                </span>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-xs text-indigo-200 font-bold uppercase mb-2">Average Progress</p>
                <div className="text-3xl font-black">
                  {data.progress.length > 0 
                    ? Math.round(data.progress.reduce((acc, p) => acc + p.percentage, 0) / data.progress.length)
                    : 0}%
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
