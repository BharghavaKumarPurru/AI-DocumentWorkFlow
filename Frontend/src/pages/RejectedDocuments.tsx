import React, { useEffect, useState } from 'react';
import { Document, DocumentCategory } from '../types/document';
import { apiService } from '../services/apiService';
import { FileText, FolderInput } from 'lucide-react';

const CATEGORIES: DocumentCategory[] = ['Finance', 'HR', 'IT', 'Management', 'Sales', 'Legal', 'Marketing'];

export function RejectedDocuments() {
  const [rejectedDocuments, setRejectedDocuments] = useState<Document[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, DocumentCategory[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRejectedDocuments = async () => {
      try {
        const docs = await apiService.fetchRejectedDocuments();
        setRejectedDocuments(docs);

        // Initialize selected categories with current document categories
        const initialCategories = docs.reduce(
          (acc, doc) => ({
            ...acc,
            [doc.id]: doc.category ? [doc.category] : [],
          }),
          {}
        );
        setSelectedCategories(initialCategories);
      } catch (err) {
        console.error('Error fetching rejected documents:', err);
        setError('Failed to fetch rejected documents. Please try again.');
      }
    };

    fetchRejectedDocuments();
  }, []);

  const handleCategoryToggle = (docId: string, category: DocumentCategory) => {
    setSelectedCategories((prev) => {
      const current = prev[docId] || [];
      const updated = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];
      return { ...prev, [docId]: updated };
    });
  };

  const handleReassign = async (docId: string) => {
    try {
      const categories = selectedCategories[docId];
      if (!categories.length) throw new Error('At least one category must be selected.');
      await apiService.reassignDocument(Number(docId), categories[0]); // API expects one category
      setRejectedDocuments((docs) => docs.filter((doc) => doc.id !== docId));
    } catch (err) {
      console.error('Error reassigning document:', err);
      setError('Failed to reassign document. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rejected Documents</h1>
        <div className="flex items-center text-sm text-gray-500">
          <FolderInput className="w-5 h-5 mr-2" />
          Admin Access Only
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-6">
        {rejectedDocuments.map((doc) => (
          <div key={doc.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-gray-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">{doc.name}</h2>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Current Category:</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {doc.category}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Reassign Category:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories[doc.id]?.includes(category)}
                      onChange={() => handleCategoryToggle(doc.id, category)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleReassign(doc.id)}
                disabled={!selectedCategories[doc.id]?.length}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Reassign Document
              </button>
            </div>
          </div>
        ))}

        {rejectedDocuments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FolderInput className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No rejected documents</h3>
            <p className="mt-1 text-sm text-gray-500">All documents have been properly categorized.</p>
          </div>
        )}
      </div>
    </div>
  );
}
