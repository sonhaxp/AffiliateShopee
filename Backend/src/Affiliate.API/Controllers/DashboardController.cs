using Affiliate.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Affiliate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<ActionResult> GetDashboardStats()
    {
        var totalVideos = await _context.VideoJobs.CountAsync();
        var completedVideos = await _context.VideoJobs.CountAsync(j => j.Status == "Completed");
        var processingVideos = await _context.VideoJobs.CountAsync(j => j.Status == "Processing");
        var totalProducts = await _context.Products.CountAsync();

        return Ok(new
        {
            TotalVideos = totalVideos,
            CompletedVideos = completedVideos,
            ProcessingVideos = processingVideos,
            TotalProducts = totalProducts
        });
    }
}
