import React, { useEffect, useState } from "react";
import { UserCircle, Clock, Home } from "lucide-react";

const User = ({ setActiveSection, username }) => {
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/history");
        const data = await res.json();
        setHistoryCount(data.length);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md mt-10 border-gray-300 border">
      <div className="flex flex-col items-center text-center">
        <UserCircle size={64} className="text-indigo-500 mb-3" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome, {username}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Keep summarizing cool content 🎥
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Total Videos Summarized</span>
          <span className="font-bold text-indigo-600">{historyCount}</span>
        </div>

        <button
          onClick={() => setActiveSection("History")}
          className="w-full flex items-center gap-2 p-3 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
        >
          <Clock size={18} /> View History
        </button>

        <button
          onClick={() => setActiveSection("Summary")}
          className="w-full flex items-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
        >
          <Home size={18} /> Go to Summarizer
        </button>
      </div>
    </div>
  );
};

export default User;
