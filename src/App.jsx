import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BotDetails from './pages/BotDetails'
import MyInstances from './pages/MyInstances'
import Integrations from './pages/Integrations'
import Schedule from './pages/Schedule/Schedule'
import MediaLink from './pages/Routes/Routes'
import DashboardAnalytics from './pages/Analytics/Dashboard'
import AiChat from './pages/AICHAT/AiChat'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bot/:botId" element={<BotDetails />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/my-instances" element={<MyInstances />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/routes" element={<MediaLink />} />
          <Route path="/analytics" element={<DashboardAnalytics />} />
          <Route path="/ai-chat" element={<AiChat />} />
        </Routes>
      </main>
    </div>
  )
}

export default App


// hdvnr-d3eic-ukdac-v5xon-fjnow-6b6ph-w6arv-6um6q-tonjd-qyn4t-lae