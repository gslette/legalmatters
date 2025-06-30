namespace LegalMattersAPI.Models
{
    public class LawFirm
    {
        public int LawFirmId { get; set; }
        public int AccountManagerUserId { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Address { get; set; }
        public required string City { get; set; }
        public required string State { get; set; }
        public required string Zip { get; set; }
    }
}