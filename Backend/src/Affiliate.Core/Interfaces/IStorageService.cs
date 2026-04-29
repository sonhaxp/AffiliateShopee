namespace Affiliate.Core.Interfaces;

public interface IStorageService
{
    Task<string> SaveFileAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default);
    Task<Stream> GetFileAsync(string fileUrl, CancellationToken cancellationToken = default);
}
