import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null); // for toggling

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-6 text-center">
        Your Summarization History
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading history...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-500">No history found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-4 transition-all"
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex gap-3">
                  <img
                    src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                    alt="Thumbnail"
                    className="w-28 h-20 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="text-md font-medium text-gray-800 max-w-xs truncate">
                      {`Video ID: ${item.videoId}`}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Clock size={14} className="mr-1" />
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-indigo-500 transition">
                  {expandedIndex === index ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
              {expandedIndex === index && (
                <div className="mt-4 border-t pt-3 text-sm text-gray-700 whitespace-pre-line">
                  <h3 className="font-bold">Summary</h3>
                  {item.summary || "No summary available."}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
