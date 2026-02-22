import { Routes, Route } from 'react-router'
import { BottomBar } from './components/BottomBar/BottomBar.tsx'
import { HomePage } from './pages/HomePage/HomePage.tsx'
import { CalendarPage } from './pages/CalendarPage/CalendarPage.tsx'
import { ManagePage } from './pages/ManagePage/ManagePage.tsx'
import { DashboardPage } from './pages/DashboardPage/DashboardPage.tsx'
import './App.scss'
import { SignInPage } from './pages/SignInPage/SignInPage.tsx'
import { Authenticator } from '@aws-amplify/ui-react'
import { refreshIdToken } from './auth/auth.tsx'

void refreshIdToken();

function App() {
  return (
    <Authenticator.Provider>
    {/* hidden sign in page will force proper configuration for Authenticator */}
    <SignInPage hidden />
      <div className="app-layout">
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sign-in" element={<SignInPage hidden={false}/>} />
          </Routes>
        </main>
        <BottomBar />
      </div>
    </Authenticator.Provider>
  )
}

export default App
