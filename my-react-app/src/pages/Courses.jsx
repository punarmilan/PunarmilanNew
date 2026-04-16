import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();

  const courses = [
 {
    id: 1,
    title: "Java Full Stack Development",
    price: "₹4999",
    description: "Java, Spring Boot, React, SQL complete course",
    videoUrl: "http://localhost:8080/videos/java.mp4",
  },
  {
    id: 2,
    title: "React with Spring Boot",
    price: "₹3999",
    description: "Build real time projects using React and Spring Boot",
    videoUrl: "http://localhost:8080/videos/java.mp4",
  },
  {
    id: 3,
    title: "SQL for Developers",
    price: "₹1999",
    description: "Master SQL for interviews and projects",
    videoUrl: "http://localhost:8080/videos/java.mp4",
  },
  ];

  const handleBuy = async (course) => {
    const email = localStorage.getItem("userId"); // saved at login

  const data = {
  userEmail: email,
  courseName: course.title,
  price: course.price,
  description: course.description,
  videoUrl: course.videoUrl,
};

    try {
      await axios.post("http://localhost:8080/buyCourse", data);
      alert("Course Purchased Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error purchasing course");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <p className="text-lg font-bold mt-2">{course.price}</p>
             

            <button
              onClick={() => handleBuy(course)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Buy Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;