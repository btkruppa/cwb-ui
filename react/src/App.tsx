import { Routes, Route } from 'react-router'
import { BottomBar } from './components/BottomBar/BottomBar.tsx'
import { HomePage } from './pages/HomePage/HomePage.tsx'
import { CalendarPage } from './pages/CalendarPage/CalendarPage.tsx'
import { ManagePage } from './pages/ManagePage/ManagePage.tsx'
import { DashboardPage } from './pages/DashboardPage/DashboardPage.tsx'
import './App.scss'

function App() {
  return (
    <div className="app-layout">
      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
      <BottomBar />
    </div>
  )
}

export default App
