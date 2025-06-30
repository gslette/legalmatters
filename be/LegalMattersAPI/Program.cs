using System.Text;
using LegalMattersAPI;
using LegalMattersAPI.db;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Routing.Matching;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
                      policy  =>
                      {
                          policy.AllowAnyOrigin();
                          policy.AllowAnyHeader();
                          policy.AllowAnyOrigin();
                        //   policy.WithOrigins("http://localhost:5173", "http://localhost:5001");
                      });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//       .AddJwtBearer(options => {
//           options.TokenValidationParameters = new TokenValidationParameters
//           {
//               ValidateIssuer = true,
//               ValidateAudience = true,
//               ValidateLifetime = true,
//               ValidIssuer = builder.Configuration["Jwt:Issuer"],
//               ValidAudience = builder.Configuration["Jwt:Audience"],
//               IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
//           };
//       });

// app.UseAuthentication();
// app.UseAuthorization();

await using var scope = app.Services.CreateAsyncScope();
var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
//var canConnect = await db.Database.CanConnectAsync();

ApiRouteBuilder.BuildApiAuthRoutes(app, db);
ApiRouteBuilder.BuildApiCustomerRoutes(app, db);

//app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");

app.Run();