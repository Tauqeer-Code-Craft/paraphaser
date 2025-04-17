import React, { useState } from 'react'
import {
  Receipt, Settings, FileInput, UserCircle, LayoutDashboard, Brain, History
} from "lucide-react"

import Sidebar, { SidebarItem } from './Components/Sidebar'
import HistoryComp from './Components/History'
import MindMap from './Components/MindMap'
import Summary from './Components/Summary'

const App = () => {
  const [selectedPage, setSelectedPage] = useState('Dashboard') // Track selected page

  const renderContent = () => {
    switch (selectedPage) {
      case 'Dashboard':
        return <Summary />
      case 'Summary':
        return <Summary />
      case 'Map':
        return <MindMap />
      case 'History':
        return <HistoryComp />
      case 'Receipt':
        return <div>Receipt Content</div>;
      case 'User':
        return <div>User Content</div>;
      case 'Settings':
        return <div>Settings Content</div>;
      default:
        return <div>Default Content</div>;
    }
  }

  return (
    <main className='App'>
      <div className="app-container">
        {/* Sidebar */}
        <Sidebar>
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            onClick={() => setSelectedPage('Dashboard')}
            active={selectedPage === 'Dashboard'}
          />
          <SidebarItem
            icon={<FileInput size={20} />}
            text="Summarizer"
            onClick={() => setSelectedPage('Summary')}
            active={selectedPage === 'Summary'}
          />
          <SidebarItem
            icon={<Brain size={20} />}
            text="MindMap"
            onClick={() => setSelectedPage('Map')}
            active={selectedPage === 'Map'}
          />
          <SidebarItem
            icon={<History size={20} />}
            text="History"
            onClick={() => setSelectedPage('History')}
            active={selectedPage === 'History'}
          />
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="User"
            onClick={() => setSelectedPage('User')}
            active={selectedPage === 'User'}
          />
          <hr />
          <SidebarItem
            icon={<Receipt size={20} />}
            text="Receipt"
            onClick={() => setSelectedPage('Receipt')}
            active={selectedPage === 'Receipt'}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            text="Settings"
            onClick={() => setSelectedPage('Settings')}
            active={selectedPage === 'Settings'}
          />
        </Sidebar>

        {/* Main Content */}
        <div className="main-content">
          {renderContent()} {/* Render content based on selected page */}
        </div>
      </div>
    </main>
  )
}

export default App;
