using NascodeCMS;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text; 
using NascodeCMS.Classes; 
using NascodeCMS.Server.Models;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using NascodeCMS.Server.Middleware;
using NascodeCMS.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSession();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<FileUploadHelper>();
builder.Services.AddScoped<PropertyHelper>();
builder.Services.AddSingleton<ErrorLog>();
builder.Services.AddScoped<AuditLog>();

//add memory cache 
builder.Services.AddMemoryCache();

builder.Services.AddCors(options =>
{
    //c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    options.AddPolicy("AllowSpecificOrigin",
            builder => builder.WithOrigins("https://localhost:4200")
                              .AllowAnyMethod()
                              .AllowAnyHeader()
                              .AllowCredentials());
});

IConfiguration config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json") 
    .Build();

//jwt authentication------------------
builder.Services.AddSession();
builder.Services.AddTransient<ITokenService, TokenService>();
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    
    var Key = Encoding.UTF8.GetBytes(config["JWT:Key"]);
    o.SaveToken = true;
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = config["JWT:Issuer"],
        ValidAudience = config["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Key)
    };
});

var app = builder.Build();


app.UseDefaultFiles();
app.UseStaticFiles();


app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "DynamicImages")),
    RequestPath = new PathString("/DynamicImages")
});



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
//app.UseCors("AllowOrigin");
app.UseCors("AllowSpecificOrigin");

app.MapControllers();

app.MapFallbackToFile("/index.html");
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<JwtTokenValidationMiddleware>();


app.Run();
