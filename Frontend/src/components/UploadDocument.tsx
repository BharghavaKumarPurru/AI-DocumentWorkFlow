import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { apiService } from '../services/apiService';

export function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [responseCategory, setResponseCategory] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('');
      setResponseCategory(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file first!');
      return;
    }

    setUploading(true);
    try {
      // Call the API service with the selected file
      const response = await apiService.uploadDocument(file);

      // Ensure category is displayed as a string
      const categoryString =
        Array.isArray(response.category) ? response.category.join(', ') : response.category;

      setUploadStatus('Document uploaded successfully!');
      setResponseCategory(categoryString);
      setFile(null);
    } catch (error) {
      setUploadStatus('Error uploading file! Please try again.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Document</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOCX, or TXT (MAX. 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
            />
          </label>
        </div>

        {file && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-500">{file.name}</span>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        )}

        {uploadStatus && (
          <div
            className={`p-4 rounded-md ${
              uploadStatus.includes('Error')
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            {uploadStatus}
            {responseCategory && (
              <p className="mt-2 text-sm text-gray-700">
                Categorized as: <span className="font-bold">{responseCategory}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
