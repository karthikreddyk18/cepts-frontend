import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { Search, Filter, BookOpen, Loader2 } from 'lucide-react';

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: coursesData } = await axios.get('/api/courses');
      setCourses(coursesData);

      if (user && user.role === 'Student') {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: dashboard } = await axios.get('/api/student/dashboard', config);
        setEnrollments(dashboard.enrollments || []);
        setProgress(dashboard.progress || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/enrollments', { courseId }, config);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Explore Courses</h1>
          <p className="text-gray-500">Discover new skills and knowledge from our expert faculty</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map(course => {
          const enrollment = enrollments.find(e => e.course?._id === course._id);
          const prog = progress.find(p => p.course === course._id);
          return (
            <CourseCard 
              key={course._id} 
              course={course} 
              enrollment={enrollment}
              progress={prog}
              onEnroll={handleEnroll}
            />
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400 w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
