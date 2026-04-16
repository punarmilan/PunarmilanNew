import bgImage from "../assets/Truthlife.png";
import { FaUserGraduate, FaUserTie } from 'react-icons/fa';
import { HeartHandshake, Brain, BookOpenCheck, Sparkles } from "lucide-react";

function TruthLife() {
  return (
  

    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white pt-19 to-purple-100 py-16 overflow-hidden">

      {/* Hero */}
<div
  className="relative w-full  h-[90vh] flex items-center justify-center overflow-hidden"
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* Dark overlay for better visibility */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Content */}
  <div className="relative text-center px-6 ">
    <h1 className="text-6xl font-extrabold text-white mb-6">
      Truth Life Community
    </h1>

    <p className="text-lg text-gray-200">
      A safe, supportive and growth-driven space for mental health,
      community bonding and personal development for the young generation.
    </p>

    <button className="mt-8 px-10 py-4 bg-indigo-600 text-white rounded-full text-lg shadow-xl hover:scale-105 transition">
      Join Now
    </button>
  </div>
</div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto pt-30">

        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:shadow-indigo-200 transition">
          <HeartHandshake size={40} className="text-indigo-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-3">Community Support</h2>
          <p className="text-gray-600">
            Share problems, doubts and experiences with people who truly understand you.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:shadow-indigo-200 transition">
          <Brain size={40} className="text-indigo-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-3">Mental Health Research</h2>
          <p className="text-gray-600">
            Guided mental wellness programs based on research and development.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:shadow-indigo-200 transition">
          <BookOpenCheck size={40} className="text-indigo-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-3">Stage Based Study</h2>
          <p className="text-gray-600">
            Structured learning stages for self-improvement and clarity in life.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:shadow-indigo-200 transition">
          <Sparkles size={40} className="text-indigo-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-3">Premium Youth Programs</h2>
          <p className="text-gray-600">
            Special paid programs to guide young people in career, life and relationships.
          </p>
        </div>

      </div>

      {/* 6-Stage Study Journey */}
<section className="w-full py-20 bg-gradient-to-br from-white to-indigo-50">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-16">
      6-Stage Study Journey
    </h2>

    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      
      {/* Card 1 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300 border-t-4 border-indigo-600">
        <div className="text-indigo-600 text-3xl font-bold mb-4">01</div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">Self Awareness</h3>
        <p className="text-gray-600 leading-relaxed">
          Understand your thoughts, emotions, habits, and triggers. Recognize who you are and what affects your mental well-being.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300 border-t-4 border-indigo-600">
        <div className="text-indigo-600 text-3xl font-bold mb-4">02</div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">Emotional Expression</h3>
        <p className="text-gray-600 leading-relaxed">
          Learn how to express your feelings in a healthy way. Sharing emotions reduces mental pressure and builds inner clarity.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300 border-t-4 border-indigo-600">
        <div className="text-indigo-600 text-3xl font-bold mb-4">03</div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">Problem Identification</h3>
        <p className="text-gray-600 leading-relaxed">
          Identify the root causes of stress, anxiety, overthinking, or confusion. Awareness is the first step to solving problems.
        </p>
      </div>

      {/* Card 4 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300 border-t-4 border-indigo-600">
        <div className="text-indigo-600 text-3xl font-bold mb-4">04</div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">Guided Solutions</h3>
        <p className="text-gray-600 leading-relaxed">
          Get structured guidance, exercises, and practical steps designed by research to improve mental and emotional health.
        </p>
      </div>

      {/* Card 5 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300 border-t-4 border-indigo-600">
        <div className="text-indigo-600 text-3xl font-bold mb-4">05</div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">Personal Growth</h3>
        <p className="text-gray-600 leading-relaxed">
          Build confidence, discipline, positive habits, and a growth mindset to improve daily life and long-term goals.
        </p>
      </div>

      {/* Card 6 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300 border-t-4 border-indigo-600">
        <div className="text-indigo-600 text-3xl font-bold mb-4">06</div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">Community & Support</h3>
        <p className="text-gray-600 leading-relaxed">
          Connect with like-minded people, share experiences, and receive support in a safe and positive environment.
        </p>
      </div>

    </div>
  </div>
</section>


     <section className="py-16 bg-gradient-to-r from-purple-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-8">
          Personalized Advice for Everyone
        </h2>
        <p className="text-purple-700 mb-12">
          We provide tailored guidance for young adults and senior citizens. Choose the service that fits you!
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Young Generation - Paid Advice */}
          <div className="bg-white shadow-lg rounded-2xl p-10 border-t-4 border-purple-600 hover:scale-105 transition-transform duration-300 relative">
            <div className="flex justify-center mb-4">
              <FaUserGraduate className="text-purple-600 text-6xl" />
            </div>
            <h3 className="text-2xl font-semibold text-purple-900 mb-2">
              Young Generation
            </h3>
            <p className="text-purple-700 mb-4">
              Get expert advice for your career, relationships, and life goals. Premium support for ambitious young adults.
            </p>
            {/* Pricing Badge */}
            <div className="mb-6">
              <span className="inline-block bg-purple-100 text-purple-800 font-semibold px-4 py-2 rounded-full">
                ₹499 / Month
              </span>
            </div>
            <span className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full font-semibold cursor-pointer hover:bg-purple-700 transition-colors">
              Get Paid Service
            </span>
          </div>

          {/* Senior Citizens - Free Service */}
          <div className="bg-white shadow-lg rounded-2xl p-10 border-t-4 border-green-500 hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <FaUserTie className="text-green-500 text-6xl" />
            </div>
            <h3 className="text-2xl font-semibold text-green-900 mb-2">
              Senior Citizens
            </h3>
            <p className="text-green-700 mb-6">
              Free guidance to help you stay informed and make confident decisions. Caring support for our elders.
            </p>
            <span className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-semibold cursor-pointer hover:bg-green-600 transition-colors">
              Get Free Service
            </span>
          </div>

        </div>
      </div>
    </section>


    </div>
  );
}

export default TruthLife;