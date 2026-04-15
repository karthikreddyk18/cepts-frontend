import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Edit3, Trash2, Eye, Star, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CourseCard = ({ course, enrollment, progress, onEnroll, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isEnrolled = !!enrollment;
  const isStudent = user?.role === 'Student';
  const isFaculty = user?.role === 'Faculty';
  const isAdmin = user?.role === 'Admin';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-500">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="text-white w-16 h-16 opacity-50" />
        </div>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
          {course.instructor?.name || 'Faculty'}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {course.description}
        </p>

        {isStudent && isEnrolled && progress && (
          <div className="mb-6">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {isStudent ? (
            isEnrolled ? (
              <Link 
                to={`/course/${course._id}`}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <BookOpen className="w-4 h-4" />
                📘 Continue Learning
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link 
                  to={`/course/${course._id}`}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
                >
                  Explore
                </Link>
                <button 
                  onClick={() => onEnroll(course._id)}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-1"
                >
                  <Star className="w-4 h-4" /> Enroll
                </button>
              </div>
            )
          ) : isFaculty ? (
            <div className="flex gap-2">
              <Link 
                to={`/course/${course._id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-2.5 rounded-xl font-semibold hover:bg-indigo-100 transition-all"
              >
                <Eye className="w-4 h-4" /> View
              </Link>
              {course.instructor?._id === user?._id && (
                <>
                  <Link 
                    to={`/edit-course/${course._id}`}
                    className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-blue-100"
                    title="Edit Course"
                  >
                    <Edit3 className="w-5 h-5" />
                  </Link>
                  <Link 
                    to={`/course-stats/${course._id}`}
                    className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all border border-green-100"
                    title="View Statistics"
                  >
                    <BarChart className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={() => onDelete(course._id)}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-100"
                    title="Delete Course"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          ) : isAdmin ? (
            <Link 
              to={`/course/${course._id}`}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Eye className="w-4 h-4" /> 👁 View Course
            </Link>
          ) : (
            <Link 
              to={`/course/${course._id}`}
              className="flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
            >
              Explore Course
            </Link>
          )}
          
          {isStudent && !isEnrolled && (
            <p className="text-[10px] text-center text-gray-400 italic">
              Enroll to track progress and earn badges
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
