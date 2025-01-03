export type DocumentStatus = 'Pending' | 'Approved' | 'Rejected';
export type DocumentCategory = 'HR' | 'Finance' | 'IT' | 'Sales' | 'Marketing' | 'Legal' | 'Management' | 'Admin';
  
export interface Document {
  id: string;
  name: string;
  feedback: string;
  content: string;
  category: DocumentCategory[];
  status: DocumentStatus;
  createdAt: string;
  summary?: string;
}