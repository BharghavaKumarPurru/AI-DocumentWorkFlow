using AI_DocumentWorkflow.Data;
using AI_DocumentWorkflow.AI;
using AI_DocumentWorkflow.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using System.Text;

namespace AI_DocumentWorkflow.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly DocumentWorkflowContext _context;
        private readonly TextAnalyticsService _textAnalyticsService;
        private readonly ILogger<DocumentsController> _logger;

        public DocumentsController(
            DocumentWorkflowContext context, 
            TextAnalyticsService textAnalyticsService, 
            ILogger<DocumentsController> logger)
        {
            _context = context;
            _textAnalyticsService = textAnalyticsService;
            _logger = logger;
        }

        #region Retrieve Documents

        // Get all documents with optional filtering and pagination
        [HttpGet]
        public async Task<IActionResult> GetDocuments(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null)
        {
            try
            {
                var query = _context.Documents.AsQueryable();

                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(d => d.Category == category);
                }

                var documents = await query
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching documents");
                return StatusCode(500, "An error occurred while fetching documents.");
            }
        }

        // Get a single document by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDocument(int id)
        {
            try
            {
                var document = await _context.Documents.FindAsync(id);

                if (document == null)
                {
                    return NotFound(new { message = "Document not found." });
                }

                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving document with ID {id}");
                return StatusCode(500, "An error occurred while retrieving the document.");
            }
        }

        // Get documents by role
        [HttpGet("getdocuments")]
        public async Task<IActionResult> GetDocumentsByRole([FromQuery] string? role = null)
        {
            try
            {
                var query = _context.Documents.AsQueryable();

                if (!string.IsNullOrEmpty(role) && role != "Admin")
                {
                    query = query.Where(d => d.Category.ToLower() == role.ToLower());
                }

                var documents = await query.ToListAsync();
                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching documents by role");
                return StatusCode(500, "An error occurred while fetching documents.");
            }
        }

        #endregion

        #region Upload Document

        // Upload a document and categorize it using AI
        [HttpPost("upload")]
        public async Task<IActionResult> UploadDocument([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "A valid file is required." });
            }

            try
            {
                string content;

                // Check if the file is a PDF
                if (file.ContentType == "application/pdf")
                {
                    // Extract text from the PDF
                    using var memoryStream = new MemoryStream();
                    await file.CopyToAsync(memoryStream);
                    memoryStream.Position = 0;

                    using var pdfReader = new PdfReader(memoryStream);
                    using var pdfDocument = new PdfDocument(pdfReader);

                    var textBuilder = new StringBuilder();

                    for (int page = 1; page <= pdfDocument.GetNumberOfPages(); page++)
                    {
                        textBuilder.Append(PdfTextExtractor.GetTextFromPage(pdfDocument.GetPage(page)));
                    }

                    content = textBuilder.ToString();
                }
                else
                {
                    // For non-PDF files, read as plain text
                    using var streamReader = new StreamReader(file.OpenReadStream());
                    content = await streamReader.ReadToEndAsync();
                }

                if (string.IsNullOrWhiteSpace(content))
                {
                    return BadRequest(new { message = "The file content is empty." });
                }

                // Summarize the document
                var summary = await _textAnalyticsService.AbstractiveSummarizeAsync(content);

                // Categorize the document
                var category = await _textAnalyticsService.CategorizeDocumentAsync(summary);

                // Save the document details
                var document = new Document
                {
                    Name = file.FileName,
                    Content = content,
                    Category = category,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Documents.Add(document);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Document uploaded successfully.", documentId = document.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document");
                return StatusCode(500, new { message = "An error occurred while processing the document." });
            }
        }




        #endregion

        #region Manage Documents

        // Update a document
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDocument(int id, [FromBody] Document updatedDocument)
        {
            try
            {
                var document = await _context.Documents.FindAsync(id);

                if (document == null)
                {
                    return NotFound(new { message = "Document not found." });
                }

                document.Name = updatedDocument.Name;
                document.Content = updatedDocument.Content;
                document.Category = updatedDocument.Category;
                document.Status = updatedDocument.Status;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating document");
                return StatusCode(500, "An error occurred while updating the document.");
            }
        }

        // Update document status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateDocumentStatus(int id, [FromBody] DocumentStatusUpdateRequest request)
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (string.IsNullOrEmpty(userRole))
                {
                    return Unauthorized(new { message = "User role not found in token." });
                }

                var document = await _context.Documents.FindAsync(id);

                if (document == null)
                {
                    return NotFound(new { message = "Document not found." });
                }

                if (userRole != "Admin" && document.Category != userRole)
                {
                    return Forbid();
                }

                document.Status = request.Status;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Document status updated successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating document status");
                return StatusCode(500, "An error occurred while updating the document status.");
            }
        }

        // Reassign document category
        [HttpPut("{id}/reassign")]
        public async Task<IActionResult> ReassignDocumentCategory(int id, [FromBody] ReassignCategoryRequest request)
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (userRole != "Admin")
                {
                    return Forbid();
                }

                var document = await _context.Documents.FindAsync(id);

                if (document == null)
                {
                    return NotFound(new { message = "Document not found." });
                }

                if (string.IsNullOrWhiteSpace(request.NewCategory))
                {
                    return BadRequest(new { message = "New category cannot be empty." });
                }

                document.Category = request.NewCategory;
                document.Status = "Pending"; // Reset to Pending for review

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reassigning document category");
                return StatusCode(500, new { message = "An error occurred while reassigning the document." });
            }
        }

        // DTO Class
        public class ReassignCategoryRequest
        {
            public required string NewCategory { get; set; }
        }

        #endregion

        #region Fetch Pending and Rejected Documents
        
        [HttpGet("rejected")]
        public async Task<IActionResult> GetRejectedDocuments()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (userRole != "Admin")
                {
                    return Forbid();
                }

                var rejectedDocs = await _context.Documents
                    .Where(d => d.Status == "Rejected")
                    .ToListAsync();

                return Ok(rejectedDocs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching rejected documents");
                return StatusCode(500, "An error occurred while fetching rejected documents.");
            }
        }



        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectDocumentWithFeedback(int id, [FromBody] DocumentFeedbackRequest request)
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                var document = await _context.Documents.FindAsync(id);
                if (document == null)
                {
                    return NotFound(new { message = "Document not found" });
                }

                if (userRole != "Admin" && document.Category != userRole)
                {
                    return Forbid();
                }

                document.Status = "Rejected";
                document.Feedback = request.Feedback;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Document rejected with feedback." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while rejecting the document: {ex.Message}");
            }
        }


        // Get pending documents
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingDocuments([FromQuery] string role)
        {
            try
            {
                var pendingDocs = await _context.Documents
                    .Where(d => d.Status == "Pending" && (role == "Admin" || d.Category == role))
                    .ToListAsync();

                return Ok(pendingDocs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching pending documents");
                return StatusCode(500, "An error occurred while fetching pending documents.");
            }
        }
        [HttpPut("{id}/feedback")]
        public async Task<IActionResult> AddFeedback(int id, [FromBody] DocumentFeedbackRequest request)
        {
            try
            {
                var document = await _context.Documents.FindAsync(id);

                if (document == null)
                {
                    return NotFound(new { message = "Document not found" });
                }

                document.Feedback = request.Feedback;

                await _context.SaveChangesAsync();

                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while adding feedback: {ex.Message}");
            }
        }

        public class DocumentFeedbackRequest
        {
            public string Feedback { get; set; }
        }


        // Get rejected documents
        

        #endregion

        public class DocumentStatusUpdateRequest
        {
            public required string Status { get; set; }
        }
    }
}
