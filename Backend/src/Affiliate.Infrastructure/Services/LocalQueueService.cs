using Affiliate.Core.Interfaces;
using System.Threading.Channels;

namespace Affiliate.Infrastructure.Services;

public class LocalQueueService : IQueueService
{
    private readonly Channel<object> _channel;

    public LocalQueueService()
    {
        _channel = Channel.CreateUnbounded<object>();
    }

    public async Task EnqueueAsync<T>(T item, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(item);
        await _channel.Writer.WriteAsync(item, cancellationToken);
    }

    public async Task<T?> DequeueAsync<T>(CancellationToken cancellationToken = default) where T : class
    {
        if (_channel.Reader.TryRead(out var item))
        {
            return item as T;
        }
        return null;
    }

    public ChannelReader<object> GetReader() => _channel.Reader;
}
