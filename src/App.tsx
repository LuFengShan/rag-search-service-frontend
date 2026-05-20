import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './pages/Home/HomePage'
import { DocumentsPage } from './pages/Documents/DocumentsPage'
import { KnowledgePage } from './pages/Knowledge/KnowledgePage'
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage'
import { UsersPage } from './pages/Admin/UsersPage'
import { RolesPage } from './pages/Admin/RolesPage'
import { SettingsPage } from './pages/Admin/SettingsPage'
import { LoginPage } from './pages/Login/LoginPage'
import { useUserStore } from './stores/userStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUserStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function App() {
  const { initFromStorage } = useUserStore()

  useEffect(() => {
    initFromStorage()
  }, [initFromStorage])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/knowledge" element={<KnowledgePage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                  <Route path="/admin/roles" element={<RolesPage />} />
                  <Route path="/admin/settings" element={<SettingsPage />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
