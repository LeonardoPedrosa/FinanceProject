using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface IUserConnectionRepository : IRepository<UserConnection>
    {
        Task<UserConnection?> GetAsync(Guid sharerId, Guid receiverId);
        Task<Guid?> GetPartnerIdAsync(Guid userId);
        Task<UserConnection?> GetConnectionByUserIdAsync(Guid userId);
    }
}
