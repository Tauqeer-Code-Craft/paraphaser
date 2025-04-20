import React, { useEffect, useState } from "react";
import {
  Receipt,
  Settings,
  Sparkles,
  UserCircle,
  Brain,
  History,
  Home,
   BookCheck,
} from "lucide-react";

import Sidebar, { SidebarItem } from "./Components/Sidebar";
import HistoryComponent from "./Components/History";
import MindMap from "./Components/MindMap";
import Summary from "./Components/Summary";
import ReceiptComponent from "./Components/Receipt";
import UserComponent from "./Components/User";
import SettingsComponent from "./Components/Settings";
import Quiz from "./Components/Quiz";
import axios from "axios";

const App = () => {
  const [selectedPage, setSelectedPage] = useState("User");
  const [username, setUsername] = useState("");
  const [expanded, setExpanded] = useState(false);
  const renderContent = () => {
    switch (selectedPage) {
      case "Summary":
        return <Summary />;
      case "Map":
        return <MindMap />;
      case "History":
        return <HistoryComponent />;
      case "Receipt":
        return <ReceiptComponent />;
      case "Quiz":
        return <Quiz/>
      case "User":
        return (
          <UserComponent
            setActiveSection={setSelectedPage}
            username={username}
          />
        );
      case "Settings":
        return (
          <SettingsComponent
            setActiveSection={setSelectedPage}
            username={username}
            setUsername={setUsername}
          />
        );
    }
  };

  useEffect(() => {
    const getUsername = async () => {
      try {
        const res = await axios.get("http://localhost:5000/username");
        setUsername(res.data);
      } catch (e) {
        console.log("Cannot get the username");
      }
    };
    getUsername();
  }, [username]);

  return (
    <main className="App">
      <div className="app-container">
        <Sidebar username={username} changeExpanded={setExpanded}>
          <SidebarItem
            icon={<Home size={20} />}
            text="Summarizer"
            onClick={() => setSelectedPage("Summary")}
            active={selectedPage === "Summary"}
          />
          <SidebarItem
            icon={<Brain size={20} />}
            text="MindMap"
            onClick={() => setSelectedPage("Map")}
            active={selectedPage === "Map"}
          />
          <SidebarItem
            icon={< BookCheck size={20} />}
            text="Quiz"
            onClick={() => setSelectedPage("Quiz")}
            active={selectedPage === "Quiz"}
          />
          <SidebarItem
            icon={<History size={20} />}
            text="History"
            onClick={() => setSelectedPage("History")}
            active={selectedPage === "History"}
          />
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="User"
            onClick={() => setSelectedPage("User")}
            active={selectedPage === "User"}
          />
          <hr />
          <SidebarItem
            icon={<Receipt size={20} />}
            text="Receipt"
            onClick={() => setSelectedPage("Receipt")}
            active={selectedPage === "Receipt"}
            alert={true}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            text="Settings"
            onClick={() => setSelectedPage("Settings")}
            active={selectedPage === "Settings"}
          />
        </Sidebar>

        <div className={`main-content ${expanded ? "ml-64" : "ml-16"}`}>
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default App;
