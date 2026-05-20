import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './pages/Home/HomePage'
import { DocumentsPage } from './pages/Documents/DocumentsPage'
import { KnowledgePage } from './pages/Knowledge/KnowledgePage'
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage'
import { UsersPage } from './pages/Admin/UsersPage'
import { RolesPage } from './pages/Admin/RolesPage'
import { SettingsPage } from './pages/Admin/SettingsPage'

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
