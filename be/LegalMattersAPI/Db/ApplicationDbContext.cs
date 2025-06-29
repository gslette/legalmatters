using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LegalMattersAPI.models;
using Microsoft.EntityFrameworkCore;

namespace LegalMattersAPI.db
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Customer> Customers { get; set; } = null!;
        public DbSet<Matter> Matters { get; set; } = null!;
    }
}