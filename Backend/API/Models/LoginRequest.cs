using System.ComponentModel.DataAnnotations;

namespace AI_DocumentWorkflow.Models
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}