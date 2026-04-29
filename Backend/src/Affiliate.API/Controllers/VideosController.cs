using Affiliate.API.Models;
using Affiliate.Core.Entities;
using Affiliate.Core.Interfaces;
using Affiliate.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Affiliate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VideosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IQueueService _queueService;

    public VideosController(AppDbContext context, IQueueService queueService)
    {
        _context = context;
        _queueService = queueService;
    }

    [HttpPost("generate")]
    public async Task<ActionResult> GenerateVideo(GenerateRequest request)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.AffiliateUrl == request.ProductLink);
        if (product == null)
        {
            product = new Product
            {
                Name = "Đang phân tích...",
                AffiliateUrl = request.ProductLink,
                Sku = "SKU-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                CreatedAt = DateTime.UtcNow
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        var videoJob = new VideoJob
        {
            Id = Guid.NewGuid(),
            ProductId = product.Id,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.VideoJobs.Add(videoJob);
        await _context.SaveChangesAsync();

        await _queueService.EnqueueAsync(videoJob);

        return Ok(new { Message = "Job created", Data = videoJob });
    }

    [HttpGet("status/{id}")]
    public async Task<ActionResult<VideoJobDto>> GetVideoStatus(Guid id)
    {
        var job = await _context.VideoJobs
            .Include(j => j.Product)
            .Where(j => j.Id == id)
            .Select(j => new VideoJobDto
            {
                Id = j.Id,
                Status = j.Status,
                OutputVideoUrl = j.OutputVideoUrl,
                ErrorMessage = j.ErrorMessage,
                CreatedAt = j.CreatedAt,
                CompletedAt = j.CompletedAt,
                ProductName = j.Product.Name,
                ProductThumbnail = j.Product.ThumbnailUrl,
                ProductUrl = j.Product.AffiliateUrl
            })
            .FirstOrDefaultAsync();

        if (job == null) return NotFound();
        return Ok(job);
    }

    [HttpGet("library")]
    public async Task<ActionResult<IEnumerable<VideoJobDto>>> GetVideoLibrary()
    {
        return await _context.VideoJobs
            .Include(j => j.Product)
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new VideoJobDto
            {
                Id = j.Id,
                Status = j.Status,
                OutputVideoUrl = j.OutputVideoUrl,
                ErrorMessage = j.ErrorMessage,
                CreatedAt = j.CreatedAt,
                CompletedAt = j.CompletedAt,
                ProductName = j.Product.Name,
                ProductThumbnail = j.Product.ThumbnailUrl,
                ProductUrl = j.Product.AffiliateUrl
            })
            .ToListAsync();
    }

    [HttpGet("pending")]
    public async Task<ActionResult<VideoJobDto>> GetPendingVideoJob()
    {
        var job = await _queueService.DequeueAsync<VideoJob>();
        if (job == null) return NotFound(new { Message = "Queue empty" });

        var jobInDb = await _context.VideoJobs
            .Include(j => j.Product)
            .FirstOrDefaultAsync(j => j.Id == job.Id);
            
        if (jobInDb != null)
        {
            jobInDb.Status = "Processing";
            await _context.SaveChangesAsync();
            
            return Ok(new VideoJobDto
            {
                Id = jobInDb.Id,
                Status = jobInDb.Status,
                OutputVideoUrl = jobInDb.OutputVideoUrl,
                ErrorMessage = jobInDb.ErrorMessage,
                CreatedAt = jobInDb.CreatedAt,
                CompletedAt = jobInDb.CompletedAt,
                ProductName = jobInDb.Product.Name,
                ProductThumbnail = jobInDb.Product.ThumbnailUrl,
                ProductUrl = jobInDb.Product.AffiliateUrl
            });
        }
        
        return NotFound();
    }

    [HttpPost("complete")]
    public async Task<ActionResult> CompleteVideoJob(CompleteRequest request)
    {
        var job = await _context.VideoJobs.FindAsync(request.JobId);
        if (job == null) return NotFound();

        job.Status = "Completed";
        job.OutputVideoUrl = request.VideoUrl;
        job.CompletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { Message = "Updated" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVideo(Guid id)
    {
        var job = await _context.VideoJobs.FindAsync(id);
        if (job == null) return NotFound();

        _context.VideoJobs.Remove(job);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("requeue/{id}")]
    public async Task<IActionResult> RequeueVideo(Guid id)
    {
        var job = await _context.VideoJobs.FindAsync(id);
        if (job == null) return NotFound();

        job.Status = "Pending";
        job.CreatedAt = DateTime.UtcNow;
        job.CompletedAt = null;
        job.ErrorMessage = null;
        
        await _context.SaveChangesAsync();
        await _queueService.EnqueueAsync(job);
        
        return Ok(new { Message = "Job has been requeued" });
    }
}
