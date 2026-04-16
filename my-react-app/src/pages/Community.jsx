import { FaUserFriends, FaHeart, FaBrain, FaCommentDots } from "react-icons/fa";
import { Link } from "react-router-dom";

const CommunityPage = () => {
  // Sample community topics
  const communityTopics = [
    {
      icon: <FaBrain className="text-purple-600 text-4xl" />,
      title: "Mental Health",
      description: "Discussions and support for mental wellness.",
      members: 1200,
    },
    {
      icon: <FaHeart className="text-red-500 text-4xl" />,
      title: "Personal Growth",
      description: "Tips, experiences, and mentorship for growth.",
      members: 950,
    },
    {
      icon: <FaUserFriends className="text-green-500 text-4xl" />,
      title: "Social Connections",
      description: "Meet like-minded people and build friendships.",
      members: 800,
    },
    {
      icon: <FaCommentDots className="text-blue-500 text-4xl" />,
      title: "Research Discussions",
      description: "Share and discuss latest research and studies.",
      members: 500,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 pt-30">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Truth Life Community</h1>
        <p className="text-gray-700 text-lg">
          Join our community groups, participate in discussions, and connect with people who share your interests.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {communityTopics.map((topic, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 relative"   
          >
            <div className="flex justify-center mb-4">{topic.icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{topic.title}</h2>
            <p className="text-gray-700 mb-4">{topic.description}</p>
            <p className="text-sm text-gray-500 mb-4">Members: {topic.members}</p>
     <Link to="/signup">
  <button className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors cursor-pointer">
    Join / View
  </button>
</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;