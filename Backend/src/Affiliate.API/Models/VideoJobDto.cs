namespace Affiliate.API.Models;

public class VideoJobDto
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? OutputVideoUrl { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    // Thông tin sản phẩm rút gọn
    public string ProductName { get; set; } = string.Empty;
    public string? ProductThumbnail { get; set; }
    public string ProductUrl { get; set; } = string.Empty;
}
