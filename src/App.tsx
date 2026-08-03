
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RootPage from './pages'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import { PublicOnlyRoute } from './routes'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />

          {/* <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/board/:boardId" element={<BoardPage />} />
          </Route> */}

          {/* <Route path="/404" element={<NotFound />} /> */}
          {/* <Route path="*" element={<Navigate to="/404" replace />} /> */}
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#16161d",
              border: "1px solid #e9e8f3",
              borderRadius: "999px",
              padding: "0.6rem 1rem",
              boxShadow: "0 8px 24px rgba(28,27,64,0.1)",
              fontSize: "0.875rem",
              fontWeight: 500,
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
