import { useState } from "react";

const FacultyDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgCompletion: 0,
  });

  return (
    <div className="p-6">

      <div className="grid grid-cols-3 gap-6 mt-6">

        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border">
          <div className="p-3 bg-blue-100 rounded-lg">📘</div>
          <div>
            <p className="text-gray-500">Total Courses</p>
            <h2 className="text-2xl font-bold">
              {stats?.totalCourses || 0}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border">
          <div className="p-3 bg-orange-100 rounded-lg">👥</div>
          <div>
            <p className="text-gray-500">Total Students</p>
            <h2 className="text-2xl font-bold">
              {stats?.totalStudents || 0}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border">
          <div className="p-3 bg-green-100 rounded-lg">📈</div>
          <div>
            <p className="text-gray-500">Avg. Completion</p>
            <h2 className="text-2xl font-bold">
              {stats?.avgCompletion || 0}%
            </h2>
          </div>
        </div>

      </div>

    </div>
  );
};

export default FacultyDashboard;