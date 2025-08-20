import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-5">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-12">
          Welcome to Our Platform
        </h1>
        <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
          <button
            onClick={() => navigate("/web-workers")}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-600 hover:to-green-600 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-teal-500/25 border-0 cursor-pointer"
          >
            🌐 WEB WORKERS
          </button>
          <button
            onClick={() => navigate("/rnd")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 border-0 cursor-pointer"
          >
            🚀 RND
          </button>
          <button
            onClick={() => navigate("/multipart-upload")}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border-0 cursor-pointer"
          >
            📤 MULTIPART UPLOAD
          </button>
          <button
            onClick={() => navigate("/animation-world")}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border-0 cursor-pointer"
          >
            ANIMATION WORLD
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
