using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LegalMattersAPI.db;
using LegalMattersAPI.models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static LegalMattersAPI.Models.AuthModels;

namespace LegalMattersAPI
{
    public class ApiRouteBuilder
    {
        private readonly ApplicationDbContext _context;

        public ApiRouteBuilder(ApplicationDbContext context)
        {
            _context = context;
        }

        public static void BuildApiAuthRoutes(WebApplication app, ApplicationDbContext db)
        {
            //AUTH ROUTES
            // app.MapPost("/api/auth/register", async (RegisterRequest request, ApplicationDbContext context, IConfiguration config) =>
            // {
            //     if (await context.Users.AnyAsync(u => u.Email == request.Email))
            //     {
            //         return Results.BadRequest(new { message = "Email already exists" });
            //     }

            //     var user = new User
            //     {
            //         //UserId = Guid.NewGuid(),
            //         //Username = request.Name,
            //         Email = request.Email,
            //         PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            //     };

            //     context.Users.Add(user);
            //     await context.SaveChangesAsync();

            //     var token = GenerateJwtToken(user, config);

            //     return Results.Ok(new AuthResponse
            //     {
            //         Token = token,
            //         User = new UserDto
            //         {
            //             UserId = user.UserId.ToString(),
            //             Email = user.Email,
            //             Username = user.Username
            //         }
            //     });
            // }).WithName("CreateUser");

            // app.MapPost("/api/auth/login", async (LoginRequest request, ApplicationDbContext context, IConfiguration config) =>
            // {
            //     var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            //     if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            //     {
            //         return Results.Unauthorized();
            //     }

            //     var token = GenerateJwtToken(user, config);

            //     return Results.Ok(new AuthResponse
            //     {
            //         Token = token,
            //         User = new UserDto
            //         {
            //             UserId = user.UserId.ToString(),
            //             Email = user.Email,
            //             Username = user.Username
            //         }
            //     });
            // }).WithName("UserLogin");

            // app.MapGet("/api/auth/me", () =>
            // {

            // }).WithName("UserInfo");
        }
        public static void BuildApiCustomerRoutes(WebApplication app, ApplicationDbContext db)
        {
            //CUSTOMER ROUTES
            app.MapGet("/api/customers", () =>
            {
                return db.Customers.Any();

            }).WithName("GetCustomers");

            app.MapPost("/api/customers", async () =>
            {
                var customer = new Customer()
                {
                    Name = "Test",
                    PhoneNumber = "11111111111"
                };

                db.Customers.Add(customer);

                await db.SaveChangesAsync();

                return Results.Created($"/api/customers/{customer.CustomerId}", customer);

            }).WithName("CreateCustomer");

            app.MapGet("/api/customers/{customer_id}", (int customer_id) =>
            {
                return db.Customers.First(x => x.CustomerId == customer_id);

            }).WithName("GetCustomer");

            app.MapPut("/api/customers/{customer_id}", async (int customer_id, Customer customer) =>
            {
                db.Customers.Update(customer);

                await db.SaveChangesAsync();

                return Results.Ok();

            }).WithName("UpdateCustomer");

            app.MapDelete("/api/customers", async (int customer_id) =>
            {
                // if (await db.Customers.FindAsync(customer_id) is Customer customer)
                // {
                //     db.Customers.Remove(customer);
                //     await db.SaveChangesAsync();
                //     return Results.Ok(new TodoItemDTO(customer));
                // }

                var customer = db.Customers.First(x => x.CustomerId == customer_id);

                db.Customers.Remove(customer);

                await db.SaveChangesAsync();

                return Results.NoContent();

            }).WithName("DeleteCustomer");

            //MATTERS ROUTES


        }
        
        static string GenerateJwtToken(User user, IConfiguration config)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username)
            };
        
            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}