import { Document } from '../types/document';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5094/api';

// Function to validate the JWT token format
function isValidJWT(token: string | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  return parts.length === 3;
}

// Helper function to get and validate the token
function getToken(): string {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (!isValidJWT(token)) {
    throw new Error('Invalid or missing authentication token. Please log in again.');
  }
  return token!;
}

export const apiService = {
  async uploadDocument(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    return response.json();
  },

  async getDocuments(pageNumber = 1, pageSize = 10, category?: string): Promise<Document[]> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`${API_BASE_URL}/documents?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    return response.json();
  },

  async getDocumentsByRole(role: string | null): Promise<Document[]> {
    const response = await fetch(`${API_BASE_URL}/documents/getdocuments?role=${role}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch documents by role: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async login(username: string, password: string): Promise<{ token: string; role: string }> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role); // Save role to localStorage
    return data;
  },

  async fetchPendingDocuments(): Promise<Document[]> {
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');
    const response = await fetch(`${API_BASE_URL}/documents/pending?role=${role}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }

    return response.json();
  },

  async updateDocumentStatus(docId: number, status: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/${docId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update document status');
    }
  },

  async fetchRejectedDocuments(): Promise<Document[]> {
    const response = await fetch(`${API_BASE_URL}/documents/rejected`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rejected documents.');
    }

    return response.json();
  },

  async reassignDocument(docId: number, newCategory: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/${docId}/reassign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ newCategory }),
    });

    if (!response.ok) {
      throw new Error('Failed to reassign document.');
    }
  },

  async rejectDocumentWithFeedback(docId: number, feedback: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/${docId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ feedback }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject document with feedback.');
    }
  }, 
};
