using System.ComponentModel.DataAnnotations.Schema;

namespace LegalMattersAPI.Models
{
    public class User
    {
        public int UserId { get; set; }
        public int LawFirmId { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        [NotMapped]
        public string Password { get; set; }
        public required string PasswordHash { get; set; }
    }
}