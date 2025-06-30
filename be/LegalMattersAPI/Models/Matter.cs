namespace LegalMattersAPI.Models
{
    public class Matter
    {
        public int MatterId { get; set; }
        public int CustomerId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
    }
}