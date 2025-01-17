
## Document Management System

## Overview
The **Document Management System** is a full-stack application designed to streamline document workflows using AI-powered categorization and automated processing. This system enables admins to upload documents, which are then analyzed and routed to the appropriate departments (e.g., HR, Finance, IT) for review. Team members can approve or reject documents with feedback, ensuring seamless collaboration and efficient document handling.
## Demo
https://github.com/user-attachments/assets/16f3a270-6289-4535-843b-99a91ec52e12

## Features
- Upload and process documents in various formats (PDF, DOCX, TXT).
- AI-powered categorization of documents based on their content.
- Automatic routing of documents to relevant departments (e.g., HR, Finance, Management).
- Approval/rejection workflow with feedback options for team members.
- Reassignment of rejected documents for further review.
- User-friendly interface with role-based access control for Admin and Team Members.

## Technologies Used
- **React.js**: Frontend framework for building a responsive user interface.
- **TypeScript**: Ensures robust type checking and code quality.
- **.NET Core**: Backend framework for API development and business logic.
- **SQL Server**: Relational database for secure data storage and retrieval.
- **Azure AI Services**: For abstractive summarization and document categorization.
- **iTextSharp**: For extracting text from PDF documents.

## Setup Instructions

### Prerequisites
- Node.js
- .NET SDK
- SQL Server
- Azure account for AI services

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/DocumentManagementSystem.git
   cd DocumentManagementSystem/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd ../backend
   ```

2. Restore .NET packages:
   ```bash
   dotnet restore
   ```

3. Run the backend server:
   ```bash
   dotnet run
   ```

4. Ensure your SQL Server is running and update the connection string in `appsettings.json`.

### Database Setup
1. Run the migrations to set up the database:
   ```bash
   dotnet ef database update
   ```

### Azure AI Services Setup
1. Create an Azure Text Analytics resource.
2. Update the Azure endpoint and API key in the backend configuration.

## How It Works
1. Admin uploads a document via the frontend interface.
2. The backend extracts content from the document and generates an abstractive summary using Azure AI.
3. The summarized content is categorized into a specific department based on keywords.
4. Team members review the document, approve or reject it, and provide feedback if needed.
5. Rejected documents are sent back to the admin for reassignment.

## Contributions
Feel free to contribute by:
- Reporting issues or suggesting features.
- Submitting pull requests for improvements.

## License
This project is licensed under the MIT License.

---

### Key Topics Covered:
- AI-powered document categorization.
- Integration of Azure AI services for summarization.
- Role-based access control and approval workflows.
- Full-stack development using React.js, TypeScript, .NET Core, and SQL Server.
