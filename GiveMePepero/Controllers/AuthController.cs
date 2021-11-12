using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GiveMePepero.Models;
using GiveMePepero.Models.Request;
using GiveMePepero.Models.Response;
using GiveMePepero.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GiveMePepero.Controllers
{
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly DatabaseContext _database;
        private readonly JwtService _jwtService;

        public AuthController(DatabaseContext database, JwtService jwtService)
        {
            _database = database;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AccessTokenResponseModel>> Login([FromBody] LoginRequestModel model)
        {
            var user = await _database.Users.SingleOrDefaultAsync(u => u.Login == model.Login);

            if (user == null)
                return Unauthorized();

            if (!Crypto.VerifyHashedPassword(user.Password, model.Password))
                return Unauthorized();

            var expires = DateTime.UtcNow.AddHours(1);
            var refreshExpires = DateTime.UtcNow.AddMonths(1);
            var responseModel = new AccessTokenResponseModel
            {
                AccessToken = _jwtService.GenerateToken(user.Id, expires),
                RefreshToken = _jwtService.GenerateToken(user.Id, refreshExpires),
                Expires = expires,
                RefreshExpires = refreshExpires
            };

            return Ok(responseModel);
        }

        [HttpPost("join")]
        public async Task<ActionResult> Join([FromBody] JoinRequestModel model)
        {
            if (await _database.Users.AnyAsync(u => u.Login == model.Login))
            {
                return Conflict();
            }

            var user = new PeperoUser
            {
                Login = model.Login,
                Name = model.Name,
                Password = Crypto.HashPassword(model.Password)
            };

            _database.Users.Add(user);
            await _database.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("checkAvailable")]
        public async Task<ActionResult<CheckAvailableResponseModel>> Check(string login)
        {
            if (await _database.Users.AnyAsync(u => u.Login == login))
            {
                return Ok(new CheckAvailableResponseModel
                {
                    Available = false
                });
            }

            return Ok(new
            {
                Available = true
            });
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AccessTokenResponseModel>> Refresh([FromBody] RefreshRequestModel model)
        {
            var subject = _jwtService.GetSubject(model.RefreshToken);
            
            var expires = DateTime.UtcNow.AddHours(1);
            var refreshExpires = DateTime.UtcNow.AddMonths(1);
            var responseModel = new AccessTokenResponseModel
            {
                AccessToken = _jwtService.GenerateToken(subject, expires),
                RefreshToken = _jwtService.GenerateToken(subject, refreshExpires),
                Expires = expires,
                RefreshExpires = refreshExpires
            };

            return Ok(responseModel);
        }
    }
}
