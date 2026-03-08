using FinanceApp.Api.Models;

namespace FinanceApp.Api.Data.Interfaces
{
    public interface IUserConnectionRepository : IRepository<UserConnection>
    {
        Task<IEnumerable<UserConnection>> GetBySharerIdAsync(Guid sharerId);
        Task<IEnumerable<UserConnection>> GetByReceiverIdAsync(Guid receiverId);
        Task<UserConnection?> GetAsync(Guid sharerId, Guid receiverId);
    }
}
