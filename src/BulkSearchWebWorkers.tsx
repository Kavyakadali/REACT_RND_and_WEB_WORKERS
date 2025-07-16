import { useState, useEffect, useCallback, useRef } from "react";
import dummyData from "./dummyData";

// Temporary dummy data for demonstration
// const dummyData = [
//   {
//     id: 1,
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     phone: "123-456-7890",
//     address: "123 Main St",
//     age: 30,
//     occupation: "Engineer",
//     company: "Tech Corp",
//     membership: "Premium" as const,
//   },
//   {
//     id: 2,
//     firstName: "Jane",
//     lastName: "Smith",
//     email: "jane.smith@example.com",
//     phone: "234-567-8901",
//     address: "456 Oak Ave",
//     age: 28,
//     occupation: "Designer",
//     company: "Creative Inc",
//     membership: "Standard" as const,
//   },
//   {
//     id: 3,
//     firstName: "Bob",
//     lastName: "Johnson",
//     email: "bob.johnson@example.com",
//     phone: "345-678-9012",
//     address: "789 Pine Rd",
//     age: 35,
//     occupation: "Manager",
//     company: "Business Corp",
//     membership: "Premium" as const,
//   },
//   {
//     id: 4,
//     firstName: "Alice",
//     lastName: "Brown",
//     email: "alice.brown@example.com",
//     phone: "456-789-0123",
//     address: "321 Elm St",
//     age: 32,
//     occupation: "Developer",
//     company: "Tech Solutions",
//     membership: "Standard" as const,
//   },
//   {
//     id: 5,
//     firstName: "Charlie",
//     lastName: "Davis",
//     email: "charlie.davis@example.com",
//     phone: "567-890-1234",
//     address: "654 Maple Dr",
//     age: 29,
//     occupation: "Analyst",
//     company: "Data Corp",
//     membership: "Premium" as const,
//   },
// ];

// Simple debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

