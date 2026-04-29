using Affiliate.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Affiliate.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<VideoJob> VideoJobs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuration for constraints/relations
        modelBuilder.Entity<Product>().HasKey(p => p.Id);
        modelBuilder.Entity<VideoJob>().HasKey(v => v.Id);
        
        modelBuilder.Entity<VideoJob>()
            .HasOne(v => v.Product)
            .WithMany(p => p.VideoJobs)
            .HasForeignKey(v => v.ProductId);
    }
}
