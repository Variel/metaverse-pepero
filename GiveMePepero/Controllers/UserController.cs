using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using GiveMePepero.Models;
using GiveMePepero.Models.Request;
using GiveMePepero.Models.Response;
using GiveMePepero.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GiveMePepero.Controllers
{
    [Route("api/users/{userId}")]
    public class UserController : Controller
    {
        private string LogonUserId => User.FindFirstValue(ClaimTypes.NameIdentifier);
        private readonly DatabaseContext _database;

        public UserController(DatabaseContext database)
        {
            _database = database;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile(string userId)
        {
            if (userId == "me")
            {
                if (LogonUserId == null)
                {
                    return Unauthorized();
                }

                userId = LogonUserId;
            }

            var user = await _database.Users.FindAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(new UserResponseModel
            {
                Id = user.Id,
                Name = user.Name,
                ProfilePicture = user.ProfilePicture
            });
        }

        [HttpGet("peperos")]
        public async Task<ActionResult<IEnumerable<PeperoResponseModel>>> GetPeperos(string userId)
        {
            if (userId == "me")
            {
                if (LogonUserId == null)
                {
                    return Unauthorized();
                }

                userId = LogonUserId;
            }

            if (!await _database.Users.AnyAsync(u => u.Id == userId))
                return NotFound();

            var peperos = await _database.Peperos
                .Where(p => p.ReceiverId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToArrayAsync();
            
            if (LogonUserId != userId)
            {
                foreach (var pepero in peperos)
                {
                    if (pepero.IsPrivate)
                    {
                        pepero.Message = null;
                    }
                }
            }

            return Ok(peperos.Select(p => new PeperoResponseModel
            {
                Id = p.Id,
                GiverName = p.GiverName,
                IsPrivate = p.IsPrivate,
                Message = p.Message,
                PackageImage = p.PackageImage,
                PeperoImage = p.PeperoImage,
                CreatedAt = p.CreatedAt
            }));
        }

        [HttpPost("peperos")]
        public async Task<IActionResult> GivePepero(string userId, [FromBody] PostPeperoRequestModel model)
        {
            if (!await _database.Users.AnyAsync(u => u.Id == userId))
                return NotFound();

            var pepero = new Pepero
            {
                GiverName = model.GiverName,
                IsPrivate = model.IsPrivate,
                Message = model.Message,
                PackageImage = model.PackageImage,
                PeperoImage = model.PeperoImage,
                GiverId = LogonUserId,
                ReceiverId = userId
            };

            _database.Peperos.Add(pepero);
            await _database.SaveChangesAsync();

            return Ok(new PeperoResponseModel
            {
                Id = pepero.Id,
                GiverName = pepero.GiverName,
                IsPrivate = pepero.IsPrivate,
                Message = pepero.Message,
                PackageImage = pepero.PackageImage,
                PeperoImage = pepero.PeperoImage,
                CreatedAt = pepero.CreatedAt
            });
        }
    }
}
