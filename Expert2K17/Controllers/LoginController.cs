using Expert2K17.Data;
using Expert2K17.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly Db _db;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public LoginController(Db db, SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _db = db;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        // GET: api/login
        // Returns current user information
        [HttpGet]
        public async Task<UserData> GetAsync()
        {
            var userId = _userManager.GetUserId(User);
            return await GetUserDataAsync(userId);
        }

        // POST api/login
        // login
        [HttpPost]
        public async Task<LoginResult> Post(string login, string password, bool rememberMe = true)
        {
            var result = await _signInManager.PasswordSignInAsync(login, password, rememberMe, lockoutOnFailure: true);
            var myResult = new LoginResult(result);
            if (result.Succeeded)
            {
                var user = await _signInManager.UserManager.FindByNameAsync(login);
                var userId = user.Id;
                myResult.User = await GetUserDataAsync(userId);
            }
            return myResult;
        }

        // DELETE api/login
        // logout
        public async Task Delete()
        {
            await _signInManager.SignOutAsync();
        }

        private async Task<UserData> GetUserDataAsync(string userId)
        {
            var user = await _db.Users.Include(e => e.Group.Year).FirstOrDefaultAsync(e => e.Id == userId);
            if (user != null)
            {
                return new UserData
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Name = user.Name,
                    Surname = user.Surname,
                    Patronymic = user.Patronymic,
                    Group = user.Group?.Group,
                    Year = user.Year?.Year
                };
            }
            else
            {
                return null;
            }
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
    }
}
