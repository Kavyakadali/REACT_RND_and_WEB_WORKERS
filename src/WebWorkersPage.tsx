// src/WebWorkersPage.tsx
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "@/utils/debounce";

const WebWorkersPage = () => {
  const navigate = useNavigate();

  const handleDebounceSearch = useCallback(
    debounce(() => {
      navigate("/debounce-search");
    }, 500),
    [navigate]
  );

  const handleWebWorkerSearch = useCallback(() => {
    navigate("/bulkinfosearch");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 flex items-center justify-center p-5">
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 cursor-pointer hover:text-green-300 transition-all duration-300 transform hover:scale-105 select-none">
          Welcome to the
        </h1>
        <h2 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 bg-clip-text text-transparent mb-12 cursor-pointer hover:from-blue-400 hover:via-cyan-500 hover:to-green-500 transition-all duration-500 transform hover:scale-110 select-none">
          WEB WORKERS WORLD
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Explore the power of web workers, optimize performance, and dive into
          parallel processing
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
          <button
            onClick={handleDebounceSearch}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-teal-500/25 border-0 cursor-pointer"
          >
            🔍 Search with Debounce
          </button>
          <button
            onClick={handleWebWorkerSearch}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border-0 cursor-pointer"
          >
            🌐 Search with Web Workers
          </button>
        </div>
        <div className="mt-16 flex justify-center space-x-8">
          <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-teal-400 rounded-full animate-pulse delay-200"></div>
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default WebWorkersPage;
