using Microsoft.EntityFrameworkCore;
using AI_DocumentWorkflow.Models;


namespace AI_DocumentWorkflow.Data
{
    public class DocumentWorkflowContext : DbContext
    {
        public DocumentWorkflowContext(DbContextOptions<DocumentWorkflowContext> options) : base(options)
        {
        }

        public required DbSet<Document> Documents { get; set; }
        public required DbSet<User> Users { get; set; }
    }

}
