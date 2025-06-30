using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LegalMattersAPI.db;
using LegalMattersAPI.Models;
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
            // AUTH ROUTES
            app.MapPost("/api/auth/register", async (Models.AuthModels.SignUpRequest request, ApplicationDbContext context, IConfiguration config) =>
            {
                if (await context.Users.AnyAsync(u => u.Email == request.Email))
                {
                    return Results.BadRequest(new { message = "Email already exists" });
                }

                var user = new User
                {
                    Username = request.Name,
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
                };

                context.Users.Add(user);
                await context.SaveChangesAsync();

                var token = GenerateJwtToken(user, config);

                var response = new AuthResponse(token, new UserDto
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    Username = user.Username
                });

                return Results.Ok(response);
            }).WithName("CreateUser");

            app.MapPost("/api/auth/login", async (Models.AuthModels.LoginRequest request, ApplicationDbContext context, IConfiguration config) =>
            {
                var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return Results.Unauthorized();
                }

                var token = GenerateJwtToken(user, config);

                var response = new AuthResponse(token, new UserDto
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    Username = user.Username
                });

                return Results.Ok(response);
            }).WithName("UserLogin");

            app.MapGet("/api/auth/me", () =>
            {
                return Results.Ok("User info endpoint - not implemented");
            }).WithName("UserInfo");
        }
        public static void BuildApiCustomerRoutes(WebApplication app, ApplicationDbContext db)
        {
            // CUSTOMER ROUTES
            app.MapGet("/api/customers", () =>
            {
                var customers = db.Customers.ToList();

                return customers;

            }).WithName("GetCustomers");

            app.MapPost("/api/customers", (Customer customer) =>
            {

                db.Customers.Add(customer);

                db.SaveChanges();

                return Results.Created($"/api/customers/{customer.CustomerId}", customer);

            }).WithName("CreateCustomer");

            app.MapGet("/api/customers/{customer_id}", (int customer_id) =>
            {
                return db.Customers.First(x => x.CustomerId == customer_id);

            }).WithName("GetCustomer");

            app.MapPut("/api/customers/{customer_id}", (int customer_id, Customer customer) =>
            {
                db.Customers.Update(customer);

                db.SaveChanges();

                return Results.Ok();

            }).WithName("UpdateCustomer");

            app.MapDelete("/api/customers/{customer_id}", (int customer_id) =>
            {
                if (db.Customers.Find(customer_id) is Customer customer)
                {
                    db.Customers.Remove(customer);
                    db.SaveChanges();
                    return Results.Ok(customer);
                }


                return Results.NoContent();

            }).WithName("DeleteCustomer");

            // MATTERS ROUTES
            app.MapGet("/api/customers/{customer_id}/matters", (int customer_id) =>
            {
                var matters = db.Matters.ToList();

                return matters;

            }).WithName("GetCustomerMatters");

            app.MapPost("/api/customers/{customer_id}/matters", (int customer_id, Matter matter) =>
            {

                db.Matters.Add(matter);

                db.SaveChanges();

                return Results.Created($"/api/customers/{customer_id}/matters", matter);

            }).WithName("CreateMatter");

            app.MapGet("/api/customers/{customer_id}/matters/matter_id", (int customer_id, int matter_id) =>
            {
                return db.Matters.First(x => x.CustomerId == customer_id && x.MatterId == matter_id);

            }).WithName("GetCustomerMatterDetails");

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