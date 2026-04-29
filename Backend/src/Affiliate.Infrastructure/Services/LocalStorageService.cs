using Affiliate.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Affiliate.Infrastructure.Services;

public class LocalStorageService : IStorageService
{
    private readonly string _uploadDirectory;

    public LocalStorageService(IConfiguration configuration)
    {
        _uploadDirectory = configuration["Storage:UploadDirectory"] ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(_uploadDirectory))
        {
            Directory.CreateDirectory(_uploadDirectory);
        }
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default)
    {
        var filePath = Path.Combine(_uploadDirectory, fileName);
        using var fileStreamToSave = new FileStream(filePath, FileMode.Create, FileAccess.Write);
        await fileStream.CopyToAsync(fileStreamToSave, cancellationToken);
        
        return $"/uploads/{fileName}";
    }

    public Task<Stream> GetFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        var fileName = Path.GetFileName(fileUrl);
        var filePath = Path.Combine(_uploadDirectory, fileName);
        if (!File.Exists(filePath))
            throw new FileNotFoundException("File not found locally.", filePath);

        return Task.FromResult((Stream)new FileStream(filePath, FileMode.Open, FileAccess.Read));
    }
}
