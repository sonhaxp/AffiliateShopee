namespace Affiliate.Core.Interfaces;

public interface IQueueService
{
    Task EnqueueAsync<T>(T item, CancellationToken cancellationToken = default);
    Task<T?> DequeueAsync<T>(CancellationToken cancellationToken = default) where T : class;
}
