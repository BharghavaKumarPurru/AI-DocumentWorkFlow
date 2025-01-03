using System.Security.Cryptography;
using System.Text;
using AI_DocumentWorkflow.Data;
using AI_DocumentWorkflow.Models;

namespace AI_DocumentWorkflow.Test
{
    public static class DatabaseSeeder
    {
        /// <summary>
        /// Seeds the database with default user data if no users exist.
        /// </summary>
        /// <param name="context">The database context.</param>
        public static void SeedUsers(DocumentWorkflowContext context)
        {
            // Check if any users already exist
            if (!context.Users.Any())
            {
                // Add default users
                context.Users.AddRange(
                    new User
                    {
                        Username = "admin",
                        PasswordHash = HashPassword("password"),
                        Role = "Administrator"
                    },
                    new User
                    {
                        Username = "user1",
                        PasswordHash = HashPassword("userpassword"),
                        Role = "User"
                    }
                );

                // Save changes to the database
                context.SaveChanges();
            }
        }

        /// <summary>
        /// Hashes a password using SHA256.
        /// </summary>
        /// <param name="password">The plain-text password.</param>
        /// <returns>The hashed password as a Base64 string.</returns>
        private static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }
}
