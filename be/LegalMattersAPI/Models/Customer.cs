using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LegalMattersAPI.models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public required string Name { get; set; }
        public string? PhoneNumber { get; set; }
    }
}