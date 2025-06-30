using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LegalMattersAPI.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData("Customers", new string[] { "CustomerId", "Name", "PhoneNumber" }, new object[,] {
                { "1", "Gunnar Slette", "3202235976"},
                { "2", "Joanne Wright", "3202239393" },
                { "3", "Leonard Avery", "6124034423" },
            });
            
            migrationBuilder.InsertData("Matters", new string[] { "MatterId", "CustomerId", "Name", "Description" }, new object[, ] {
                { "1", "1", "Slette vs. Minnesota State", "Civil"},
                { "2", "1", "Slette vs. 3M", "Criminal" },
                { "3", "1", "Slette vs. Best Buy", "Civil" },
            });
        }
    }
}
