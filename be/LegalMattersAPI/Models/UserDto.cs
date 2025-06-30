namespace LegalMattersAPI.Models
{
    public class UserDto
    {
        public int UserId { get; set; }
        public int LawFirmId { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
    }
}