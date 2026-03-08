using System.Security.Claims;
using FinanceApp.Api.Data.Interfaces;
using FinanceApp.Api.DTOs;
using FinanceApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/user-connections")]
    public class UserConnectionsController : ControllerBase
    {
        private readonly IUserConnectionRepository _connectionRepository;
        private readonly IUserRepository _userRepository;

        public UserConnectionsController(
            IUserConnectionRepository connectionRepository,
            IUserRepository userRepository)
        {
            _connectionRepository = connectionRepository;
            _userRepository = userRepository;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("as-sharer")]
        public async Task<ActionResult<IEnumerable<UserConnectionResponseDto>>> GetAsSharer()
        {
            var userId = GetUserId();
            var connections = await _connectionRepository.GetBySharerIdAsync(userId);
            return Ok(connections.Select(MapToDto));
        }

        [HttpGet("as-receiver")]
        public async Task<ActionResult<IEnumerable<UserConnectionResponseDto>>> GetAsReceiver()
        {
            var userId = GetUserId();
            var connections = await _connectionRepository.GetByReceiverIdAsync(userId);
            return Ok(connections.Select(MapToDto));
        }

        [HttpPost]
        public async Task<ActionResult<UserConnectionResponseDto>> Create([FromBody] CreateUserConnectionDto dto)
        {
            var userId = GetUserId();

            var receiver = await _userRepository.GetByEmailAsync(dto.ReceiverEmail);
            if (receiver == null)
                return NotFound(new { message = "User not found with that email." });

            if (receiver.Id == userId)
                return BadRequest(new { message = "You cannot connect with yourself." });

            var existing = await _connectionRepository.GetAsync(userId, receiver.Id);
            if (existing != null)
                return Conflict(new { message = "Connection already exists." });

            var connection = new UserConnection
            {
                SharerId = userId,
                ReceiverId = receiver.Id
            };

            await _connectionRepository.AddAsync(connection);
            await _connectionRepository.SaveChangesAsync();

            // Re-fetch with navigation properties
            var created = await _connectionRepository.GetAsync(userId, receiver.Id);
            var sharer = await _userRepository.GetByIdAsync(userId);

            return Ok(new UserConnectionResponseDto
            {
                Id = connection.Id,
                SharerId = userId,
                SharerName = sharer?.Name ?? string.Empty,
                SharerEmail = sharer?.Email ?? string.Empty,
                ReceiverId = receiver.Id,
                ReceiverName = receiver.Name,
                ReceiverEmail = receiver.Email,
                CreatedAt = connection.CreatedAt
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetUserId();

            var connection = await _connectionRepository.GetByIdAsync(id);
            if (connection == null)
                return NotFound();

            if (connection.SharerId != userId)
                return Forbid();

            _connectionRepository.Delete(connection);
            await _connectionRepository.SaveChangesAsync();

            return NoContent();
        }

        private static UserConnectionResponseDto MapToDto(UserConnection uc) => new()
        {
            Id = uc.Id,
            SharerId = uc.SharerId,
            SharerName = uc.Sharer?.Name ?? string.Empty,
            SharerEmail = uc.Sharer?.Email ?? string.Empty,
            ReceiverId = uc.ReceiverId,
            ReceiverName = uc.Receiver?.Name ?? string.Empty,
            ReceiverEmail = uc.Receiver?.Email ?? string.Empty,
            CreatedAt = uc.CreatedAt
        };
    }
}
