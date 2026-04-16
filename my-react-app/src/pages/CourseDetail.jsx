import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pt-28 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-indigo-600 font-semibold"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          Course ID: {id}
        </h1>

        <p className="text-gray-700 text-lg mb-6">
          This is a demo course information page. Yaha par aapko course ke
          details, topics, aur learning outcomes dikhaye jayenge.
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">What you will learn</h2>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Complete understanding of the course topic</li>
            <li>Hands-on practical examples</li>
            <li>Real-world project explanation</li>
            <li>Interview preparation tips</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Demo Video</h2>
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;