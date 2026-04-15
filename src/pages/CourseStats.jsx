import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader2, ArrowLeft, Users, BarChart, Calendar, Mail, MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CourseStats = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [id]);

  const fetchStats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.get(`/api/courses/${id}/stats`, config);
      setStats(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch course statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.post('/api/messages/send', { 
        receiverId: selectedStudent._id, 
        courseId: id, 
        content: message 
      }, config);
      addToast(`Academic message sent to ${selectedStudent.name}`, 'success');
      setSelectedStudent(null);
      setMessage('');
    } catch (err) {
      console.error(err);
      addToast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
  );

  if (!stats) return <div className="p-8 text-center">No statistics found</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-bold"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">{stats.courseTitle}</h1>
        <p className="text-gray-500 flex items-center gap-2">
          <Users className="w-4 h-4" />
          {stats.totalEnrolled} Students Enrolled
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Enrolled</p>
          <p className="text-3xl font-black text-gray-900">{stats.totalEnrolled}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <BarChart className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Avg. Progress</p>
          <p className="text-3xl font-black text-gray-900">
            {stats.students.length > 0 
              ? Math.round(stats.students.reduce((acc, s) => acc + s.progress, 0) / stats.students.length) 
              : 0}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Completion Rate</p>
          <p className="text-3xl font-black text-gray-900">
            {stats.students.length > 0 
              ? Math.round((stats.students.filter(s => s.progress === 100).length / stats.students.length) * 100) 
              : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Student Progress List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Enrolled Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.students.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                        {item.student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.student.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-[100px]">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.progress === 100 ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Completed</span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">In Progress</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedStudent(item.student)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </button>
                  </td>
                </tr>
              ))}
              {stats.students.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                    No students enrolled yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Message Student</h3>
                  <p className="text-sm text-gray-500">To: {selectedStudent.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here (e.g., Please complete the remaining modules...)"
                  className="w-full h-32 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900 placeholder-gray-400 font-medium"
                />
              </div>
              <div className="p-6 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim()}
                  className="flex-[2] py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  Send Message
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseStats;
