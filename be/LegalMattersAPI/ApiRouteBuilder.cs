using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using LegalMattersAPI.db;
using LegalMattersAPI.models;
using Microsoft.EntityFrameworkCore;

namespace LegalMattersAPI
{
    public class ApiRouteBuilder
    {
        private readonly ApplicationDbContext _context;

        public ApiRouteBuilder(ApplicationDbContext context)
        {
            _context = context;
        }
        public static void ConfigureApiRoutes(WebApplication app, ApplicationDbContext db)
        {           
            //AUTH ROUTES
            // app.MapPost("/api/auth/signup", () =>
            // {
                
            // }).WithName("CreateUser");

            // app.MapPost("/api/auth/login", () =>
            // {

            // }).WithName("UserLogin");

            // app.MapGet("/api/auth/me", () =>
            // {

            // }).WithName("UserInfo");

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
    }
}