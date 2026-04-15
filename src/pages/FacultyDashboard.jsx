import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit3, Book, Code, Table as TableIcon, Save, X, ChevronRight, BarChart, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Editor State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.get('/api/courses/faculty/my-courses', config);
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addParagraph = () => {
    setContent([...content, { type: 'paragraph', content: '' }]);
  };

  const addCode = () => {
    setContent([...content, { type: 'code', language: 'javascript', code: '' }]);
  };

  const addTable = () => {
    setContent([...content, { type: 'table', rows: [['', ''], ['', '']] }]);
  };

  const addQuiz = () => {
    setQuizzes([...quizzes, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleSave = async () => {
    const courseData = { title, description, content, quizzes };
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      if (editingCourse) {
        await axios.put(`/api/courses/${editingCourse._id}`, courseData, config);
      } else {
        await axios.post('/api/courses', courseData, config);
      }
      setShowEditor(false);
      setEditingCourse(null);
      resetEditor();
      fetchMyCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save course');
    }
  };

  const resetEditor = () => {
    setTitle('');
    setDescription('');
    setContent([]);
    setQuizzes([]);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setContent(course.content);
    setQuizzes(course.quizzes);
    setShowEditor(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchMyCourses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Faculty Dashboard</h1>
          <p className="text-gray-500">Create and manage your courses and quizzes</p>
        </div>
        <button 
          onClick={() => { resetEditor(); setShowEditor(true); }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Course
        </button>
      </div>

      <AnimatePresence>
        {showEditor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Course Editor'}
                </h2>
                <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Course Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Advanced React Patterns"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-[46px]"
                      placeholder="Brief overview of the course..."
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Course Content</h3>
                    <div className="flex gap-2">
                      <button onClick={addParagraph} className="flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                        <Plus className="w-3 h-3" /> Paragraph
                      </button>
                      <button onClick={addCode} className="flex items-center gap-1 text-xs font-bold bg-purple-50 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors">
                        <Code className="w-3 h-3" /> Code Block
                      </button>
                      <button onClick={addTable} className="flex items-center gap-1 text-xs font-bold bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors">
                        <TableIcon className="w-3 h-3" /> Table
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {content.map((item, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative group">
                        <button 
                          onClick={() => setContent(content.filter((_, i) => i !== idx))}
                          className="absolute -right-2 -top-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        
                        {item.type === 'paragraph' && (
                          <textarea 
                            value={item.content}
                            onChange={(e) => {
                              const newContent = [...content];
                              newContent[idx].content = e.target.value;
                              setContent(newContent);
                            }}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none min-h-[100px]"
                            placeholder="Write your paragraph here..."
                          />
                        )}

                        {item.type === 'code' && (
                          <div className="space-y-3">
                            <select 
                              value={item.language}
                              onChange={(e) => {
                                const newContent = [...content];
                                newContent[idx].language = e.target.value;
                                setContent(newContent);
                              }}
                              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none"
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="python">Python</option>
                              <option value="java">Java</option>
                              <option value="c">C</option>
                              <option value="cpp">C++</option>
                              <option value="html">Html</option>
                              <option value="css">Css</option>
                              <option value="sql">Sql</option>
                              <option value="other">Other</option>
                            </select>
                            <textarea 
                              value={item.code}
                              onChange={(e) => {
                                const newContent = [...content];
                                newContent[idx].code = e.target.value;
                                setContent(newContent);
                              }}
                              className="w-full p-4 bg-gray-900 text-indigo-300 font-mono text-sm rounded-xl outline-none min-h-[150px]"
                              placeholder="// Paste your code here..."
                            />
                          </div>
                        )}

                        {item.type === 'table' && (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <tbody>
                                {item.rows.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="border border-gray-300 p-0">
                                        <input 
                                          value={cell}
                                          onChange={(e) => {
                                            const newContent = [...content];
                                            newContent[idx].rows[rIdx][cIdx] = e.target.value;
                                            setContent(newContent);
                                          }}
                                          className="w-full p-2 outline-none text-sm"
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="mt-2 flex gap-2">
                              <button 
                                onClick={() => {
                                  const newContent = [...content];
                                  newContent[idx].rows.push(new Array(item.rows[0].length).fill(''));
                                  setContent(newContent);
                                }}
                                className="text-[10px] font-bold text-gray-500 hover:text-indigo-600"
                              >
                                + Add Row
                              </button>
                              <button 
                                onClick={() => {
                                  const newContent = [...content];
                                  newContent[idx].rows.forEach(r => r.push(''));
                                  setContent(newContent);
                                }}
                                className="text-[10px] font-bold text-gray-500 hover:text-indigo-600"
                              >
                                + Add Column
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Quiz Questions</h3>
                    <button onClick={addQuiz} className="flex items-center gap-1 text-xs font-bold bg-orange-50 text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors">
                      <Plus className="w-3 h-3" /> Add Question
                    </button>
                  </div>

                  <div className="space-y-6">
                    {quizzes.map((quiz, qIdx) => (
                      <div key={qIdx} className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 relative group">
                        <button 
                          onClick={() => setQuizzes(quizzes.filter((_, i) => i !== qIdx))}
                          className="absolute -right-2 -top-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>

                        <div className="space-y-4">
                          <input 
                            value={quiz.question}
                            onChange={(e) => {
                              const newQuizzes = [...quizzes];
                              newQuizzes[qIdx].question = e.target.value;
                              setQuizzes(newQuizzes);
                            }}
                            className="w-full p-3 bg-white border border-orange-200 rounded-xl outline-none font-bold"
                            placeholder="Enter question..."
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {quiz.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <input 
                                  type="radio"
                                  name={`correct-${qIdx}`}
                                  checked={quiz.correctAnswer === oIdx}
                                  onChange={() => {
                                    const newQuizzes = [...quizzes];
                                    newQuizzes[qIdx].correctAnswer = oIdx;
                                    setQuizzes(newQuizzes);
                                  }}
                                  className="w-4 h-4 text-indigo-600"
                                />
                                <input 
                                  value={opt}
                                  onChange={(e) => {
                                    const newQuizzes = [...quizzes];
                                    newQuizzes[qIdx].options[oIdx] = e.target.value;
                                    setQuizzes(newQuizzes);
                                  }}
                                  className="flex-1 p-2 bg-white border border-orange-100 rounded-lg text-sm outline-none"
                                  placeholder={`Option ${oIdx + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                <button 
                  onClick={() => setShowEditor(false)}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Course
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="h-40 bg-indigo-600 p-6 flex items-end">
              <h3 className="text-white text-xl font-bold line-clamp-2">{course.title}</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-gray-500 text-sm mb-4 flex-1">{course.description}</p>
              
              <div className="flex items-center gap-2 mb-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Users className="w-4 h-4" />
                {course.enrollmentCount || 0} Students Registered
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="flex gap-2">
                  <Link 
                    to={`/edit-course/${course._id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Course"
                  >
                    <Edit3 className="w-5 h-5" />
                  </Link>
                  <Link 
                    to={`/course-stats/${course._id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View Statistics"
                  >
                    <BarChart className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(course._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <Link to={`/course/${course._id}`} className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  View <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyDashboard;
