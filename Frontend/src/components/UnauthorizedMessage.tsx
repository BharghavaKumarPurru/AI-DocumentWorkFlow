import React from 'react';
import { Ban } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UnauthorizedMessage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Ban className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}