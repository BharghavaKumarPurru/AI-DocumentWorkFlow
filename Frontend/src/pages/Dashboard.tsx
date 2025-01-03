import React, { useEffect, useState } from 'react';
import { UploadDocument } from '../components/UploadDocument';
import { DocumentStatus } from '../components/DocumentStatus';
import { apiService } from '../services/apiService';
import { Document } from '../types/document';

export function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Get the user role from localStorage or sessionStorage
  const userRole = localStorage.getItem('role') || sessionStorage.getItem('role');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (!userRole) {
          throw new Error('User role is not defined. Please log in again.');
        }

        // Fetch documents based on user role
        const docs = await apiService.getDocumentsByRole(userRole);
        console.log('Fetched documents:', docs); // Debugging log

        setDocuments(docs);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch documents. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [userRole]);

  if (loading) return <div>Loading documents...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Filter documents based on status
  const pendingDocs = documents.filter((doc) => doc.status === 'Pending');
  const approvedDocs = documents.filter((doc) => doc.status === 'Approved');

  return (
    <div className="space-y-8">
      {/* Display the Upload Document Component only for Admin users */}
      {userRole === 'Admin' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Upload New Document</h2>
          <UploadDocument />
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold">Pending Documents</h2>
        {pendingDocs.length > 0 ? (
          <DocumentStatus documents={pendingDocs} />
        ) : (
          <p className="text-gray-500">No pending documents found.</p>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold">Approved Documents</h2>
        {approvedDocs.length > 0 ? (
          <DocumentStatus documents={approvedDocs} />
        ) : (
          <p className="text-gray-500">No approved documents found.</p>
        )}
      </div>
    </div>
  );
}
