using LegalMattersAPI.Models;

namespace LegalMattersAPI.Models
{
    public class AuthModels
    {
        public record LoginRequest(string Email, string Password);
        public record SignUpRequest(string Name, string Email, string Password);
        public record AuthResponse(string Token, UserDto User);
    }
}