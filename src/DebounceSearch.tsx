import { useState, useEffect } from "react";
import dummyData from "./dummyData";

const DebounceSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState(dummyData);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Search handler
  const handleSearch = debounce((value) => {
    if (!value) {
      setFilteredRecords(dummyData);
      return;
    }

    const results = dummyData.filter((record) =>
      Object.values(record).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredRecords(results);
  }, 500);

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  // Set initial data
  useEffect(() => {
    setFilteredRecords(dummyData);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-blue-900 to-indigo-900 flex flex-col items-center p-5">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
          Debounce Search
        </h1>
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search by any field..."
          className="w-full p-4 mb-6 rounded-lg text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl overflow-x-auto">
          {filteredRecords.length > 0 ? (
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

export default DebounceSearch;
