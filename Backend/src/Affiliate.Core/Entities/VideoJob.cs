using System;

namespace Affiliate.Core.Entities;

public class VideoJob
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int ProductId { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Processing, Completed, Failed
    public string? ScriptContent { get; set; }
    public string? OutputVideoUrl { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    
    // Navigation property
    public Product Product { get; set; } = null!;
}