interface UserRecord {
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

// Worker code as a string - simplified without Comlink
const workerCode = `
  class SearchWorker {
    constructor() {
      this.data = [];
      console.log('SearchWorker initialized');
    }

    initialize(records) {
      console.log('Initializing with', records.length, 'records');
      this.data = records;
      return { success: true, count: this.data.length };
    }

    search(searchTerm) {
      console.log('Searching for:', searchTerm);
      
      if (!searchTerm || searchTerm.trim() === '') {
        return this.data;
      }

      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      const results = this.data.filter((record) => {
        return Object.values(record).some((field) => {
          return String(field).toLowerCase().includes(lowerSearchTerm);
        });
      });

      console.log('Found', results.length, 'results');
      return results;
    }

    getAllRecords() {
      return this.data;
    }
  }

  const searchWorker = new SearchWorker();

  // Handle messages from main thread
  self.onmessage = function(e) {
    const { id, method, args } = e.data;
    
    try {
      let result;
      
      switch(method) {
        case 'initialize':
          result = searchWorker.initialize(args[0]);
          break;
        case 'search':
          result = searchWorker.search(args[0]);
          break;
        case 'getAllRecords':
          result = searchWorker.getAllRecords();
          break;
        default:
          throw new Error('Unknown method: ' + method);
      }
      
      // Send result back to main thread
      self.postMessage({ id, result, error: null });
    } catch (error) {
      // Send error back to main thread
      self.postMessage({ id, result: null, error: error.message });
    }
  };
`;

const BulkSearchWebWorkers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] =
    useState<UserRecord[]>(dummyData);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workerReady, setWorkerReady] = useState(false);
  const pendingMessagesRef = useRef<
    Map<number, { resolve: Function; reject: Function }>
  >(new Map());

  useEffect(() => {
    const initializeWorker = async () => {
      try {
        console.log("Creating Web Worker...");

        // Create the worker from the worker code
        const blob = new Blob([workerCode], { type: "application/javascript" });
        const workerUrl = URL.createObjectURL(blob);
        const newWorker = new Worker(workerUrl);

        // Handle messages from worker
        newWorker.onmessage = (e) => {
          const { id, result, error } = e.data;
          const pendingMessage = pendingMessagesRef.current.get(id);

          if (pendingMessage) {
            if (error) {
              pendingMessage.reject(new Error(error));
            } else {
              pendingMessage.resolve(result);
            }
            pendingMessagesRef.current.delete(id);
          }
        };

        newWorker.onerror = (error) => {
          console.error("Worker error:", error);
          setError(`Worker error: ${error.message}`);
        };

        setWorker(newWorker);

        // Initialize the worker with data
        console.log("Initializing worker...");
        const initResult = await callWorkerMethod(newWorker, "initialize", [
          dummyData,
        ]);
        console.log("Worker initialized:", initResult);
        setWorkerReady(true);

        // Cleanup function
        return () => {
          newWorker.terminate();
          URL.revokeObjectURL(workerUrl);
        };
      } catch (err) {
        console.error("Worker initialization failed:", err);
        setError(
          `Failed to initialize Web Worker: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      }
    };

    const cleanup = initializeWorker();

    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.());
    };
  }, []);

  // Helper function to call worker methods
  const callWorkerMethod = (
    workerInstance: Worker,
    method: string,
    args: any[]
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const id = Date.now() + Math.random(); // Use timestamp + random for unique ID

      pendingMessagesRef.current.set(id, { resolve, reject });

      workerInstance.postMessage({ id, method, args });

      // Set timeout to prevent hanging promises
      setTimeout(() => {
        if (pendingMessagesRef.current.has(id)) {
          pendingMessagesRef.current.delete(id);
          reject(new Error("Worker method call timeout"));
        }
      }, 5000); // 5 second timeout
    });
  };

  const performSearch = async (searchValue: string) => {
    if (!worker || !workerReady) {
      console.warn("Worker not ready, falling back to local search");
      performLocalSearch(searchValue);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call the search method on the worker
      const results = await callWorkerMethod(worker, "search", [searchValue]);
      setFilteredRecords(results);
    } catch (err) {
      console.error("Search error:", err);
      setError(
        `Search failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      // Fallback to local search
      performLocalSearch(searchValue);
    } finally {
      setLoading(false);
    }
  };

  const performLocalSearch = (searchValue: string) => {
    if (!searchValue || searchValue.trim() === "") {
      setFilteredRecords(dummyData);
      return;
    }

    const lowerSearchTerm = searchValue.toLowerCase().trim();
    const results = dummyData.filter((record) => {
      return Object.values(record).some((field) => {
        return String(field).toLowerCase().includes(lowerSearchTerm);
      });
    });

    setFilteredRecords(results);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      performSearch(value);
    }, 500),
    [worker, workerReady]
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
            Web Worker Search Demo (Fixed)
          </h1>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-600 hover:to-green-600 text-white font-bold py-2 px-4 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-teal-500/25 border-0 cursor-pointer"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 flex items-center">
            <div className="flex-shrink-0 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  workerReady ? "bg-green-400" : "bg-yellow-400"
                }`}
              ></div>
              <span className="text-white font-medium">
                Worker Status: {workerReady ? "Ready" : "Initializing..."}
              </span>
            </div>
            <div className="text-white text-sm">
              {workerReady
                ? "Using Web Worker for search"
                : "Using fallback search"}
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search by any field (name, email, company, etc.)..."
            className="w-full p-4 rounded-lg text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-lg"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg shadow-xl overflow-hidden">
          {loading ? (
            <div className="text-white text-center p-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
              <p className="text-lg">Searching...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-white border-collapse">
                <thead className="bg-gray-700/80">
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
                    <th className="p-3 text-left border-b border-gray-600 min-w-[200px]">
                      Email
                    </th>
                    <th className="p-3 text-left border-b border-gray-600 min-w-[120px]">
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
                    <th className="p-3 text-left border-b border-gray-600 min-w-[120px]">
                      Company
                    </th>
                    <th className="p-3 text-left border-b border-gray-600 min-w-[100px]">
                      Membership
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="p-3 border-b border-gray-600/50">
                        {record.id}
                      </td>
                      <td className="p-3 border-b border-gray-600/50">
                        {record.firstName}
                      </td>
                      <td className="p-3 border-b border-gray-600/50">
                        {record.lastName}
                      </td>
                      <td className="p-3 border-b border-gray-600/50">
                        {record.email}
                      </td>
                      <td className="p-3 border-b border-gray-600/50">
                        {record.phone}
                      </td>
                      <td className="p-3 border-b border-gray-600/50">
                        {record.address}
                      </td>
                      <td className="p-3 border-b border-gray-600/50">
                        {record.age}
                      </td>
                      <td className="p-3 border-b border-gray-600/50">
                        {record.occupation}
                      </td>
                      <td className="p-3 border-b border-gray-600/50">
                        {record.company}
                      </td>
                      <td className="p-3 border-b border-gray-600/50">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            record.membership === "Premium"
                              ? "bg-yellow-600 text-yellow-100"
                              : "bg-blue-600 text-blue-100"
                          }`}
                        >
                          {record.membership}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-white text-center p-8">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-xl">No records found</p>
              <p className="text-gray-400 mt-2">
                Try searching with different terms
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            Total Records: {dummyData.length} | Showing:{" "}
            {filteredRecords.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BulkSearchWebWorkers;
