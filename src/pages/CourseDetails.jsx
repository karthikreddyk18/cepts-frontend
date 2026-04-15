import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BookOpen, CheckCircle, ChevronRight, Play, Award, Loader2, Code, Table as TableIcon, Bell } from 'lucide-react';
import { motion } from 'motion/react';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content'); 
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`/api/courses/${id}`);
      setCourse(data);

      if (user && user.role === 'Student') {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: dashboard } = await axios.get('/api/student/dashboard', config);
        
        const currentEnrollment = dashboard.enrollments.find(e => e.course?._id === id);
        setEnrollment(currentEnrollment);
        
        const currentProgress = dashboard.progress.find(p => p.course === id);
        setProgress(currentProgress);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/enrollments', { courseId: id }, config);
      fetchCourseData();
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleCompleteContent = async (idx) => {
    if (!enrollment) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`/api/student/progress/${id}`, { contentIndex: idx }, config);
   
      setProgress(data.progress);

      if (data.newNotifications && data.newNotifications.length > 0) {
        data.newNotifications.forEach(notif => {
          addToast(notif.message, notif.type);
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuizSubmit = async () => {
    let score = 0;
    course.quizzes.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    setQuizResult({ score, total: course.quizzes.length });

    if (user && enrollment) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.post(`/api/student/quiz/${id}`, { score, total: course.quizzes.length }, config);
 
        if (data.newNotifications && data.newNotifications.length > 0) {
          data.newNotifications.forEach(notif => {
            addToast(notif.message, notif.type);
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
  );

  if (!course) return <div className="p-8 text-center">Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-200 mb-4 text-sm font-bold uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            Course Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{course.title}</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mb-8 leading-relaxed">
            {course.description}
          </p>
          
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold">
                {course.instructor?.name?.charAt(0) || 'F'}
              </div>
              <div>
                <p className="text-xs text-indigo-200 font-bold uppercase">Instructor</p>
                <p className="font-bold">{course.instructor?.name || 'Faculty'}</p>
              </div>
            </div>

            {user?.role === 'Student' && (
              !enrollment ? (
                <button 
                  onClick={handleEnroll}
                  className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20 flex items-center gap-2"
                >
                  Enroll Now
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span>Your Progress</span>
                    <span>{progress?.percentage || 0}%</span>
                  </div>
                  <div className="w-48 bg-white/20 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-white h-full transition-all duration-1000"
                      style={{ width: `${progress?.percentage || 0}%` }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-2 flex gap-2">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'content' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Play className="w-5 h-5" />
            Course Content
          </button>
          {user?.role === 'Student' && (
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Award className="w-5 h-5" />
              Quiz Assessment
            </button>
          )}
        </div>

        <div className="mt-12">
          {activeTab === 'content' ? (
            <div className="space-y-12">
              {course.content.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative"
                >
                  {enrollment && (
                    <button 
                      onClick={() => handleCompleteContent(idx)}
                      className={`absolute -right-3 -top-3 p-3 rounded-2xl shadow-lg transition-all ${progress?.completedContent?.includes(idx) ? 'bg-green-500 text-white' : 'bg-white text-gray-300 hover:text-indigo-600 border border-gray-100'}`}
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                  )}

                  {item.type === 'paragraph' && (
                    <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>
                  )}

                  {item.type === 'code' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Code className="w-4 h-4" />
                        {item.language}
                      </div>
                      <pre className="bg-gray-900 text-indigo-300 p-6 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed">
                        <code>{item.code}</code>
                      </pre>
                    </div>
                  )}

                  {item.type === 'table' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            {item.rows[0].map((cell, cIdx) => (
                              <th key={cIdx} className="border border-gray-200 p-4 text-left font-bold text-gray-900">
                                {cell}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.rows.slice(1).map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-gray-50 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="border border-gray-200 p-4 text-gray-600">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8">
              {quizResult ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-3xl p-12 shadow-xl text-center border-4 border-indigo-50"
                >
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">Quiz Completed!</h3>
                  <p className="text-gray-500 mb-8 text-lg">You scored {quizResult.score} out of {quizResult.total}</p>
                  
                  {quizResult.score === quizResult.total && (
                    <div className="bg-yellow-50 text-yellow-700 p-4 rounded-2xl font-bold mb-8 border border-yellow-100">
                      🌟 Perfect Score! You've earned a special badge!
                    </div>
                  )}

                  <button 
                    onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                  >
                    Retake Quiz
                  </button>
                </motion.div>
              ) : (
                <>
                  {course.quizzes.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex gap-4">
                        <span className="text-indigo-600">Q{qIdx + 1}.</span>
                        {q.question}
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt, oIdx) => (
                          <button 
                            key={oIdx}
                            onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                            className={`p-4 rounded-2xl text-left font-medium transition-all border-2 ${quizAnswers[qIdx] === oIdx ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-md' : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < course.quizzes.length}
                    className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Assessment
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
