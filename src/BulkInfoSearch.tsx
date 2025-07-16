import { useNavigate } from "react-router-dom";

const BulkInfoSearch = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-blue-900 to-indigo-900 flex items-center justify-center p-5">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-12">
          Bulk Info Search
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Perform bulk information searches with our powerful web worker tools
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
          <button
            onClick={() => navigate("/bulk-search-web-workers")}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border-0 cursor-pointer"
          >
            🔍 Search Now
          </button>
          <button
            onClick={() => navigate("/web-workers")}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-600 hover:to-green-600 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-teal-500/25 border-0 cursor-pointer"
          >
            🌐 Back to Web Workers
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkInfoSearch;
