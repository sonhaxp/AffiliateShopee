namespace Affiliate.API.Models;

public record GenerateRequest(string ProductLink);
public record CompleteRequest(Guid JobId, string VideoUrl);
