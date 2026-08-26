import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { AuthProvider } from './context/AuthContext'
import DashboardPage from './pages/dashboard'
import LoginPage from './pages/login'
import NotFound from './pages/notFound'
import RegisterPage from './pages/register'
import { ProtectedRoute, PublicOnlyRoute } from './routes'
import Report from './pages/report'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root redirect to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

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

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/report" element={<Report />} />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
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
