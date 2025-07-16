// RNDWorldPage.jsx
import { useNavigate } from "react-router-dom";

const RNDWorldPage = () => {
  const navigate = useNavigate();

  const handleEnterRNDWorld = () => {
    navigate("/Addrecipient");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-5">
      <div className="text-center">
        {/* Main Heading */}
        <h1
          className="text-6xl md:text-7xl font-bold text-white mb-8 cursor-pointer hover:text-blue-300 transition-all duration-300 transform hover:scale-105 select-none"
          onClick={handleEnterRNDWorld}
        >
          Enter into the
        </h1>

        {/* RND World Heading with special styling */}
        <h2
          className="text-7xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-12 cursor-pointer hover:from-purple-400 hover:via-pink-500 hover:to-red-500 transition-all duration-500 transform hover:scale-110 select-none"
          onClick={handleEnterRNDWorld}
        >
          RND WORLD
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover innovations, explore possibilities, and dive into the world
          of Research & Development
        </p>

        {/* Enter Button */}
        <button
          onClick={handleEnterRNDWorld}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 border-0 cursor-pointer"
        >
          🚀 Enter Now
        </button>

        {/* Decorative elements */}
        <div className="mt-16 flex justify-center space-x-8">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-200"></div>
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default RNDWorldPage;
