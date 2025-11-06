using Microsoft.OpenApi.Models;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);

// Swagger servisi ekle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Case Project API",
        Version = "v1",
        Description = "Mesaj kayıt ve test servisi"
    });
});

var app = builder.Build();

// Swagger UI aktif et (Development ortamında)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Geçici mesaj listesi (bellekte)
List<Message> messages = new();

// ✅ GET /api/messages — tüm mesajları getir
app.MapGet("/api/messages", () =>
{
    return Results.Ok(messages);
})
.WithName("GetMessages")
.WithOpenApi();

// ✅ POST /api/messages — mesaj ekle
app.MapPost("/api/messages", (Message newMessage) =>
{
    newMessage.Id = messages.Count + 1;
    newMessage.Timestamp = DateTime.UtcNow;
    messages.Add(newMessage);
    return Results.Created($"/api/messages/{newMessage.Id}", newMessage);
})
.WithName("AddMessage")
.WithOpenApi();

app.Run();

// ====== MODELLER ======
record Message
{
    public int Id { get; set; }
    public string? Text { get; set; }
    public DateTime Timestamp { get; set; }
}
