import './App.scss'
import { SignInPage } from './pages/SignInPage/SignInPage.tsx'
import { Authenticator } from '@aws-amplify/ui-react'
import { refreshIdToken } from './auth/auth.tsx'
import { AppRoutes } from './routes/AppRoutes.tsx'

void refreshIdToken();

function App() {
  return (
    <Authenticator.Provider>
    {/* hidden sign in page will force proper configuration for Authenticator */}
    <SignInPage hidden />
      <div className="app-layout">
        <AppRoutes />
      </div>
    </Authenticator.Provider>
  )
}

export default App
