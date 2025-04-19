import React, { useState } from "react";
import { User } from "lucide-react";
import axios from "axios";

const Settings = ({ setActiveSection, username, setUsername }) => {
  const [user, setUser] = useState(username);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Settings
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Change Username</span>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="border p-2 rounded-md text-gray-700"
            placeholder="Enter your name"
          />
        </div>

        <button
          onClick={async () => {
            await axios.put("http://localhost:5000/username", {
              old_username: username,
              new_username: user,
            });
            setUsername(user);
            setActiveSection("User");
          }}
          className="w-full flex items-center gap-2 p-3 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
        >
          <User size={18} /> Go to Profile
        </button>
      </div>
    </div>
  );
};

export default Settings;
