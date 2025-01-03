import React, { useEffect, useState } from 'react';
import { Document } from '../types/document';
import { apiService } from '../services/apiService';
import { FileText } from 'lucide-react';

export function ApprovalPage() {
  const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [currentDocId, setCurrentDocId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const role = localStorage.getItem('role') || sessionStorage.getItem('role');
        if (!role) throw new Error('User role is not defined. Please log in again.');
        setUserRole(role);

        const docs = await apiService.fetchPendingDocuments();
        const filteredDocs = role === 'Admin' ? docs : docs.filter((doc) => String(doc.category) === role);

        setPendingDocuments(filteredDocs);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Failed to fetch documents. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleApproval = async (docId: number) => {
    try {
      await apiService.updateDocumentStatus(docId, 'Approved');
      setPendingDocuments((docs) => docs.filter((doc) => Number(doc.id) !== docId));
    } catch (error) {
      console.error('Error updating document status:', error);
      setError('Failed to approve the document. Please try again.');
    }
  };

  const handleReject = (docId: number) => {
    setCurrentDocId(docId);
    setFeedbackModalOpen(true);
  };

  const submitFeedback = async () => {
    if (!currentDocId) return;

    try {
      await apiService.rejectDocumentWithFeedback(currentDocId, feedback);
      setPendingDocuments((docs) => docs.filter((doc) => Number(doc.id) !== currentDocId));
      alert('Document rejected with feedback.');
    } catch (error) {
      console.error('Failed to reject document with feedback:', error);
      setError('Failed to reject document. Please try again.');
    } finally {
      setFeedback('');
      setFeedbackModalOpen(false);
    }
  };

  if (loading) {
    return <div>Loading pending documents...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pending Approvals</h1>
      {userRole && (
        <h2 className="text-xl text-gray-700 mb-6">
          Viewing approvals for role: <span className="font-semibold">{userRole}</span>
        </h2>
      )}
      <div className="space-y-6">
        {pendingDocuments.length > 0 ? (
          pendingDocuments.map((doc) => (
            <div key={doc.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-gray-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">{doc.name}</h2>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">{doc.content}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {doc.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleApproval(Number(doc.id))}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(Number(doc.id))}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No pending documents to approve.</p>
        )}
      </div>

      {isFeedbackModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Provide Feedback</h2>
            <textarea
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Enter feedback for rejection"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setFeedback('');
                  setFeedbackModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={submitFeedback}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
