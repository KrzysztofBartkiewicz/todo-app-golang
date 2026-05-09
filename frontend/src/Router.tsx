import { createBrowserRouter } from 'react-router'
import MainView from './views/MainView'
import LoginView from './views/LoginView'
import App from './App'
import RequireAuth from './auth/RequireAuth'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/login', element: <LoginView /> },
      {
        element: <RequireAuth />,
        children: [{ path: '/', element: <MainView /> }],
      },
    ],
  },
])
