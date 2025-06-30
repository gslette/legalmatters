namespace LegalMattersAPI.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public required string Name { get; set; }
        public string PhoneNumber { get; set; }
    }
}