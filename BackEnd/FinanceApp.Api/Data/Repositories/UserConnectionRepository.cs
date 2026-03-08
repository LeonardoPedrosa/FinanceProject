using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Data.Repositories
{
    public class UserConnectionRepository : Repository<UserConnection>, IUserConnectionRepository
    {
        public UserConnectionRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<UserConnection>> GetBySharerIdAsync(Guid sharerId)
        {
            return await _dbSet
                .Where(uc => uc.SharerId == sharerId)
                .Include(uc => uc.Receiver)
                .OrderBy(uc => uc.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserConnection>> GetByReceiverIdAsync(Guid receiverId)
        {
            return await _dbSet
                .Where(uc => uc.ReceiverId == receiverId)
                .Include(uc => uc.Sharer)
                .OrderBy(uc => uc.CreatedAt)
                .ToListAsync();
        }

        public async Task<UserConnection?> GetAsync(Guid sharerId, Guid receiverId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(uc => uc.SharerId == sharerId && uc.ReceiverId == receiverId);
        }

        public async Task<Guid?> GetPartnerIdAsync(Guid userId)
        {
            var connection = await _dbSet
                .FirstOrDefaultAsync(uc => uc.SharerId == userId || uc.ReceiverId == userId);
            if (connection == null) return null;
            return connection.SharerId == userId ? connection.ReceiverId : connection.SharerId;
        }

        public async Task<UserConnection?> GetConnectionByUserIdAsync(Guid userId)
        {
            return await _dbSet
                .Include(uc => uc.Sharer)
                .Include(uc => uc.Receiver)
                .FirstOrDefaultAsync(uc => uc.SharerId == userId || uc.ReceiverId == userId);
        }
    }
}
