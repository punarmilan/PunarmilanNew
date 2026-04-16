import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  // ✅ Protect page
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch purchased courses from Spring Boot
  useEffect(() => {
    const email = localStorage.getItem("userId");

    axios
      .get(`http://localhost:8080/myCourses/${email}`)
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-28 px-6">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide">
          Welcome to Your Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow-md transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Browse Courses Button */}
      <div className="max-w-7xl mx-auto mb-10">
        <button
          onClick={() => navigate("/courses")}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition duration-300 text-white px-6 py-3 rounded-full shadow-lg font-semibold"
        >
          Browse More Courses
        </button>
      </div>

      {/* Purchased Courses Section */}
      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Purchased Courses
        </h2>

        {courses.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            You have not purchased any courses yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div
                key={c.id}
                className="p-6 bg-white rounded-2xl shadow-md border hover:shadow-xl transition duration-300 hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                  {c.courseName}
                </h3>
                <p className="text-gray-600 mb-4">Price: ₹{c.price}</p>

                <p className="text-gray-500 mb-2">{c.description}</p>

                 <video width="100%" height="200" controls className="rounded-lg mb-3">
                     <source src={c.videoUrl} type="video/mp4" />
                    </video>

                <button
                onClick={() => navigate(`/course/${c.id}`)}
                 className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
               >
                 View Course
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;