import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ApprovalPage } from './pages/ApprovalPage';
import { RejectedDocuments } from './pages/RejectedDocuments';
import { LoginPage } from './pages/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { FileText } from 'lucide-react';

function App() {
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('role') || sessionStorage.getItem('role');
  const location = useLocation();

  // Hide navigation links for the login page
  const hideNavLinks = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Conditionally render navigation links based on the current route */}
      {!hideNavLinks && token && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">DocFlow</span>
                </div>
                <div className="ml-6 flex space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/approvals"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Approvals
                  </Link>
                  {/* Display the Rejected Documents link only for Admin */}
                  {userRole === 'Admin' && (
                    <Link
                      to="/rejected"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                      Rejected Documents
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approvals"
              element={
                <ProtectedRoute>
                  <ApprovalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rejected"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <RejectedDocuments />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
