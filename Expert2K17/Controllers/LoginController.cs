using Expert2K17.Data;
using Expert2K17.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly Db _db;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly PromoteToAdminOptions _promoteToAdminOptions;

        public LoginController(Db db, SignInManager<User> signInManager, UserManager<User> userManager, IOptions<PromoteToAdminOptions> promoteToAdminOptionsAccessor)
        {
            _db = db;
            _signInManager = signInManager;
            _userManager = userManager;
            _promoteToAdminOptions = promoteToAdminOptionsAccessor.Value;
        }

        // GET: api/login
        // Returns current user information
        [HttpGet]
        public async Task<UserLogin> GetAsync()
        {
            var userId = _userManager.GetUserId(User);
            var user = await GetUserDataAsync(userId);
            return new UserLogin
            {
                IsLogged = user != null,
                User = user
            };
        }

        // POST api/login
        // login
        [HttpPost]
        public async Task<LoginResult> Post([FromBody]LoginData data)
        {
            var result = await _signInManager.PasswordSignInAsync(data.UserName, data.Password, data.RememberMe != false, lockoutOnFailure: true);
            var myResult = new LoginResult(result);
            if (result.Succeeded)
            {
                var user = await _signInManager.UserManager.FindByNameAsync(data.UserName);
                var userId = user.Id;
                myResult.User = await GetUserDataAsync(userId);
            }
            return myResult;
        }

        // PUT api/register
        // register
        [HttpPut]
        public async Task<RegisterResult> Put([FromBody]RegisterData data)
        {
            var user = new User
            {
                UserName = data.UserName,
                Surname = data.Surname,
                Name = data.Name,
                Patronymic = data.Patronymic
            };
            var group = await _db.Groups.Where(e => e.Group == data.Group && e.Year.Year == data.Year).FirstOrDefaultAsync();
            user.Group = group;
            var result = await _userManager.CreateAsync(user, data.Password);
            var myResult = new RegisterResult(result);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: true);
                myResult.User = await GetUserDataAsync(user.Id);
            }
            return myResult;
        }

        // DELETE api/login
        // logout
        [HttpDelete]
        public async Task Delete()
        {
            await _signInManager.SignOutAsync();
        }

        // PATCH api/login
        // PromoteToAdmin
        [HttpPatch]
        public async Task<IActionResult> Patch(string token)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }
            if (token != _promoteToAdminOptions.PromoteToAdminToken)
            {
                return BadRequest();
            }
            if (await _userManager.IsInRoleAsync(user, Role.Admin))
            {
                return Ok("Already admin");
            }
            var result = await _userManager.AddToRoleAsync(user, Role.Admin);
            if (result.Succeeded)
            {
                return Ok("Now admin");
            }
            return BadRequest(result.Errors);
        }

        private async Task<UserData> GetUserDataAsync(string userId)
        {
            var user = await _db.Users.Include(e => e.Group.Year).FirstOrDefaultAsync(e => e.Id == userId);
            if (user != null)
            {
                var isAdmin = await _userManager.IsInRoleAsync(user, Role.Admin);
                return new UserData
                {
                    Id = user.Id,
                    UserName = user.UserName,

                    Name = user.Name,
                    Surname = user.Surname,
                    Patronymic = user.Patronymic,

                    Group = user.Group?.Group,
                    Year = user.Year?.Year,

                    IsAdmin = isAdmin,

                    Userpic = user.Userpic,
                    Cover = user.Cover
                };
            }
            else
            {
                return null;
            }
        }

        public class LoginResult : Microsoft.AspNetCore.Identity.SignInResult
        {
            public UserData User { get; set; }

            public LoginResult(Microsoft.AspNetCore.Identity.SignInResult result)
            {
                Succeeded = result.Succeeded;
                RequiresTwoFactor = result.RequiresTwoFactor;
                IsLockedOut = result.IsLockedOut;
                IsNotAllowed = result.IsNotAllowed;
            }
        }

        public class UserLogin
        {
            public bool IsLogged { get; set; }
            public UserData User { get; set; }
        }

        public class UserData
        {
            public string Id { get; set; }
            public string UserName { get; set; }

            public string Surname { get; set; }
            public string Name { get; set; }
            public string Patronymic { get; set; }

            public string Group { get; set; }
            public string Year { get; set; }

            public bool IsAdmin { get; set; }

            public string Userpic { get; set; }
            public string Cover { get; set; }
        }

        public class LoginData
        {
            public string UserName { get; set; }
            public string Password { get; set; }
            public bool? RememberMe { get; set; }
        }

        public class RegisterData
        {
            public string UserName { get; set; }
            public string Password { get; set; }

            public string Surname { get; set; }
            public string Name { get; set; }
            public string Patronymic { get; set; }

            public string Group { get; set; }
            public string Year { get; set; }
        }

        public class RegisterResult : IdentityResult
        {
            public UserData User { get; set; }
            public new IEnumerable<IdentityError> Errors { get; set; }

            public RegisterResult(IdentityResult result)
            {
                Succeeded = result.Succeeded;
                Errors = result.Errors;
            }
        }
    }
}
