import { Routes, Route } from "react-router";
import { CalendarPage } from "../pages/CalendarPage/CalendarPage";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { ManagePage } from "../pages/ManagePage/ManagePage";
import { SignInPage } from "../pages/SignInPage/SignInPage";
import type { JSX } from "react";
import { ManageTopBar } from "../pages/ManagePage/ManageTopBar";
import { BottomBar } from "../components/BottomBar/BottomBar";


interface AppRoute {
  path: string,
  element: JSX.Element,
  topBar?: JSX.Element,
  bottomBar?: JSX.Element
}

const appRoutes: AppRoute[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/calendar",
    element: <CalendarPage />
  },
  {
    path: "/manage",
    element: <ManagePage />,
    topBar: <ManageTopBar />
  },
  {
    path: "/dashboard",
    element: <DashboardPage />
  },
  {
    path: "/sign-in",
    element: <SignInPage hidden={false} />
  },
]

export function AppRoutes() {

  return <div>
    <Routes>
      {
        appRoutes.map(r => <Route key={r.path} path={r.path} element={r.topBar} /> )
      }
    </Routes>
    <div className="app-content">
      <Routes>
        <Route index element={<HomePage />} />
        {
          appRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} /> )
        }
      </Routes>
    </div>
    <Routes>
      {
        appRoutes.map(r => (                                                                                                                    
          <Route
            key={r.path}
            path={r.path}
            element={r.bottomBar ?? <BottomBar />}
          />
        ))
      }
    </Routes>
  </div>
}