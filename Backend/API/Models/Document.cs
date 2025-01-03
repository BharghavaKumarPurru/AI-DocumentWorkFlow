using System;
using System.ComponentModel.DataAnnotations;

namespace AI_DocumentWorkflow.Models
{
    public class Document
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Content is required.")]
        public string Content { get; set; }

        // Make 'Category' optional since it's populated by AI
        public string Category { get; set; } = "Uncategorized";

        // Make 'Status' optional with a default value  
        public string Status { get; set; } = "Pending";

        public string Feedback { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
