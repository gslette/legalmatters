using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LegalMattersAPI.models;

namespace LegalMattersAPI.Models
{
    public class AuthModels
    {
        public record LoginRequest(string Email, string Password);
        public record SignUpRequest(string Name, string Email, string Password);
        public record AuthResponse(string Token, UserDto User);
        //public record UserDto(string UserId, string Email, string Username);
    }
}