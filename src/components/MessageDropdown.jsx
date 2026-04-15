import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Mail, X, Trash2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const MessageDropdown = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === 'Student') {
      fetchMessages();
      const interval = setInterval(fetchMessages, 30000); 
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data } = await API.get('/messages');
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await API.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const clearAll = async (e) => {
    if (e) e.stopPropagation();
    try {
      await API.delete('/messages');
      setMessages([]);
      setIsOpen(false);
    } catch (err) {
      console.error('Error clearing messages:', err);
    }
  };

  if (!user || user.role !== 'Student') return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        title="Messages"
      >
        <Mail className="w-6 h-6" />
        {messages.length > 0 && (
          <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {messages.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-indigo-50/30">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  Academic Messages
                </h3>
                <div className="flex gap-2">
                  {messages.length > 0 && (
                    <button 
                      onClick={clearAll}
                      className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wider"
                    >
                      Clear All
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No messages yet
                  </div>
                ) : (
                  messages.map((m) => (
                      <div 
                        key={m._id}
                        className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group relative"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                            {m.course?.title || 'Academic Message'}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(m.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 font-medium leading-relaxed">
                          {m.content}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-[10px] text-gray-400 italic">
                            From: {m.sender?.name || 'Faculty'}
                          </p>
                          <button 
                            onClick={() => deleteMessage(m._id)}
                            className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageDropdown;
