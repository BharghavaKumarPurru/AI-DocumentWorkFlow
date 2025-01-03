using System.ComponentModel.DataAnnotations;

namespace AI_DocumentWorkflow.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; } // Store hashed passwords

        public string Role { get; set; } = "User"; // Default role
    }
}
