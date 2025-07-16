// src/BulkSearchWebWorkers.tsx (with inline worker)
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import dummyData from "@/dummyData";
import { debounce } from "@/utils/debounce";

interface Record {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  occupation: string;
  company: string;
  membership: "Premium" | "Standard";
}

interface WorkerMessage {
  type: "init" | "search" | "error";
  data?: Record[];
  searchTerm?: string;
  error?: string;
}

// Worker code as a string
const workerCode = `
let data = [];

self.onmessage = (e) => {
  try {
    console.log('Worker received message:', e.data);
    if (e.data.type === 'init') {
      data = e.data.data || [];
      console.log('Worker initialized with', data.length, 'records');
      self.postMessage({ type: 'init', data });
    } else if (e.data.type === 'search') {
      const searchTerm = e.data.searchTerm?.toLowerCase() || '';
      console.log('Worker searching for:', searchTerm);
      if (!searchTerm) {
        self.postMessage({ type: 'search', data });
        return;
      }
      const results = data.filter((record) =>
        Object.values(record).some((field) =>
          String(field).toLowerCase().includes(searchTerm)
        )
      );
      console.log('Worker found', results.length, 'results');
      self.postMessage({ type: 'search', data: results });
    } else {
      throw new Error(\`Unknown message type: \${e.data.type}\`);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error in Web Worker';
    console.error('Worker error:', error);
    self.postMessage({ type: 'error', error: errorMsg });
  }
};
`;

const BulkSearchWebWorkers2 = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState<Record[]>(dummyData);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log("Attempting to initialize Web Worker");

      // Create worker from blob URL
      const blob = new Blob([workerCode], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      const webWorker = new Worker(workerUrl);

      console.log("Web Worker created:", webWorker);
      setWorker(webWorker);

      webWorker.postMessage({ type: "init", data: dummyData } as WorkerMessage);

      webWorker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        console.log("Received message from worker:", e.data);
        setLoading(false);
        if (e.data.type === "error") {
          setError(e.data.error || "Unknown error in Web Worker");
          setFilteredRecords(dummyData);
        } else {
          setFilteredRecords(e.data.data || []);
        }
      };

      webWorker.onerror = (error: ErrorEvent) => {
        setLoading(false);
        console.error("Web Worker error details:", {
          message: error.message,
          filename: error.filename,
          lineno: error.lineno,
          colno: error.colno,
          error: error.error,
        });
        setError(
          `Worker error: ${
            error.message || "Unknown (check console for details)"
          }`
        );
        setFilteredRecords(dummyData);
      };

      return () => {
        console.log("Terminating Web Worker");
        webWorker.terminate();
        URL.revokeObjectURL(workerUrl); // Clean up blob URL
      };
    } catch (err) {
      console.error("Worker initialization failed:", err);
      setError(
        `Failed to initialize Web Worker: ${
          err instanceof Error ? err.message : "Unknown"
        }`
      );
      setFilteredRecords(dummyData);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (worker) {
        console.log("Posting search to worker:", value);
        setLoading(true);
        worker.postMessage({
          type: "search",
          searchTerm: value,
        } as WorkerMessage);
      }
    }, 500),
    [worker]
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-blue-900 to-indigo-900 flex flex-col items-center p-5">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Web Worker Search
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-600 hover:to-green-600 text-white font-bold py-2 px-4 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-teal-500/25 border-0 cursor-pointer"
          >
            Back
          </button>
        </div>
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search by any field..."
          className="w-full p-4 mb-6 rounded-lg text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl overflow-x-auto">
          {loading ? (
            <p className="text-white text-center p-4">Loading...</p>
          ) : filteredRecords.length > 0 ? (
            <table className="w-full text-white border-collapse">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left border-b border-gray-600 min-w-[50px]">
                    ID
                  </th>
                  <th className="p-3 text-left border-b border-gray-600 min-w-[100px]">
                    First Name
                  </th>
                  <th className="p-3 text-left border-b border-gray-600 min-w-[100px]">
                    Last Name
                  </th>
                  <th className="p-3 text-left border-b border-gray-600 min-w-[150px]">
                    Email
                  </th>
                  <th className="p-3 text-left border-b border-gray-600 min-w-[100px]">
                    Phone
                  </th>
                  <th className="p-3 text-left border-b border-gray-600 min-w-[150px]">
                    Address
                  </th>
                  <th className="p-3 text-left border-b border-gray-600 min-w-[50px]">
                    Age
                  </th>
                  <th className="p-3 text-left border-b border-gray-600 min-w-[100px]">
                    Occupation
                  </th>
                  <th className="p-3 text-left border-b border-gray-600 min-w-[100px]">
                    Company
                  </th>
                  <th className="p-3 text-left border-b border-gray-600 min-w-[100px]">
                    Membership
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-600">
                    <td className="p-3 border-b border-gray-600">
                      {record.id}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      {record.firstName}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      {record.lastName}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      {record.email}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      {record.phone}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      {record.address}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      {record.age}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      {record.occupation}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      {record.company}
                    </td>
                    <td className="p-3 border-b border-gray-600">
                      {record.membership}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-white text-center p-4">No records found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkSearchWebWorkers2;
