import React from 'react';
import { Document } from '../types/document';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Q4_Financial_Report.pdf',
    content: 'Financial report content...',
    category: ['Finance'],
    status: 'Pending',
    createdAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sales_Forecast_2024.docx',
    content: 'Sales forecast content...',
    category: ['Sales'],
    status: 'Approved',
    createdAt: '2024-03-14T15:30:00Z'
  }
];

const statusIcons = {
  Pending: <Clock className="w-5 h-5 text-yellow-500" />,
  Approved: <CheckCircle className="w-5 h-5 text-green-500" />,
  Rejected: <XCircle className="w-5 h-5 text-red-500" />
};

export function DocumentList() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Documents</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">
                        {doc.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      {doc.category.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {statusIcons[doc.status]}
                      <span className="ml-2 text-sm text-gray-500">
                        {doc.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}