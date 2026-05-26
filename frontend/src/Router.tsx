import { createBrowserRouter, Navigate } from 'react-router'
import MainView from './views/MainView'
import LoginView from './views/LoginView'
import RegisterView from './views/RegisterView'
import ConnectionErrorView from './views/ConnectionErrorView'
import App from './App'
import RequireAuth from './auth/RequireAuth'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/login', element: <LoginView /> },
      { path: '/register', element: <RegisterView /> },
      { path: '/connection-error', element: <ConnectionErrorView /> },
      {
        element: <RequireAuth />,
        children: [{ path: '/', element: <MainView /> }],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
