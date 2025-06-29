using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LegalMattersAPI.models
{
    public class User
    {
        public int UserId { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FirmName { get; set; }
    }
}