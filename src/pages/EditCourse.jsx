import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Save, X, Loader2, ArrowLeft, Plus, Code, Table as TableIcon, Trash2 } from 'lucide-react';

const EditCourse = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`/api/courses/${id}`);
      setTitle(data.title);
      setDescription(data.description);
      setContent(data.content || []);
      setQuizzes(data.quizzes || []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch course details');
    } finally {
      setLoading(false);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.put(`/api/courses/${id}`, { title, description, content, quizzes }, config);
      alert('Course updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-bold"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h1 className="text-3xl font-black text-gray-900">Edit Course</h1>
          <p className="text-gray-500">Update course information, content, and quizzes</p>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Course Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Advanced React Patterns"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={1}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-[60px]"
                placeholder="Brief overview..."
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Course Content</h3>
              <div className="flex gap-2">
                <button type="button" onClick={addParagraph} className="flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus className="w-3 h-3" /> Paragraph
                </button>
                <button type="button" onClick={addCode} className="flex items-center gap-1 text-xs font-bold bg-purple-50 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors">
                  <Code className="w-3 h-3" /> Code Block
                </button>
                <button type="button" onClick={addTable} className="flex items-center gap-1 text-xs font-bold bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors">
                  <TableIcon className="w-3 h-3" /> Table
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {content.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative group">
                  <button 
                    type="button"
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
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
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
                          type="button"
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
                          type="button"
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

          {/* Quiz Editor */}
          <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Quiz Questions</h3>
              <button type="button" onClick={addQuiz} className="flex items-center gap-1 text-xs font-bold bg-orange-50 text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors">
                <Plus className="w-3 h-3" /> Add Question
              </button>
            </div>

            <div className="space-y-6">
              {quizzes.map((quiz, qIdx) => (
                <div key={qIdx} className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 relative group">
                  <button 
                    type="button"
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

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-all border border-gray-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
